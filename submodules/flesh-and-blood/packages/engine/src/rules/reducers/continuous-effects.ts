import type { FabMatchState, FabZoneKind } from "../../state.ts";
import type { FabEventBindings, FabEventId, FabObjectSnapshot, ProposedEvent } from "../events.ts";
import type { FabEventReduction } from "../../kernel/transaction-kernel.ts";
import type {
  FabContinuousApplication,
  FabContinuousEffectInstance,
  FabResolvedBindings,
  FabRulesSubjectRef,
} from "../continuous/ir.ts";
import { continuousSubjectKey, sameContinuousLatchSubject } from "../continuous/subject-key.ts";
import { isExactAttackBinding } from "../proposals/shared.ts";
import { invalidateFabRuntimeDerived } from "../../runtime-derived.ts";
import { findObjectZone } from "../state-rules-view.ts";
import { setObjectMarker } from "./shared.ts";

export type ContinuousEffectEventName =
  | "continuous-effect-generated"
  | "continuous-effect-future-object-observed"
  | "continuous-effect-ceased"
  | "continuous-effect-applied"
  | "continuous-effect-changed"
  | "continuous-effect-stopped-applying"
  | "gain-keyword";

type ContinuousEffectEvent = Extract<ProposedEvent, { name: ContinuousEffectEventName }>;

export function reduceContinuousEffectEvent(
  state: FabMatchState,
  event: ContinuousEffectEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "continuous-effect-generated": {
      if (
        state.continuousEffectInstances.some(
          (continuous) => continuous.effectId === event.data.effectId,
        )
      )
        return null;
      const simultaneousTimestamp =
        event.data.simultaneousGroupId === null
          ? null
          : (state.continuousEffectInstances.find(
              (instance) =>
                instance.timestamp.simultaneousGroupId === event.data.simultaneousGroupId,
            )?.timestamp.sequence ?? null);
      if (simultaneousTimestamp === null) state.counters.timestamp += 1;
      const createdByEventId: FabEventId = `event-${state.counters.event + 1}`;
      const generated = {
        effectId: event.data.effectId,
        controllerId: event.data.controllerId,
        source: event.data.source,
        effectPath: event.data.effectPath,
        atoms: event.data.atoms,
        timestamp: {
          sequence: simultaneousTimestamp ?? state.counters.timestamp,
          simultaneousGroupId: event.data.simultaneousGroupId,
        },
        duration: event.data.duration,
        createdByEventId,
        expiresAt: event.data.expiresAt,
        // Zone moves in the same journal may bump incarnation after subjects
        // were snapshotted for proposal. Re-anchor to the live object identity
        // so play-permissions (and similar rules) still apply post-banish/move.
        initialSubjects: event.data.initialSubjects.map((subject) => {
          const live = state.objects[subject.instanceId];
          const currentRef = live
            ? { instanceId: subject.instanceId, incarnation: live.incarnation }
            : { instanceId: subject.instanceId, incarnation: subject.incarnation };
          return "attack" in subject ? { ...currentRef, attack: subject.attack } : currentRef;
        }),
        futureApplicability: event.data.futureApplicability
          ? {
              filter: event.data.futureApplicability.filter,
              events: event.data.futureApplicability.events,
              observesOpponent: event.data.futureApplicability.observesOpponent,
              count: event.data.futureApplicability.count,
              remaining: event.data.futureApplicability.count,
              ordinal: event.data.futureApplicability.ordinal,
              resets: event.data.futureApplicability.resets,
              sourceInstanceIds: event.data.futureApplicability.sourceInstanceIds,
              observedSubjects: [],
              latchedSubjects: [],
            }
          : null,
        applications: [],
        ...(event.data.observeAsBecome ? { observeAsBecome: true } : {}),
      };
      if (event.data.origin.kind === "layer") {
        state.continuousEffectInstances.push({
          ...generated,
          origin: "layer",
          lockedBindings: resolveContinuousBindings(state, event.bindings),
        });
      } else if (event.data.origin.kind === "resolution-window") {
        // CR 7 window projection: lifecycle is expiresAt-driven (combat-chain
        // / turn), never reconciler-ceased like statics.
        state.continuousEffectInstances.push({
          ...generated,
          origin: "resolution-window",
          abilityId: event.data.origin.abilityId,
        });
      } else {
        state.continuousEffectInstances.push({
          ...generated,
          origin: "static",
          abilityId: event.data.origin.abilityId,
          introducedDuringProcessId:
            event.data.origin.introducedAtStage === null ? null : event.processId,
          introducedAtStage: event.data.origin.introducedAtStage,
        });
      }
      return { state };
    }
    case "continuous-effect-future-object-observed": {
      const index = state.continuousEffectInstances.findIndex(
        (candidate) => candidate.effectId === event.data.effectId,
      );
      const instance = state.continuousEffectInstances[index];
      const future = instance?.futureApplicability;
      if (
        !instance ||
        !future ||
        future.observedSubjects.some((ref) =>
          sameContinuousLatchSubject(ref, event.data.subject),
        ) ||
        (event.data.latched && future.remaining <= 0)
      )
        return null;
      state.continuousEffectInstances[index] = {
        ...instance,
        futureApplicability: {
          ...future,
          remaining: event.data.latched ? future.remaining - 1 : future.remaining,
          observedSubjects: [...future.observedSubjects, event.data.subject],
          latchedSubjects: event.data.latched
            ? [...future.latchedSubjects, event.data.subject]
            : future.latchedSubjects,
        },
      };
      return { state };
    }
    case "continuous-effect-ceased": {
      const ceased = state.continuousEffectInstances.find(
        (instance) => instance.effectId === event.data.effectId,
      );
      const before = state.continuousEffectInstances.length;
      state.continuousEffectInstances = state.continuousEffectInstances.filter(
        (instance) => instance.effectId !== event.data.effectId,
      );
      if (state.continuousEffectInstances.length === before) return null;
      if (ceased) {
        for (const application of ceased.applications) {
          unstampFreezeMarkerIfIdle(state, application.atomId, application.subject, ceased);
          restoreControllerSeatIfIdle(state, application.subject);
        }
        // Duration steal/gain-control may have moved the object via a discrete
        // zone event without a persisted controller application. Reclaim every
        // initial subject whose controller atom has expired (CR 8.5.35 / 8.5.54).
        if (ceased.atoms.some((atom) => atom.kind === "controller")) {
          for (const subject of ceased.initialSubjects) {
            const instanceId = "instanceId" in subject ? subject.instanceId : null;
            if (!instanceId) continue;
            restoreControllerSeatIfIdle(state, {
              kind: "object",
              ref: { instanceId, incarnation: subject.incarnation },
            });
          }
        }
      }
      return { state };
    }
    case "continuous-effect-applied": {
      const index = state.continuousEffectInstances.findIndex(
        (instance) => instance.effectId === event.data.application.effectId,
      );
      const instance = state.continuousEffectInstances[index];
      if (
        !instance ||
        event.data.application.firstAppliedAt.sequence !== state.counters.timestamp + 1 ||
        event.data.application.lastChangedAt.sequence !== state.counters.timestamp + 1 ||
        instance.applications.some((application) =>
          sameContinuousApplicationKey(application, event.data.application),
        )
      )
        return null;
      state.counters.timestamp += 1;
      state.continuousEffectInstances[index] = {
        ...instance,
        applications: [...instance.applications, event.data.application],
      };
      stampFreezeMarker(state, state.continuousEffectInstances[index]!, event.data.application);
      stampControllerSeat(state, event.data.application);
      return {
        state,
        followUpEvents: [
          ...continuousPowerObservation(event, event.data.application),
          ...continuousKeywordObservation(event, event.data.application),
        ],
      };
    }
    case "gain-keyword":
      return { state };
    case "continuous-effect-changed": {
      const index = state.continuousEffectInstances.findIndex(
        (instance) => instance.effectId === event.data.application.effectId,
      );
      const instance = state.continuousEffectInstances[index];
      if (!instance) return null;
      const applicationIndex = instance.applications.findIndex((application) =>
        sameContinuousApplicationKey(application, event.data.previous),
      );
      const current = instance.applications[applicationIndex];
      if (
        !current ||
        current.fingerprint !== event.data.previous.fingerprint ||
        event.data.application.firstAppliedAt.sequence !== current.firstAppliedAt.sequence ||
        event.data.application.lastChangedAt.sequence !== state.counters.timestamp + 1
      )
        return null;
      state.counters.timestamp += 1;
      const applications = [...instance.applications];
      applications[applicationIndex] = event.data.application;
      state.continuousEffectInstances[index] = { ...instance, applications };
      return {
        state,
        followUpEvents: continuousPowerObservation(event, event.data.application),
      };
    }
    case "continuous-effect-stopped-applying": {
      const index = state.continuousEffectInstances.findIndex(
        (instance) => instance.effectId === event.data.effectId,
      );
      const instance = state.continuousEffectInstances[index];
      if (!instance) return null;
      const applications = instance.applications.filter(
        (application) =>
          application.atomId !== event.data.atomId ||
          continuousSubjectKey(application.subject) !== continuousSubjectKey(event.data.subject),
      );
      if (applications.length === instance.applications.length) return null;
      state.continuousEffectInstances[index] = { ...instance, applications };
      unstampFreezeMarkerIfIdle(state, event.data.atomId, event.data.subject, instance);
      restoreControllerSeatIfIdle(state, event.data.subject);
      return { state };
    }
    default:
      return assertNeverContinuousEffect(event);
  }
}

function isFreezeAtom(instance: FabContinuousEffectInstance, atomId: string): boolean {
  const atom = instance.atoms.find((candidate) => candidate.atomId === atomId);
  return atom?.kind === "rule" && atom.parameters.kind === "freeze";
}

function freezeSubjectInstanceId(subject: FabRulesSubjectRef): string | null {
  return subject.kind === "object" ? subject.ref.instanceId : null;
}

function subjectHasContinuousFreeze(state: FabMatchState, instanceId: string): boolean {
  return state.continuousEffectInstances.some((instance) =>
    instance.applications.some((application) => {
      if (application.subject.kind !== "object") return false;
      if (application.subject.ref.instanceId !== instanceId) return false;
      return isFreezeAtom(instance, application.atomId);
    }),
  );
}

const CONTROLLABLE_SEATS = [
  "arena",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
] as const satisfies readonly FabZoneKind[];

const CONTROLLABLE_SEAT_SET = new Set<FabZoneKind>(CONTROLLABLE_SEATS);

function controllerApplicationId(application: FabContinuousApplication): string | null {
  return application.contribution.kind === "controller" && application.contribution.controllerId
    ? application.contribution.controllerId
    : null;
}

function activeStolenController(state: FabMatchState, instanceId: string): string | null {
  for (const instance of state.continuousEffectInstances) {
    for (const application of instance.applications) {
      if (application.subject.kind !== "object") continue;
      if (application.subject.ref.instanceId !== instanceId) continue;
      const controllerId = controllerApplicationId(application);
      if (controllerId) return controllerId;
    }
  }
  return null;
}

function liveControllableSeat(
  state: FabMatchState,
  instanceId: string,
): { playerId: string; zone: FabZoneKind } | null {
  for (const playerId of state.playerIds) {
    const zones = state.containers.zonesByPlayerId[playerId];
    if (!zones) continue;
    for (const zone of CONTROLLABLE_SEATS) {
      if (zones[zone].includes(instanceId)) {
        return { playerId, zone };
      }
    }
  }
  const located = findObjectZone(state, instanceId);
  if (!located?.playerId || !CONTROLLABLE_SEAT_SET.has(located.zone)) return null;
  return { playerId: located.playerId, zone: located.zone };
}

function moveObjectToPlayerSeat(
  state: FabMatchState,
  instanceId: string,
  toPlayerId: string,
): void {
  const zone = liveControllableSeat(state, instanceId);
  if (!zone || zone.playerId === toPlayerId) return;
  const fromList = state.containers.zonesByPlayerId[zone.playerId]?.[zone.zone];
  const toList = state.containers.zonesByPlayerId[toPlayerId]?.[zone.zone];
  if (!fromList || !toList) return;
  const index = fromList.indexOf(instanceId);
  if (index < 0) return;
  fromList.splice(index, 1);
  toList.push(instanceId);
  invalidateFabRuntimeDerived(state);
}

function stampControllerSeat(state: FabMatchState, application: FabContinuousApplication): void {
  const controllerId = controllerApplicationId(application);
  if (!controllerId || application.subject.kind !== "object") return;
  moveObjectToPlayerSeat(state, application.subject.ref.instanceId, controllerId);
}

function restoreControllerSeatIfIdle(state: FabMatchState, subject: FabRulesSubjectRef): void {
  if (subject.kind !== "object") return;
  const instanceId = subject.ref.instanceId;
  const stolen = activeStolenController(state, instanceId);
  const ownerId = state.objects[instanceId]?.ownerId;
  moveObjectToPlayerSeat(state, instanceId, stolen ?? ownerId ?? "");
}

function stampFreezeMarker(
  state: FabMatchState,
  instance: FabContinuousEffectInstance,
  application: FabContinuousApplication,
): void {
  if (!isFreezeAtom(instance, application.atomId)) return;
  const instanceId = freezeSubjectInstanceId(application.subject);
  if (instanceId) setObjectMarker(state, instanceId, "frozen", true);
}

function unstampFreezeMarkerIfIdle(
  state: FabMatchState,
  atomId: string,
  subject: FabRulesSubjectRef,
  previousInstance: FabContinuousEffectInstance,
): void {
  if (!isFreezeAtom(previousInstance, atomId)) return;
  const instanceId = freezeSubjectInstanceId(subject);
  if (instanceId && !subjectHasContinuousFreeze(state, instanceId)) {
    setObjectMarker(state, instanceId, "frozen", false);
  }
}

/** Drop `until-start-of-own-next-turn` CEs at that player's start and unstamp freeze. */
export function dropExpiredPlayerTurnStartEffects(
  state: FabMatchState,
  turnPlayerId: string,
): void {
  const kept: FabContinuousEffectInstance[] = [];
  const ceased: FabContinuousEffectInstance[] = [];
  for (const continuous of state.continuousEffectInstances) {
    const expired =
      continuous.expiresAt.kind === "player-turn-start" &&
      continuous.expiresAt.playerId === turnPlayerId &&
      continuous.expiresAt.afterTurnNumber < state.turnNumber;
    if (expired) ceased.push(continuous);
    else kept.push(continuous);
  }
  state.continuousEffectInstances = kept;
  for (const instance of ceased) {
    for (const application of instance.applications) {
      unstampFreezeMarkerIfIdle(state, application.atomId, application.subject, instance);
      restoreControllerSeatIfIdle(state, application.subject);
    }
  }
}

// --- Continuous-effect domain helpers ---

function continuousKeywordObservation(
  event: ProposedEvent<"continuous-effect-applied" | "continuous-effect-changed">,
  application: FabContinuousApplication,
): readonly ProposedEvent<"gain-keyword">[] {
  const contribution = application.contribution;
  if (
    application.subject.kind !== "object" ||
    contribution.kind !== "property" ||
    contribution.operation !== "grant" ||
    contribution.property.kind !== "keyword"
  )
    return [];
  const subjectRef = application.subject.ref;
  const object = event.affected.find(
    (candidate) =>
      candidate.ref.instanceId === subjectRef.instanceId &&
      candidate.ref.incarnation === subjectRef.incarnation,
  );
  if (!object) return [];
  return [
    {
      ...event,
      name: "gain-keyword",
      affected: [object],
      source: object,
      bindings: { ...event.bindings, it: object },
      data: {
        object,
        controllerId: event.controllerId ?? "",
        keyword: contribution.property.keyword.name,
      },
    },
  ];
}

function continuousPowerObservation(
  event: ProposedEvent<"continuous-effect-applied" | "continuous-effect-changed">,
  application: FabContinuousApplication,
): readonly ProposedEvent<"modify-power">[] {
  const contribution = application.contribution;
  if (
    application.subject.kind !== "object" ||
    contribution.kind !== "numeric" ||
    contribution.property !== "power" ||
    contribution.previousValue === null ||
    contribution.value === null ||
    contribution.previousValue === contribution.value
  )
    return [];
  const subjectRef = application.subject.ref;
  const object = event.affected.find(
    (candidate) =>
      candidate.ref.instanceId === subjectRef.instanceId &&
      candidate.ref.incarnation === subjectRef.incarnation,
  );
  if (!object) return [];
  return [
    {
      ...event,
      name: "modify-power",
      affected: [object],
      data: {
        object,
        from: contribution.previousValue,
        to: contribution.value,
      },
    },
  ];
}

function resolveContinuousBindings(
  state: FabMatchState,
  bindings: ProposedEvent<"continuous-effect-generated">["bindings"],
): FabResolvedBindings {
  const objects: Record<string, FabObjectSnapshot[]> = {};
  const numbers: Record<string, number> = {};
  const strings: Record<string, string> = {};
  for (const [key, value] of Object.entries(bindings)) {
    if (typeof value === "number") numbers[key] = value;
    else if (typeof value === "string") strings[key] = value;
    else if (isExactAttackBinding(value)) objects[key] = [value.object];
    else if (isObjectBindingList(value)) objects[key] = [...value];
    else if (typeof value === "object") objects[key] = [value];
  }
  return {
    objects: Object.fromEntries(
      Object.entries(objects).map(([key, values]) => [
        key,
        values.map((value) => {
          // A preceding event in the same journal can move the bound card and
          // bump its incarnation (Mantle banish → copy). Persist the live ref
          // while retaining the captured LKI for all other characteristics.
          const live = state.objects[value.instanceId];
          return live ? { instanceId: live.instanceId, incarnation: live.incarnation } : value.ref;
        }),
      ]),
    ),
    numbers,
    strings,
  };
}

function isObjectBindingList(
  value: FabEventBindings[string],
): value is readonly FabObjectSnapshot[] {
  return Array.isArray(value);
}

function sameContinuousApplicationKey(
  left: Pick<FabContinuousApplication, "effectId" | "atomId" | "subject">,
  right: Pick<FabContinuousApplication, "effectId" | "atomId" | "subject">,
): boolean {
  return (
    left.effectId === right.effectId &&
    left.atomId === right.atomId &&
    continuousSubjectKey(left.subject) === continuousSubjectKey(right.subject)
  );
}

function assertNeverContinuousEffect(event: never): never {
  throw new Error(`Unhandled FAB continuous-effect event: ${JSON.stringify(event)}`);
}

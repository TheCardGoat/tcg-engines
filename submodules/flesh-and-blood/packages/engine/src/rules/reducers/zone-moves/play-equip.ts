import type { FabEffect, FabModalAbility, FabResolutionAbility } from "@tcg/flesh-and-blood-types";
import type { FabMatchState } from "../../../state.ts";
import type { FabObjectDeclarationFact } from "../../../game/objects.ts";
import { declaredSplitBaseProperties } from "../../../cards.ts";
import type { ProposedEvent } from "../../events.ts";
import type { FabEventReduction } from "../../../kernel/transaction-kernel.ts";
import { openFabPriority } from "../../../priority.ts";
import { snapshotObject } from "../../snapshots.ts";
import { buildFabRulesViewWithLki, resolveFabEventBindings } from "../../state-rules-view.ts";
import { effectTreeWindowRuleModification } from "../../continuous/window-rules.ts";
import { engineZone, moveKnownObject, setFaceDownMarker } from "../shared.ts";
import {
  destinationZone,
  isResolvingResolutionAbility,
  resolutionEffects,
  keywordEffectsFromPrintedKeywords,
} from "./helpers.ts";
import { fabPlayerLogCard, fabPlayerLogModalModeText } from "../../../player-log.ts";

type FamilyEvent = Extract<ProposedEvent, { name: "announce-card" | "play" | "equip" }>;

/** Zone-move reduction for: announce-card, play, equip */
export function reducePlayEquip(
  state: FabMatchState,
  event: FamilyEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "announce-card": {
      // Cross-owner plays (Nuu free blue from opposing banished) leave the
      // source seat's banished/deck/graveyard and enter the *acting* hero's
      // stack — destinationPlayerId is the announce actor, not the zone owner.
      if (
        !moveKnownObject(
          state,
          event.data.object,
          event.data.from,
          "stack",
          event.data.destinationRef,
          undefined,
          event.data.actorId,
        )
      )
        return null;
      const record = state.objects[event.data.object.instanceId];
      if (!record) return null;
      // "This play" origin as a declaration fact (played-from-arsenal and
      // friends), scoped to the current play instead of lifetime move
      // history — a card that round-tripped arsenal → hand plays from hand.
      // Stamped at announce, where the origin zone is declared and before any
      // stack-phase condition can observe the play.
      const facts: FabObjectDeclarationFact[] = (record.declarationFacts ?? []).filter(
        (fact) => fact.kind !== "played-from",
      );
      facts.push({ kind: "played-from", zone: event.data.from });
      state.objects[event.data.object.instanceId] = {
        ...record,
        cardPropertyState: event.data.splitPlayMethod ?? { kind: "whole-card" },
        declarationFacts: facts,
      };
      // CR 5.1: announcing a card puts it on the public stack. A card played
      // from a private zone must no longer retain that zone's face-down state.
      setFaceDownMarker(state, event.data.object.instanceId, false);
      // Announcement is tentative until the play procedure commits. The
      // completed `play` reduction below owns the player-facing narration.
      return { state, playerLogFacts: [] };
    }
    case "play": {
      const player = state.players[event.data.actorId];
      if (!player) return null;
      {
        const played = state.objects[event.data.object.instanceId];
        if (played) {
          const chiCount =
            resolveFabEventBindings(event.bindings).numbers["pitched-this-way-chi-count"] ?? 0;
          state.objects[event.data.object.instanceId] = {
            ...played,
            declarationFacts: [
              ...(played.declarationFacts ?? []).filter(
                (fact) =>
                  fact.kind !== "numeric-binding" || fact.binding !== "pitched-this-way-chi-count",
              ),
              {
                kind: "numeric-binding",
                binding: "pitched-this-way-chi-count",
                value: chiCount,
              },
            ],
            ...(event.data.role === "attack"
              ? {
                  declarationFacts: [
                    ...(played.declarationFacts ?? []).filter(
                      (fact) =>
                        fact.kind !== "played-at-chain-link" &&
                        (fact.kind !== "numeric-binding" ||
                          fact.binding !== "pitched-this-way-chi-count"),
                    ),
                    {
                      kind: "numeric-binding" as const,
                      binding: "pitched-this-way-chi-count",
                      value: chiCount,
                    },
                    {
                      kind: "played-at-chain-link" as const,
                      chainLinkNumber: (state.combat?.chainLinkNumber ?? 0) + 1,
                    },
                  ],
                }
              : {}),
          };
        }
      }
      if (event.data.from === "banished") {
        const played = state.objects[event.data.object.instanceId];
        const hasRuneGate = event.data.object.current.keywords.some(
          (keyword) => keyword.name === "rune-gate",
        );
        if (played && hasRuneGate) {
          state.objects[event.data.object.instanceId] = {
            ...played,
            declarationFacts: [
              ...(played.declarationFacts ?? []).filter((fact) => fact.kind !== "rune-gate"),
              { kind: "rune-gate" },
            ],
          };
        }
      }
      if (
        !state.containers.zonesByPlayerId[event.data.actorId]!.stack.includes(
          event.data.object.instanceId,
        ) &&
        !moveKnownObject(
          state,
          event.data.object,
          event.data.from,
          "stack",
          event.data.destinationRef,
          undefined,
          event.data.actorId,
        )
      ) {
        return null;
      }
      if (
        !state.rulesStack.some(
          (layer) => layer.kind === "card" && layer.instanceId === event.data.object.instanceId,
        )
      ) {
        const stackObject = snapshotObject(
          state,
          event.data.object.instanceId,
          event.data.actorId,
          "stack",
        );
        const evaluatedObject = stackObject;
        const definition = event.data.object.canonicalId
          ? state.cardDefinitions[event.data.object.canonicalId]
          : undefined;
        const meldedSplit =
          event.data.splitPlayMethod?.kind === "meld" && definition?.layout.kind === "split";
        const rightBase =
          meldedSplit && definition
            ? declaredSplitBaseProperties(definition, { kind: "face", face: "right" })
            : null;
        const leftBase =
          meldedSplit && definition
            ? declaredSplitBaseProperties(definition, { kind: "face", face: "left" })
            : null;
        if (meldedSplit && (!rightBase || !leftBase)) return null;
        state.counters.layer += 1;
        const bindingSnapshots = Object.values(event.bindings).flatMap((binding) =>
          Array.isArray(binding)
            ? binding.filter(
                (entry): entry is typeof stackObject =>
                  typeof entry === "object" && entry !== null && "ref" in entry,
              )
            : typeof binding === "object" && binding !== null && "ref" in binding
              ? [binding as typeof stackObject]
              : [],
        );
        const resolutionRulesView = buildFabRulesViewWithLki(state, [
          stackObject,
          ...bindingSnapshots,
        ]);
        const resolutionBindings = resolveFabEventBindings(event.bindings);
        const resolutionConditionHolds = (
          ability: FabResolutionAbility | FabModalAbility,
        ): boolean =>
          !ability.condition ||
          resolutionRulesView.evaluateCondition(ability.condition, {
            controllerId: event.data.actorId,
            source: stackObject.ref,
            subject: stackObject.ref,
            bindings: resolutionBindings,
          });
        const rebaseTargetKeys = (
          targets: import("../../targets.ts").FabTargetMap,
          start: number,
          count: number,
          effects: readonly FabEffect[],
        ): import("../../targets.ts").FabTargetMap => {
          const remapped = Object.fromEntries(
            Object.entries(targets).flatMap(([key, targetIds]) => {
              const match = /^effect-(\d+)(:.*)$/.exec(key);
              if (!match) return [];
              const effectIndex = Number(match[1]);
              if (effectIndex < start || effectIndex >= start + count) return [];
              return [[`effect-${effectIndex - start}${match[2]}`, targetIds] as const];
            }),
          );
          // Play declares any-hero as effect-N:target. Ability.condition wraps
          // that leaf as conditional.then, so resolution looks up
          // effect-0:then:target. Alias the play-time key onto the step.
          const playDeclared = remapped["effect-0:target"];
          if (
            effects.length === 1 &&
            effects[0]?.type === "conditional" &&
            playDeclared &&
            playDeclared.length > 0 &&
            remapped["effect-0:then:target"] === undefined
          ) {
            return { ...remapped, "effect-0:then:target": playDeclared };
          }
          return remapped;
        };
        const resolutionStep = (
          properties: typeof evaluatedObject.current,
          targetStart: number,
          _targetCount: number,
        ) => {
          const abilities = properties.abilities
            .filter(isResolvingResolutionAbility)
            // CR 7 defend/activation window: defend/activate rule-modifications
            // printed on an attacking Action card are projected by the
            // continuous reconciler while the attack sits on the stack/combat
            // chain — compiling them again here (after the window) would both
            // double-materialize the rule and miss its printed window.
            .filter(
              (ability) =>
                !(
                  properties.typeBox.types.includes("Action") &&
                  properties.typeBox.subtypes.includes("Attack") &&
                  effectTreeWindowRuleModification("effect" in ability ? ability.effect : undefined)
                ),
            );
          const abilityEffects = abilities.flatMap((ability) =>
            resolutionEffects(ability, event.data.modes),
          );
          const layerKeywords = abilities.flatMap((ability) =>
            ability.kind === "resolution" && resolutionConditionHolds(ability)
              ? (ability.layerKeywords ?? []).map((keyword) => keyword.name)
              : [],
          );
          const keywordEffects = keywordEffectsFromPrintedKeywords(
            properties.keywords,
            abilityEffects,
          );
          // Catalog numeric metadata does not declare an executable effect.
          const trailingEffects = keywordEffects;
          let abilityOffset = 0;
          const steps = abilities.map((ability, abilityIndex) => {
            const effects = resolutionEffects(ability, event.data.modes);
            const start = abilityOffset;
            abilityOffset += effects.length;
            const isLast = abilityIndex === abilities.length - 1;
            return {
              faceId: properties.activeFaceIds[0],
              abilityIds: [ability.id],
              effects: [...effects, ...(isLast ? trailingEffects : [])],
              targets: rebaseTargetKeys(
                event.data.targets,
                targetStart + start,
                effects.length,
                effects,
              ),
            };
          });
          if (steps.length === 0) {
            steps.push({
              faceId: properties.activeFaceIds[0],
              abilityIds: [],
              effects: trailingEffects,
              targets: {},
            });
          }
          return {
            layerKeywords: [
              ...properties.keywords.map((keyword) => keyword.name),
              ...layerKeywords,
            ],
            steps,
          };
        };
        const leftDeclaredEffectCount = leftBase
          ? leftBase.abilities
              .filter(isResolvingResolutionAbility)
              .flatMap((ability) => resolutionEffects(ability, event.data.modes)).length
          : 0;
        const rightDeclaredEffectCount = rightBase
          ? rightBase.abilities
              .filter(isResolvingResolutionAbility)
              .flatMap((ability) => resolutionEffects(ability, event.data.modes)).length
          : 0;
        const leftStep = leftBase ? resolutionStep(leftBase, 0, leftDeclaredEffectCount) : null;
        const rightStep = rightBase
          ? resolutionStep(rightBase, leftDeclaredEffectCount, rightDeclaredEffectCount)
          : null;
        const onlyDeclaredEffectCount = evaluatedObject.current.abilities
          .filter(isResolvingResolutionAbility)
          .flatMap((ability) => resolutionEffects(ability, event.data.modes)).length;
        const onlyStep = resolutionStep(evaluatedObject.current, 0, onlyDeclaredEffectCount);
        const candidateResolutionSteps =
          rightStep && leftStep
            ? ([...rightStep.steps, ...leftStep.steps] as const)
            : ([...onlyStep.steps] as const);
        const firstResolutionStep = candidateResolutionSteps[0];
        if (!firstResolutionStep) return null;
        const resolutionSteps: readonly [
          typeof firstResolutionStep,
          ...(typeof firstResolutionStep)[],
        ] = [firstResolutionStep, ...candidateResolutionSteps.slice(1)];
        const keywords = [
          ...new Set(
            (rightStep && leftStep ? [rightStep, leftStep] : [onlyStep]).flatMap(
              (plan) => plan.layerKeywords,
            ),
          ),
        ];
        state.rulesStack.push({
          kind: "card",
          propertyState: event.data.splitPlayMethod ?? { kind: "whole-card" },
          playTiming: event.data.playTiming,
          playedFrom: event.data.from,
          role: event.data.role,
          layerId: `layer-${state.counters.layer}`,
          controllerId: event.data.actorId,
          source: evaluatedObject,
          modes: event.data.modes,
          bindings: event.bindings,
          keywords,
          instanceId: event.data.object.instanceId,
          resolutionPlan: { steps: resolutionSteps, cursor: 0 },
          attackTarget: event.data.attackTarget,
          additionalAttackTargets: event.data.additionalAttackTargets ?? [],
        });
      }
      if (event.data.role === "attack") {
        if (state.combat?.open) {
          state.combat.step = "layer";
          state.combat.defenseDeclarationPending = false;
        } else {
          state.combat = {
            open: true,
            step: "layer",
            activeLink: null,
            defenseDeclarationPending: false,
            chainLinkNumber: 0,
            closedLinks: [],
          };
        }
        // Store printed name (not canonicalId) so "last attack this turn" status
        // gates and name filters share one vocabulary.
        const printedNames =
          event.data.object.current.names.length > 0
            ? event.data.object.current.names
            : event.data.object.base.names;
        player.history.turn.lastAttackNames = [...printedNames];
        player.history.combatChain.lastAttackNames = [...printedNames];
      }
      openFabPriority(state, event.data.actorId, "layer", state.combat?.step ?? null, {
        kind: "own-action",
        sourceInstanceId: event.data.object.instanceId,
      });
      if (event.data.object.current.typeBox.types.includes("Instant")) {
        player.history.turn.playedInstant = true;
        player.history.chainLink.playedInstant = true;
      }
      if (event.data.object.current.typeBox.subtypes.includes("Aura")) {
        player.history.turn.playedOrCreatedAura = true;
      }
      return {
        state,
        playerLogFacts: [
          {
            kind: "card-played",
            actorId: event.data.actorId,
            card: fabPlayerLogCard(event.data.object),
            from: event.data.from,
          },
          ...(() => {
            const modal = event.data.object.current.abilities.find(
              (ability): ability is FabModalAbility => ability.kind === "modal",
            );
            if (!modal) return [];
            const modeTexts = event.data.modes.flatMap((modeId) => {
              const mode = modal.modes.find((candidate) => candidate.id === modeId);
              return mode ? [fabPlayerLogModalModeText(mode)] : [];
            });
            if (modeTexts.length !== event.data.modes.length) return [];
            return [
              {
                kind: "modal-modes-declared" as const,
                actorId: event.data.actorId,
                card: fabPlayerLogCard(event.data.object),
                modeTexts,
              },
            ];
          })(),
        ],
      };
    }
    case "equip": {
      // Prefer destinationZone so weapon1/weapon2 slots resolve; fall back to
      // engineZone for head/chest/arms/legs equipment destinations.
      const destination = destinationZone(event.data) ?? engineZone(event.data.to);
      const alreadySeated =
        !!destination &&
        (state.containers.zonesByPlayerId[event.data.playerId]?.[destination].includes(
          event.data.object.instanceId,
        ) ??
          false);
      // Start-of-game seating already placed the object; still commit the
      // observation so "when you equip" triggers fire once. Mid-game equip
      // pairs with a move-zone event and is observation-only here.
      const object = state.objects[event.data.object.instanceId];
      if (!object) return null;
      if (!alreadySeated && !destination) return null;
      if (
        !object.markers.some(
          (marker) => marker.kind === "status" && marker.value === "equip-observed",
        )
      ) {
        state.objects[event.data.object.instanceId] = {
          ...object,
          markers: [...object.markers, { kind: "status", value: "equip-observed" }],
        };
      }
      return { state };
    }
    default: {
      const _exhaustive: never = event;
      void _exhaustive;
      return null;
    }
  }
}

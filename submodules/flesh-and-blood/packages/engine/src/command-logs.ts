import type {
  FabCombatLogRole,
  FabCombatLogState,
  FabCommand,
  FabCommandStatus,
  FabMoveLog,
  FabMoveLogMessage,
} from "./moves.ts";
import type { CommittedEvent, FabGameEventName, FabObjectSnapshot } from "./rules/events.ts";
import type { FabAttackTarget } from "./game/combat.ts";
import type { FabRulesSnapshot } from "./kernel/transaction-kernel.ts";
import { findObject } from "./rules/proposals/shared.ts";
import {
  fabGameEndReasonLabel,
  fabObjectDisplayName,
  fabObjectDisplayNames,
  renderFabLogTemplate,
} from "./log/index.ts";
import { fabPlayerLogModalModeText } from "./player-log.ts";
import type {
  FabLogActivityReference,
  FabLogContext,
  FabLogFact,
  FabLogKey,
  FabLogValuesFor,
} from "./log/index.ts";

/** Render a typed registry message with the `en` template as its default text. */
function logMessage<TKey extends FabLogKey>(
  key: TKey,
  values: FabLogValuesFor<TKey>,
  objectRefs?: Readonly<
    Partial<Record<string, { readonly instanceId: string; readonly canonicalId: string | null }>>
  >,
  activityRef?: FabLogActivityReference,
  combatRole?: FabCombatLogRole,
  combatState?: FabCombatLogState,
  narrativeRole?: import("./log/index.ts").FabLogNarrativeRole,
): FabMoveLogMessage {
  return {
    key,
    values,
    ...(objectRefs && Object.keys(objectRefs).length > 0 ? { objectRefs } : {}),
    ...(activityRef ? { activityRef } : {}),
    ...(combatRole ? { combatRole } : {}),
    ...(combatState ? { combatState } : {}),
    ...(narrativeRole ? { narrativeRole } : {}),
    defaultMessage: renderFabLogTemplate(key, values),
  };
}

function combatRoleForCard(object: FabObjectSnapshot): FabCombatLogRole | undefined {
  const { types, subtypes } = object.current.typeBox;
  if (subtypes.includes("Attack")) return "attack";
  if (types.includes("Attack Reaction")) return "attack-reaction";
  if (types.includes("Defense Reaction")) return "defense-reaction";
  return undefined;
}

function combatRoleForActivation(event: CommittedEvent<"activate">): FabCombatLogRole | undefined {
  switch (event.data.ability.abilityType) {
    case "attack-reaction":
      return "attack-reaction";
    case "defense-reaction":
      return "defense-reaction";
    default:
      return combatRoleForCard(event.data.object);
  }
}

function objectReference(object: FabObjectSnapshot): {
  readonly instanceId: string;
  readonly canonicalId: string | null;
} {
  return { instanceId: object.instanceId, canonicalId: object.canonicalId };
}

/**
 * Per-event fact emitters. `satisfies` keeps the written key set literal (for
 * the compile-time coverage assertion below) while contextually typing each
 * handler's event payload.
 */
type FabLogFactEmitterMap = {
  readonly [K in FabGameEventName]?: (
    event: CommittedEvent<K>,
    context: FabLogContext,
  ) => readonly FabLogFact[];
};

/** Zones whose contents are hidden information (CR 3.0.4b, 3.7.1, 3.9.1). */
const FAB_PRIVATE_ZONE_NAMES = new Set(["hand", "deck", "arsenal"]);

function clashPowerLabel(power: number | null, hasPower: boolean, revealedCard: boolean): string {
  if (!revealedCard || power === null) return "no card";
  if (!hasPower) return "no power";
  return `${power} power`;
}

/**
 * Reasons that also commit a dedicated, logged event for the same transition.
 * Logging the generic move here as well would duplicate the narrative line.
 */
const MOVE_ZONE_REASONS_WITH_DEDICATED_EVENTS = new Set([
  "destroy",
  "banish",
  "die",
  "leave-arena",
  "put-into-graveyard",
  "discard",
  "play",
  "equip",
  "create",
]);

function zoneName(zone: FabObjectSnapshot["zone"]): string {
  return String(zone);
}

function zoneActorId(object: FabObjectSnapshot): string {
  return object.controllerId ?? object.ownerId;
}

/** Attack target label; hero targets use the seat id, objects resolve by name. */
function attackTargetName(target: FabAttackTarget, context: FabLogContext): string {
  if (target.kind === "hero") return target.playerId;
  const resolved = context.displayNameForInstanceId(target.ref.instanceId);
  if (resolved) return resolved;
  if (target.kind === "ally") return "an ally";
  if (target.kind === "spectra") return "a spectra";
  return "a permanent";
}

function attackTargetRefName(
  target: import("./game/combat.ts").FabAttackTargetRef,
  context: FabLogContext,
): string {
  if (target.kind === "hero") return target.playerId;
  return context.displayNameForInstanceId(target.ref.instanceId) ?? "a permanent";
}

function signedCounterLabel(value: number, property: string): string {
  return `${value >= 0 ? `+${value}` : value} ${property}`;
}

function attackLimitTimesLabel(operation: "set-total" | "additional", count: number): string {
  switch (operation) {
    case "set-total":
      return count === 2 ? "twice" : `${count} times`;
    case "additional":
      return count === 1 ? "an additional time" : `${count} additional times`;
    default: {
      const _exhaustive: never = operation;
      return _exhaustive;
    }
  }
}

function keywordDisplayName(keyword: string): string {
  return keyword.replaceAll("-", " ");
}

function signedPowerLabel(amount: number): string {
  return amount > 0 ? `+${amount}` : `${amount}`;
}

export const FAB_LOG_FACT_EMITTERS = {
  // --- Core play facts -----------------------------------------------------

  "announce-card": (event) => {
    const combatRole = combatRoleForCard(event.data.object);
    return [
      {
        key: "flesh-and-blood.play",
        values: { actorId: event.data.actorId, cardName: fabObjectDisplayName(event.data.object) },
        objectRefs: { cardName: objectReference(event.data.object) },
        category: "action",
        ...(combatRole ? { combatRole } : {}),
      },
    ];
  },
  play: (event) => {
    const combatRole = combatRoleForCard(event.data.object);
    return [
      {
        key: "flesh-and-blood.play",
        values: { actorId: event.data.actorId, cardName: fabObjectDisplayName(event.data.object) },
        objectRefs: { cardName: objectReference(event.data.object) },
        category: "action",
        ...(combatRole ? { combatRole } : {}),
      },
    ];
  },
  activate: (event, context) => {
    const combatRole = combatRoleForActivation(event);
    const declaredTargets = Object.values(event.data.targets).flat();
    const soleTarget = declaredTargets.length === 1 ? declaredTargets[0] : null;
    const targetName =
      soleTarget?.kind === "player"
        ? soleTarget.playerId
        : soleTarget?.kind === "object"
          ? context.publicDisplayNameForInstanceId?.(soleTarget.ref.instanceId)
          : null;
    if (soleTarget && targetName) {
      return [
        {
          key: "flesh-and-blood.activate.targeting",
          values: {
            actorId: event.data.actorId,
            cardName: fabObjectDisplayName(event.data.object),
            targetName,
          },
          objectRefs: {
            cardName: objectReference(event.data.object),
            ...(soleTarget.kind === "object"
              ? {
                  targetName: {
                    instanceId: soleTarget.ref.instanceId,
                    canonicalId: null,
                  },
                }
              : {}),
          },
          category: "action",
          ...(combatRole ? { combatRole } : {}),
        },
      ];
    }
    return [
      {
        key: "flesh-and-blood.activate",
        values: { actorId: event.data.actorId, cardName: fabObjectDisplayName(event.data.object) },
        objectRefs: { cardName: objectReference(event.data.object) },
        category: "action",
        ...(combatRole ? { combatRole } : {}),
      },
    ];
  },
  pitch: (event) => [
    {
      key: "flesh-and-blood.pitch",
      values: {
        playerId: event.data.playerId,
        cardName: fabObjectDisplayName(event.data.object),
        resources: event.data.resourcesGenerated,
      },
      category: "action",
    },
  ],
  defend: (event) => [
    {
      key: "flesh-and-blood.defend",
      values: { actorId: event.data.actorId, cardName: fabObjectDisplayName(event.data.object) },
      objectRefs: { cardName: objectReference(event.data.object) },
      category: "combat",
      combatRole: "block",
      combatState: {
        kind: "defense",
        cardDefense: Math.max(0, event.data.object.current.numeric.defense ?? 0),
      },
    },
  ],

  // Single draws flow through the table; consecutive same-player draws are
  // aggregated by `semanticMoveLogs` into one count line (see below).
  draw: (event) => {
    const playerId = event.data.playerId;
    const cardName = fabObjectDisplayName(event.data.object);
    return [
      { key: "flesh-and-blood.draw", values: { playerId }, category: "action" },
      {
        key: "flesh-and-blood.draw.private",
        values: { playerId, cardNames: cardName },
        objectRefs: { cardNames: objectReference(event.data.object) },
        category: "action",
        visibleTo: [playerId],
      },
    ];
  },

  // --- Search / look / opt / reveal ----------------------------------------

  // The search event commits before the picker binds: interactive searches
  // carry an empty `found`, and each pick arrives as a later `move-zone`
  // (reason "search") that owns the found-identity fact below. The public
  // line therefore never claims a count it cannot know (CR 3.0.4b).
  search: (event) => [
    {
      key: "flesh-and-blood.search",
      values: { playerId: event.data.playerId },
      category: "action",
    },
  ],
  look: (event) => {
    const playerId = event.data.playerId;
    return [
      { key: "flesh-and-blood.look", values: { playerId }, category: "action" },
      {
        key: "flesh-and-blood.look.private",
        values: { playerId, cardName: fabObjectDisplayName(event.data.object) },
        category: "action",
        visibleTo: [playerId],
      },
    ];
  },
  opt: (event, context) => {
    const playerId = event.data.playerId;
    const namesFor = (instanceIds: readonly string[]): string =>
      instanceIds.length === 0
        ? "nothing"
        : instanceIds.map((id) => context.displayNameForInstanceId(id) ?? "a card").join(", ");
    return [
      event.data.count === 1
        ? { key: "flesh-and-blood.opt", values: { playerId }, category: "action" }
        : {
            key: "flesh-and-blood.opt.cards",
            values: {
              playerId,
              topCount: event.data.top.length,
              topPlural: event.data.top.length === 1 ? "" : "s",
              bottomCount: event.data.bottom.length,
              bottomPlural: event.data.bottom.length === 1 ? "" : "s",
            },
            category: "action",
          },
      {
        key: "flesh-and-blood.opt.private",
        values: {
          playerId,
          topNames: namesFor([...event.data.top].reverse()),
          bottomNames: namesFor(event.data.bottom),
        },
        category: "action",
        // Deck order is hidden information (CR 4.4.3c): placement is owner-only.
        visibleTo: [playerId],
      },
    ];
  },
  reveal: (event) => [
    {
      key: "flesh-and-blood.reveal",
      values: { playerId: event.data.playerId, cardName: fabObjectDisplayName(event.data.object) },
      objectRefs: { cardName: objectReference(event.data.object) },
      category: "action",
    },
  ],

  // --- Zone transitions ----------------------------------------------------

  discard: (event) => [
    {
      key: event.data.random ? "flesh-and-blood.discard.random" : "flesh-and-blood.discard",
      values: {
        playerId: event.data.playerId,
        cardName: fabObjectDisplayName(event.data.object),
      },
      category: "action",
      narrativeRole: event.data.reason === "effect" ? "activity" : "detail",
      objectRefs: { cardName: objectReference(event.data.object) },
    },
  ],
  banish: (event) => {
    // Boost already owns a richer narrative fact naming both the attack and
    // the banished card. The underlying banish is an implementation detail,
    // and may be committed in a different accepted command by the resolver.
    if (event.bindings.boostBanished !== undefined) return [];
    const object = event.data.object;
    const playerId = zoneActorId(object);
    const faceDown = Boolean(event.data.faceDown || object.faceDown);
    // CR 3.0.4a: banished is public. CR 3.0.8: a private object that would be
    // public at the destination becomes public before it moves. Face-up deck
    // banishes therefore name the card. Face-down banishes stay identity-hidden
    // (CR 3.0.8 face-down in a public zone is private; deck is CR 3.7.1).
    if (faceDown) {
      return event.source
        ? [
            {
              key: "flesh-and-blood.banish.hidden.by-source",
              values: {
                playerId,
                sourceName: fabObjectDisplayName(event.source),
                from: zoneName(object.zone),
              },
              objectRefs: { sourceName: objectReference(event.source) },
              category: "action",
            },
          ]
        : [{ key: "flesh-and-blood.banish.hidden", values: { playerId }, category: "action" }];
    }
    return [
      {
        key: "flesh-and-blood.banish",
        values: { playerId, cardName: fabObjectDisplayName(object) },
        objectRefs: { cardName: objectReference(object) },
        category: "action",
      },
    ];
  },
  destroy: (event) => {
    const object = event.data.object;
    const source = event.source;
    if (source && source.instanceId !== object.instanceId) {
      return [
        {
          key: "flesh-and-blood.destroy",
          values: { cardName: fabObjectDisplayName(object) },
          objectRefs: { cardName: objectReference(object) },
          category: "action",
          narrativeRole: "diagnostic",
        },
        {
          key: "flesh-and-blood.destroy.by-source",
          values: {
            sourceName: fabObjectDisplayName(source),
            cardName: fabObjectDisplayName(object),
          },
          objectRefs: {
            sourceName: objectReference(source),
            cardName: objectReference(object),
          },
          category: "action",
        },
      ];
    }
    return [
      {
        key: "flesh-and-blood.destroy",
        values: { cardName: fabObjectDisplayName(object) },
        objectRefs: { cardName: objectReference(object) },
        category: "action",
      },
    ];
  },
  dies: (event) => [
    {
      key: "flesh-and-blood.dies",
      values: { cardName: fabObjectDisplayName(event.data.object) },
      category: "action",
    },
  ],
  "put-into-graveyard": (event) => [
    {
      key: "flesh-and-blood.put-into-graveyard",
      values: { cardName: fabObjectDisplayName(event.data.object) },
      category: "action",
      objectRefs: { cardName: objectReference(event.data.object) },
    },
  ],
  "enter-arena": (event) => [
    {
      key:
        event.data.entersTapped === true
          ? "flesh-and-blood.enter-arena.tapped"
          : "flesh-and-blood.enter-arena",
      values: {
        playerId: zoneActorId(event.data.object),
        cardName: fabObjectDisplayName(event.data.object),
      },
      category: "action",
    },
  ],
  "leave-arena": (event) => [
    {
      key: "flesh-and-blood.leave-arena",
      values: {
        playerId: zoneActorId(event.data.object),
        cardName: fabObjectDisplayName(event.data.object),
      },
      category: "action",
    },
  ],
  "move-zone": (event) => {
    const data = event.data;
    if (MOVE_ZONE_REASONS_WITH_DEDICATED_EVENTS.has(data.reason)) return [];
    const from = zoneName(data.from);
    const to = zoneName(data.to);
    const playerId = data.destinationPlayerId ?? zoneActorId(data.object);
    // CR 4.4.3c / 8.5.15c: insertion position is never logged. Identity is
    // public knowledge unless the move is face-down or leaves a hidden zone
    // (hand / deck / arsenal); an explicit face-up load (arsenal) re-publishes
    // the identity even from a hidden zone.
    const identityHidden =
      data.faceDown === true ||
      data.object.faceDown ||
      (data.faceDown !== false && FAB_PRIVATE_ZONE_NAMES.has(from));
    const facts: FabLogFact[] = [
      identityHidden
        ? {
            key: "flesh-and-blood.move-zone.hidden",
            values: { playerId, from, to },
            category: "action",
          }
        : {
            key: "flesh-and-blood.move-zone",
            values: {
              playerId,
              cardName: fabObjectDisplayName(data.object),
              from,
              to,
            },
            objectRefs: { cardName: objectReference(data.object) },
            category: "action",
          },
    ];
    // A search pick moves through here with its identity hidden; only the
    // searching player learns what was found (CR 3.0.4b, 3.9.1).
    if (data.reason === "search" && identityHidden) {
      facts.push({
        key: "flesh-and-blood.search.found",
        values: { playerId, cardName: fabObjectDisplayName(data.object) },
        category: "action",
        visibleTo: [playerId],
      });
    }
    return facts;
  },
  "shuffle-zone": (event) => [
    {
      key: "flesh-and-blood.shuffle-zone",
      values: { playerId: event.data.playerId, zone: zoneName(event.data.zone) },
      category: "action",
    },
  ],
  "turn-face-up": (event) => [
    {
      key: "flesh-and-blood.turn-face-up",
      values: {
        playerId: event.data.playerId,
        cardName: fabObjectDisplayName(event.data.object),
      },
      category: "action",
    },
  ],
  "turn-face-down": (event) => [
    {
      key: "flesh-and-blood.turn-face-down",
      values: {
        playerId: event.data.playerId,
        cardName: fabObjectDisplayName(event.data.object),
      },
      category: "action",
    },
  ],
  equip: (event) => [
    {
      key: "flesh-and-blood.equip",
      values: {
        playerId: event.data.playerId,
        cardName: fabObjectDisplayName(event.data.object),
      },
      category: "action",
    },
  ],
  create: (event) => {
    const source = event.source;
    if (source) {
      return [
        {
          key: "flesh-and-blood.create",
          values: {
            playerId: event.data.playerId,
            cardName: fabObjectDisplayName(event.data.object),
          },
          category: "action",
          narrativeRole: "diagnostic",
        },
        {
          key: "flesh-and-blood.create.by-source",
          values: {
            sourceName: fabObjectDisplayName(source),
            playerId: event.data.playerId,
            cardName: fabObjectDisplayName(event.data.object),
          },
          objectRefs: { sourceName: objectReference(source) },
          category: "action",
        },
      ];
    }
    return [
      {
        key: "flesh-and-blood.create",
        values: {
          playerId: event.data.playerId,
          cardName: fabObjectDisplayName(event.data.object),
        },
        category: "action",
      },
    ];
  },
  become: (event) => [
    {
      key: "flesh-and-blood.become",
      values: {
        cardName: fabObjectDisplayName(event.data.object),
        previousName: event.data.previous ? fabObjectDisplayName(event.data.previous) : "a card",
      },
      category: "action",
    },
  ],
  transform: (event) => {
    const intoObject = event.data.intoObject ?? event.data.destination?.object ?? null;
    return [
      {
        key: "flesh-and-blood.transform",
        values: {
          cardName: fabObjectDisplayName(event.data.previous),
          intoName: intoObject
            ? fabObjectDisplayName(intoObject)
            : (event.data.into ?? "a new form"),
        },
        objectRefs: {
          cardName: objectReference(event.data.previous),
          ...(intoObject ? { intoName: objectReference(intoObject) } : {}),
        },
        category: "action",
      },
    ];
  },

  // --- Card-identity mechanics ---------------------------------------------

  boost: (event) => [
    event.data.banished
      ? {
          key: "flesh-and-blood.boost.banish",
          values: {
            actorId: event.data.actorId,
            cardName: fabObjectDisplayName(event.data.object),
            banishedName: fabObjectDisplayName(event.data.banished),
          },
          objectRefs: {
            cardName: objectReference(event.data.object),
            banishedName: objectReference(event.data.banished),
          },
          category: "action",
        }
      : {
          key: "flesh-and-blood.boost",
          values: {
            actorId: event.data.actorId,
            cardName: fabObjectDisplayName(event.data.object),
          },
          category: "action",
        },
  ],
  charge: (event) => [
    {
      key: "flesh-and-blood.charge",
      values: {
        actorId: event.data.actorId,
        cardName: fabObjectDisplayName(event.data.object),
        chargedName: fabObjectDisplayName(event.data.charged),
      },
      category: "action",
    },
  ],
  fuse: (event) => [
    {
      key: "flesh-and-blood.fuse",
      values: {
        actorId: event.data.actorId,
        cardName: fabObjectDisplayName(event.data.object),
        revealedNames: fabObjectDisplayNames(event.data.revealed),
      },
      category: "action",
    },
  ],
  fragment: (event) => [
    {
      key: "flesh-and-blood.fragment",
      values: { actorId: event.data.actorId, cardName: fabObjectDisplayName(event.data.object) },
      category: "action",
    },
  ],
  usurp: (event) => [
    {
      key: "flesh-and-blood.usurp",
      values: { actorId: event.data.actorId, cardName: fabObjectDisplayName(event.data.object) },
      category: "action",
    },
  ],
  // CR 8.3.29: `intent` records the play-time crank preview — only the actual
  // crank (intent: false) is a player-visible line.
  crank: (event) =>
    event.data.intent
      ? []
      : [
          {
            key: "flesh-and-blood.crank",
            values: {
              actorId: event.data.actorId,
              cardName: fabObjectDisplayName(event.data.object),
            },
            category: "action",
          },
        ],
  transcend: (event) => [
    {
      key: "flesh-and-blood.transcend",
      values: { actorId: event.data.actorId, cardName: fabObjectDisplayName(event.data.object) },
      category: "action",
    },
  ],
  "complete-contract": (event) => [
    {
      key: "flesh-and-blood.complete-contract",
      values: { actorId: event.data.actorId, cardName: fabObjectDisplayName(event.data.object) },
      category: "action",
    },
  ],
  "beat-chest": (event) => [
    {
      key: "flesh-and-blood.beat-chest",
      values: {
        actorId: event.data.actorId,
        // The actor beats their own chest (Brute mechanic).
        chestOwner: event.data.actorId,
        cardNames: fabObjectDisplayNames(event.data.discarded),
      },
      category: "action",
    },
  ],
  awaken: (event) => [
    {
      key: "flesh-and-blood.awaken",
      values: {
        playerId: event.data.playerId,
        cardName: fabObjectDisplayName(event.data.object),
      },
      category: "action",
    },
  ],
  "change-active-face": (event) => [
    {
      key: "flesh-and-blood.change-active-face",
      values: {
        cardName: fabObjectDisplayName(event.data.object),
        faceId: String(event.data.faceId),
      },
      category: "action",
    },
  ],

  // --- Combat narrative -----------------------------------------------------

  attack: (event, context) => {
    const causalSource = "source" in event.cause ? event.cause.source : event.source;
    const common = {
      category: "combat" as const,
      combatRole: "attack" as const,
      objectRefs: { cardName: objectReference(event.data.object) },
      combatState: {
        kind: "attack" as const,
        after: {
          attack: Math.max(0, event.data.object.current.numeric.power ?? 0),
          defense: 0,
        },
      },
    };
    if (causalSource && causalSource.instanceId !== event.data.object.instanceId) {
      return [
        {
          key: "flesh-and-blood.attack",
          values: {
            actorId: event.data.actorId,
            cardName: fabObjectDisplayName(event.data.object),
            targetName: attackTargetName(event.data.target, context),
          },
          ...common,
          narrativeRole: "diagnostic",
        },
        {
          key: "flesh-and-blood.attack.by-source",
          values: {
            sourceName: fabObjectDisplayName(causalSource),
            cardName: fabObjectDisplayName(event.data.object),
            targetName: attackTargetName(event.data.target, context),
          },
          ...common,
        },
      ];
    }
    return [
      {
        key: "flesh-and-blood.attack",
        values: {
          actorId: event.data.actorId,
          cardName: fabObjectDisplayName(event.data.object),
          targetName: attackTargetName(event.data.target, context),
        },
        ...common,
      },
    ];
  },
  // The damage-resolution observation carries every declared target, so the
  // lower-level per-target events do not duplicate player-facing outcomes.
  hit: () => [],
  // Misses produce no `hit` event, so the damage-step observation owns the
  // miss line (including the vanished-declared-target path). The `result`
  // value distinguishes a fully blocked attack from a whiffed one.
  "resolve-combat-damage": (event, context) => {
    return event.data.outcomes.map((outcome, index) => {
      const combatState: FabCombatLogState = {
        kind: "outcome",
        final: {
          attack: event.data.attackPower,
          defense: outcome.totalDefense,
        },
        damage: outcome.damage,
      };
      if (outcome.damage > 0) {
        return {
          key: "flesh-and-blood.combat.hit",
          values: {
            cardName: fabObjectDisplayName(event.data.attack),
            targetName: attackTargetRefName(outcome.target, context),
            damage: outcome.damage,
          },
          category: "combat",
          combatState,
        };
      }
      return {
        key:
          index === 0 && event.data.defendedBy.length > 0
            ? "flesh-and-blood.combat.blocked"
            : "flesh-and-blood.combat.missed",
        values: {
          cardName: fabObjectDisplayName(event.data.attack),
          targetName: attackTargetRefName(outcome.target, context),
        },
        category: "combat",
        combatState,
      };
    });
  },
  "combat-chain-close": () => [
    {
      key: "flesh-and-blood.combat.chain-close",
      values: {},
      category: "combat",
    },
  ],
  "dealt-damage": (event) => {
    // Combat damage is narrated by the merged hit/miss line from the same
    // transaction; only non-combat damage takes a standalone line here.
    if (event.cause.kind === "rule" && event.cause.rule === "combat-damage") {
      return [];
    }
    const playerId =
      "playerId" in event.data.target ? event.data.target.playerId : event.data.target.ownerId;
    const sourceName = event.data.source ? fabObjectDisplayName(event.data.source) : null;
    // Physical damage is the unmarked case; other types keep their adjective.
    const damageType = String(event.data.damageType);
    if (damageType === "physical") {
      return [
        sourceName === null
          ? {
              key: "flesh-and-blood.damage",
              values: { playerId, amount: event.data.amount },
              category: "combat",
            }
          : {
              key: "flesh-and-blood.damage.with-source",
              values: { playerId, amount: event.data.amount, sourceName },
              category: "combat",
            },
      ];
    }
    return [
      sourceName === null
        ? {
            key: "flesh-and-blood.damage.typed",
            values: { playerId, amount: event.data.amount, damageType },
            category: "combat",
          }
        : {
            key: "flesh-and-blood.damage.with-source.typed",
            values: { playerId, amount: event.data.amount, damageType, sourceName },
            category: "combat",
          },
    ];
  },
  prevent: (event) => {
    const playerId =
      "playerId" in event.data.target ? event.data.target.playerId : event.data.target.ownerId;
    const sourceName = event.source ? fabObjectDisplayName(event.source) : "an effect";
    return [
      {
        key: "flesh-and-blood.prevent",
        values: { playerId, amount: event.data.preventedAmount, sourceName },
        ...(event.source ? { objectRefs: { sourceName: objectReference(event.source) } } : {}),
        category: "combat",
      },
    ];
  },

  // --- Wagers, clashes, rolls ----------------------------------------------

  wager: (event) => [
    {
      key: "flesh-and-blood.wager",
      values: {
        actorId: event.data.actorId,
        cardName: fabObjectDisplayName(event.data.object),
      },
      category: "combat",
    },
  ],
  "wager-loss": (event) => {
    const cardName = fabObjectDisplayName(event.data.attack);
    return [
      {
        key: "flesh-and-blood.wager.win",
        values: { playerId: event.data.winnerId, cardName },
        category: "combat",
      },
      {
        key: "flesh-and-blood.wager.loss",
        values: { playerId: event.data.loserId, cardName },
        category: "combat",
      },
    ];
  },
  "clash-outcome": (event) => {
    const first =
      event.data.revealed.find((object) => object.ownerId === event.data.firstPlayerId) ?? null;
    const second =
      event.data.revealed.find((object) => object.ownerId === event.data.secondPlayerId) ?? null;
    const firstPowerLabel = clashPowerLabel(
      event.data.firstPower,
      event.data.firstHasPower,
      first !== null,
    );
    const secondPowerLabel = clashPowerLabel(
      event.data.secondPower,
      event.data.secondHasPower,
      second !== null,
    );
    const facts: FabLogFact[] = [
      {
        key: "flesh-and-blood.clash.outcome",
        values: {
          firstPlayerId: event.data.firstPlayerId,
          firstCardName: first ? fabObjectDisplayName(first) : "no card",
          firstPowerLabel,
          secondPlayerId: event.data.secondPlayerId,
          secondCardName: second ? fabObjectDisplayName(second) : "no card",
          secondPowerLabel,
        },
        objectRefs: {
          ...(first ? { firstCardName: objectReference(first) } : {}),
          ...(second ? { secondCardName: objectReference(second) } : {}),
        },
        category: "combat",
      },
    ];
    if (event.data.winnerId === null) {
      facts.push({
        key: "flesh-and-blood.clash.tie",
        values: { firstPowerLabel, secondPowerLabel },
        category: "combat",
      });
    } else {
      const firstWon = event.data.winnerId === event.data.firstPlayerId;
      facts.push({
        key: "flesh-and-blood.clash.win",
        values: {
          winnerId: event.data.winnerId,
          winnerPowerLabel: firstWon ? firstPowerLabel : secondPowerLabel,
          loserPowerLabel: firstWon ? secondPowerLabel : firstPowerLabel,
        },
        category: "combat",
      });
    }
    return facts;
  },
  roll: (event) => [
    {
      key: "flesh-and-blood.roll",
      values: {
        playerId: event.data.playerId,
        sides: event.data.sides,
        result: event.data.result,
      },
      category: "combat",
    },
  ],

  // --- Resources, life, counters, statuses -----------------------------------

  // Only life/chi costs narrate: resource and action-point spend is already
  // visible on the pitch / play lines of the same command.
  "spend-assets": (event) => {
    const facts: FabLogFact[] = [];
    if (event.data.life > 0) {
      facts.push({
        key: "flesh-and-blood.cost-life",
        values: { playerId: event.data.playerId, life: event.data.life },
        category: "rules",
      });
    }
    if (event.data.chi > 0) {
      facts.push({
        key: "flesh-and-blood.cost-chi",
        values: { playerId: event.data.playerId, chi: event.data.chi },
        category: "rules",
      });
    }
    return facts;
  },
  "gain-life": (event) =>
    event.data.amount === 0
      ? []
      : [
          {
            key: "flesh-and-blood.gain-life",
            values: { playerId: event.data.playerId, amount: event.data.amount },
            category: "rules",
          },
        ],
  // Effect-sourced asset gains are the only player-facing record of the amount
  // (Blossom of Spring / Diamond Amulet): narrate per quantity. Procedural
  // companions (origin "procedure", e.g. the crank action point) echo a line
  // that is already narrated (pitch / crank) and stay unlogged.
  "gain-assets": (event) => {
    if (event.data.origin !== "effect" || !event.source) return [];
    const facts: FabLogFact[] = [];
    if (event.data.resources > 0) {
      facts.push({
        key: "flesh-and-blood.assets.granted",
        values: {
          playerId: event.data.playerId,
          resources: event.data.resources,
          plural: event.data.resources === 1 ? "" : "s",
          cardName: fabObjectDisplayName(event.source),
        },
        category: "rules",
      });
    }
    if (event.data.actionPoints > 0) {
      facts.push({
        key: "flesh-and-blood.assets.granted.action-points",
        values: {
          playerId: event.data.playerId,
          actionPoints: event.data.actionPoints,
          plural: event.data.actionPoints === 1 ? "" : "s",
          cardName: fabObjectDisplayName(event.source),
        },
        category: "rules",
      });
    }
    // Chi and amp are mass nouns — no pluralization slot.
    if (event.data.chi > 0) {
      facts.push({
        key: "flesh-and-blood.assets.granted.chi",
        values: {
          playerId: event.data.playerId,
          chi: event.data.chi,
          cardName: fabObjectDisplayName(event.source),
        },
        category: "rules",
      });
    }
    if (event.data.amp > 0) {
      facts.push({
        key: "flesh-and-blood.assets.granted.amp",
        values: {
          playerId: event.data.playerId,
          amp: event.data.amp,
          cardName: fabObjectDisplayName(event.source),
        },
        category: "rules",
      });
    }
    return facts;
  },
  "lose-life": (event) => {
    if (event.data.amount === 0) return [];
    if (event.cause.kind === "rule" && event.cause.rule === "blood-debt" && event.source) {
      return [
        {
          key: "flesh-and-blood.lose-life",
          values: { playerId: event.data.playerId, amount: event.data.amount },
          category: "rules",
          narrativeRole: "diagnostic",
        },
        {
          key: "flesh-and-blood.lose-life.blood-debt",
          values: {
            playerId: event.data.playerId,
            amount: event.data.amount,
            sourceName: fabObjectDisplayName(event.source),
          },
          category: "rules",
        },
      ];
    }
    return [
      {
        key: "flesh-and-blood.lose-life",
        values: { playerId: event.data.playerId, amount: event.data.amount },
        category: "rules",
      },
    ];
  },
  "go-again": (event) => [
    {
      key: "flesh-and-blood.go-again",
      values: { cardName: fabObjectDisplayName(event.data.object) },
      category: "rules",
    },
  ],
  "activation-limit-modifier-generated": (event) => {
    const object = event.data.object;
    const source = event.source;
    return [
      {
        key: "flesh-and-blood.may-attack",
        values: {
          sourceName: source ? fabObjectDisplayName(source) : "An effect",
          cardName: fabObjectDisplayName(object),
          timesLabel: attackLimitTimesLabel(event.data.operation, event.data.count),
        },
        objectRefs: {
          cardName: objectReference(object),
          ...(source ? { sourceName: objectReference(source) } : {}),
        },
        category: "rules",
      },
    ];
  },
  "crowd-cheers": (event) => [
    {
      key: "flesh-and-blood.crowd-cheers",
      values: { playerId: event.data.playerId },
      category: "rules",
    },
  ],
  "crowd-boos": (event) => [
    {
      key: "flesh-and-blood.crowd-boos",
      values: { playerId: event.data.playerId },
      category: "rules",
    },
  ],
  protect: (event) => [
    {
      key: "flesh-and-blood.protect",
      values: {
        playerId: event.data.playerId,
        protectedPlayerId: event.data.protectedPlayerId,
      },
      category: "rules",
    },
  ],
  "counter-added": (event) => [
    {
      key: "flesh-and-blood.counter-added",
      values: {
        cardName: fabObjectDisplayName(event.data.object),
        counter: event.data.counter,
        amount: event.data.amount,
        plural: event.data.amount === 1 ? "" : "s",
      },
      category: "rules",
    },
  ],
  "counter-removed": (event) => [
    {
      key: "flesh-and-blood.counter-removed",
      values: {
        cardName: fabObjectDisplayName(event.data.object),
        counter: event.data.counter,
        amount: event.data.amount,
        plural: event.data.amount === 1 ? "" : "s",
      },
      category: "rules",
    },
  ],
  "numeric-counter-added": (event) => [
    {
      key: "flesh-and-blood.numeric-counter-added",
      values: {
        cardName: fabObjectDisplayName(event.data.object),
        counter: signedCounterLabel(event.data.value, event.data.property),
        count: event.data.count,
        plural: event.data.count === 1 ? "" : "s",
      },
      category: "rules",
    },
  ],
  "numeric-counter-removed": (event) => [
    {
      key: "flesh-and-blood.numeric-counter-removed",
      values: {
        cardName: fabObjectDisplayName(event.data.object),
        counter: signedCounterLabel(event.data.value, event.data.property),
        count: event.data.count,
        plural: event.data.count === 1 ? "" : "s",
      },
      category: "rules",
    },
  ],
  "gain-keyword": (event) => [
    {
      key: "flesh-and-blood.gain-keyword",
      values: {
        cardName: fabObjectDisplayName(event.data.object),
        keyword: event.data.keyword,
      },
      category: "rules",
    },
  ],
  "set-status": (event) => {
    if (!event.data.status.startsWith("named-card:") || !event.controllerId) return [];
    return [
      {
        key: "flesh-and-blood.name-card",
        values: {
          playerId: event.controllerId,
          cardName: event.data.status.slice("named-card:".length),
        },
        category: "rules",
      },
    ];
  },
  sharpen: (event) => [
    {
      key: "flesh-and-blood.sharpen",
      values: {
        playerId: event.data.playerId,
        cardName: fabObjectDisplayName(event.data.object),
        count: event.data.count,
        plural: event.data.count === 1 ? "" : "s",
      },
      category: "rules",
    },
  ],
  "modify-power": (event) => [
    {
      key: "flesh-and-blood.modify-power",
      values: {
        cardName: fabObjectDisplayName(event.data.object),
        from: event.data.from,
        to: event.data.to,
      },
      category: "rules",
    },
  ],
  "continuous-effect-generated": (event, context) => {
    const source = event.data.source;
    const sourceName = fabObjectDisplayName(source);
    const sourceRef = objectReference(source);
    const facts: FabLogFact[] = [];
    if (event.data.futureApplicability) {
      for (const atom of event.data.atoms) {
        if (
          atom.kind === "numeric" &&
          atom.property === "power" &&
          atom.operation === "add" &&
          typeof atom.amount === "number" &&
          atom.amount > 0
        ) {
          facts.push({
            key: "flesh-and-blood.next-attack-power-bonus",
            values: { sourceName, amount: atom.amount },
            objectRefs: { sourceName: sourceRef },
            category: "rules",
          });
        }
        if (
          atom.kind === "ability" &&
          atom.operation === "grant" &&
          atom.property.kind === "keyword"
        ) {
          const [attackSourceId] = event.data.futureApplicability.sourceInstanceIds ?? [];
          const attackSourceName = attackSourceId
            ? context.displayNameForInstanceId(attackSourceId)
            : null;
          if (attackSourceId && attackSourceName) {
            const objectRefs = {
              sourceName: sourceRef,
              cardName: { instanceId: attackSourceId, canonicalId: null },
            };
            if (atom.property.keyword.name === "go-again") {
              facts.push({
                key: "flesh-and-blood.next-attack-of-go-again",
                values: {
                  sourceName,
                  cardName: attackSourceName,
                  playerId: event.data.controllerId,
                },
                objectRefs,
                category: "rules",
              });
            } else {
              facts.push({
                key: "flesh-and-blood.next-attack-of-keyword",
                values: {
                  sourceName,
                  cardName: attackSourceName,
                  keyword: keywordDisplayName(atom.property.keyword.name),
                },
                objectRefs,
                category: "rules",
              });
            }
          } else {
            facts.push({
              key: "flesh-and-blood.next-attack-keyword",
              values: {
                sourceName,
                keyword: keywordDisplayName(atom.property.keyword.name),
              },
              objectRefs: { sourceName: sourceRef },
              category: "rules",
            });
          }
        }
      }
    } else if (event.data.origin.kind === "layer") {
      for (const subject of event.data.initialSubjects) {
        if (subject.instanceId === source.instanceId) continue;
        const cardSnapshot = event.affected.find(
          (candidate) => candidate.instanceId === subject.instanceId,
        );
        const cardName =
          context.displayNameForInstanceId(subject.instanceId) ??
          (cardSnapshot ? fabObjectDisplayName(cardSnapshot) : null);
        if (!cardName) continue;
        const cardRef = cardSnapshot
          ? objectReference(cardSnapshot)
          : { instanceId: subject.instanceId, canonicalId: null };
        for (const atom of event.data.atoms) {
          if (
            atom.kind === "ability" &&
            atom.operation === "grant" &&
            atom.property.kind === "keyword"
          ) {
            facts.push({
              key: "flesh-and-blood.gave-keyword",
              values: {
                sourceName,
                cardName,
                keyword: keywordDisplayName(atom.property.keyword.name),
              },
              objectRefs: { sourceName: sourceRef, cardName: cardRef },
              category: "rules",
            });
          }
          if (
            atom.kind === "numeric" &&
            atom.property === "power" &&
            atom.operation === "add" &&
            typeof atom.amount === "number" &&
            atom.amount !== 0
          ) {
            facts.push({
              key: "flesh-and-blood.gave-power",
              values: {
                sourceName,
                cardName,
                amount: signedPowerLabel(atom.amount),
              },
              objectRefs: { sourceName: sourceRef, cardName: cardRef },
              category: "rules",
            });
          }
        }
      }
    }
    if (event.data.duration !== "until-start-of-own-next-turn") return facts;
    const restrictsNameGain = event.data.atoms.some(
      (atom) => atom.kind === "rule" && atom.mode === "restrict" && atom.action === "gain-name",
    );
    if (!restrictsNameGain) return facts;
    const opponentId = context.opponentIdForPlayerId?.(event.data.controllerId) ?? null;
    if (!opponentId) return facts;
    return [
      ...facts,
      {
        key: "flesh-and-blood.name-gain-restricted",
        values: {
          sourceName: fabObjectDisplayName(event.data.source),
          playerId: opponentId,
        },
        objectRefs: { sourceName: objectReference(event.data.source) },
        category: "rules",
      },
    ];
  },
  "continuous-effect-applied": (event) => {
    const { application } = event.data;
    const { contribution, subject } = application;
    if (
      subject.kind !== "object" ||
      contribution.kind !== "property" ||
      contribution.property.kind !== "name"
    ) {
      return [];
    }

    const object = event.affected.find(
      (candidate) => candidate.ref.instanceId === subject.ref.instanceId,
    );
    if (!object) return [];
    const previousNames = object.current.names;
    const sourceName = event.source ? fabObjectDisplayName(event.source) : "A continuous effect";
    const sourceReference = event.source ? objectReference(event.source) : undefined;
    const visibleTo =
      object.visibility === "private"
        ? object.zone === "deck"
          ? null
          : ([object.ownerId] as const)
        : undefined;
    if (visibleTo === null) return [];
    const cardName = object.base.names.join(" // ") || "A card";
    const visibility = visibleTo ? { visibleTo } : {};

    if (contribution.operation === "remove") {
      if (contribution.property.value !== "*" || previousNames.length === 0) return [];
      return [
        {
          key: "flesh-and-blood.lose-names",
          values: { cardName, sourceName },
          objectRefs: {
            cardName: objectReference(object),
            ...(sourceReference ? { sourceName: sourceReference } : {}),
          },
          category: "rules",
          ...visibility,
        },
      ];
    }

    const gainedName = contribution.property.value;
    if (previousNames.some((name) => name.toLocaleLowerCase() === gainedName.toLocaleLowerCase())) {
      return [];
    }
    return [
      {
        key: "flesh-and-blood.gain-name",
        values: { cardName, gainedName, sourceName },
        objectRefs: {
          cardName: objectReference(object),
          ...(sourceReference ? { sourceName: sourceReference } : {}),
        },
        category: "rules",
        ...visibility,
      },
    ];
  },
  "set-tapped": (event) => {
    const source = event.source;
    if (event.data.tapped && source && source.instanceId !== event.data.object.instanceId) {
      return [
        {
          key: "flesh-and-blood.set-tapped",
          values: { cardName: fabObjectDisplayName(event.data.object), state: "tapped" },
          category: "rules",
          narrativeRole: "diagnostic",
        },
        {
          key: "flesh-and-blood.set-tapped.by-source",
          values: {
            sourceName: fabObjectDisplayName(source),
            cardName: fabObjectDisplayName(event.data.object),
          },
          objectRefs: {
            sourceName: objectReference(source),
            cardName: objectReference(event.data.object),
          },
          category: "rules",
        },
      ];
    }
    return [
      {
        key: "flesh-and-blood.set-tapped",
        values: {
          cardName: fabObjectDisplayName(event.data.object),
          state: event.data.tapped ? "tapped" : "untapped",
        },
        category: "rules",
      },
    ];
  },

  // --- Ability resolution --------------------------------------------------

  trigger: (event) => [
    {
      key: "flesh-and-blood.ability.triggered",
      values: { cardName: fabObjectDisplayName(event.data.object) },
      category: "ability",
    },
  ],
  "declare-triggered-layer": (event) => {
    const { layer } = event.data;
    const cardName = fabObjectDisplayName(layer.source);
    const cardRef = objectReference(layer.source);
    const modalResolution = layer.resolution.kind === "modal" ? layer.resolution : null;
    const modeTexts = modalResolution
      ? layer.modes.flatMap((modeId) => {
          const mode = modalResolution.ability.modes.find((candidate) => candidate.id === modeId);
          return mode ? [fabPlayerLogModalModeText(mode)] : [];
        })
      : null;
    return [
      {
        key: "flesh-and-blood.ability.layer",
        values: { cardName },
        objectRefs: { cardName: cardRef },
        category: "ability",
      },
      ...(modeTexts !== null && modeTexts.length === layer.modes.length
        ? [
            {
              key: "flesh-and-blood.modal.modes-chosen" as const,
              values: {
                actorId: layer.controllerId,
                cardName,
                modeCount: modeTexts.length,
                modePlural: modeTexts.length === 1 ? "" : "s",
                modeText: modeTexts.length > 0 ? modeTexts.join(" · ") : "None",
              },
              objectRefs: { cardName: cardRef },
              category: "ability" as const,
            },
          ]
        : []),
    ];
  },

  // --- System lines ---------------------------------------------------------

  "advance-turn": (event) => [
    {
      key: "flesh-and-blood.turn.started",
      values: { turnNumber: event.data.nextTurnNumber },
      category: "system",
    },
  ],
  "lose-game": (event) => [
    {
      key: "flesh-and-blood.game.ended",
      values: { playerId: event.data.playerId, reason: fabGameEndReasonLabel(event.data.reason) },
      category: "system",
    },
  ],
  "start-phase": (event) => [
    {
      key: "flesh-and-blood.phase.start",
      values: { turnPlayerId: event.data.turnPlayerId, phase: event.context.phase },
      category: "system",
    },
  ],
} satisfies FabLogFactEmitterMap;

/**
 * Journal events that deliberately produce no player-facing line. Every
 * `FabGameEventName` must appear either here or as an emitter key above
 * (compile-time assertion below); runtime parity is covered by tests.
 */
export const FAB_LOG_INTENTIONALLY_UNLOGGED = [
  // Companion observation of the concrete enter-arena / leave-arena events.
  "enter-or-leave-arena",
  // Duplicates the attack line (same target, same command).
  "attack-target-declared",
  // Provisional damage observation; dealt-damage logs the committed outcome.
  "deal-damage",
  // Combat machinery whose player-facing outcome is the merged hit/miss line
  // emitted by `hit` / `resolve-combat-damage`.
  "chain-link-resolve",
  "reaction-step",
  "defense-declaration-complete",
  "advance-combat-step",
  // clash / clash-win / clash-lose are observations of clash-outcome, which
  // logs the revealed cards and the winner in one line.
  "clash",
  "clash-win",
  "clash-lose",
  // Trigger-side observation of wager-loss, which logs both outcomes.
  "wager-win",
  // Resource and action-point spend flows echo the play / pitch / cost lines.
  "pay-resources",
  // Internal set-status state stays silent; its emitter narrates only the
  // player-visible card-name declaration.
  // Turn structure is narrated by phase.start / turn.started only.
  "end-phase",
  // Companion observation of start-phase during the action phase.
  "action-phase-start",
  // Engine-internal journal bookkeeping with no player-facing semantics.
  "remove-rules-layer",
  "consume-random-index",
  "expire-replacement-effects",
  "consume-replacement-effects",
  "consume-delayed-triggers",
  "register-delayed-trigger",
  "register-replacement",
  "continuous-effect-ceased",
  "continuous-effect-changed",
  "continuous-effect-stopped-applying",
  "continuous-effect-future-object-observed",
  "random-token-request",
  "roll-request",
  "reset-turn-assets",
  "clash-prize",
  "reclash-request",
  // Internal procedure boundary: it establishes the activated layer before costs.
  "announce-activation",
  // 1v1 product: the sole opposing seat is bound automatically.
  "choose-opponent",
  // Counted publicly by the viewer projection; the optional banish has its own log fact.
  "intimidate",
  // CR 1.8.5f retarget is observed as the subsequent combat damage / hit line.
  "retarget-attack",
] as const satisfies readonly FabGameEventName[];

// Compile-time coverage: every event name is emitted or explicitly unlogged.
type FabLogEmittedEventName = keyof typeof FAB_LOG_FACT_EMITTERS;
type FabLogUncoveredEventName = Exclude<
  FabGameEventName,
  FabLogEmittedEventName | (typeof FAB_LOG_INTENTIONALLY_UNLOGGED)[number]
>;
const fabLogEventCoverageIsComplete: FabLogUncoveredEventName extends never ? true : never = true;
void fabLogEventCoverageIsComplete;

/** Dispatch one committed event through the emitter table. */
export function fabLogFactsForEvent(
  event: CommittedEvent,
  context: FabLogContext,
): readonly FabLogFact[] {
  const handler = (
    FAB_LOG_FACT_EMITTERS as Partial<
      Record<
        FabGameEventName,
        (event: CommittedEvent, context: FabLogContext) => readonly FabLogFact[]
      >
    >
  )[event.name];
  if (!handler) return [];
  const facts = handler(event, context);
  const activityRef = activityReferenceForEvent(event, context);
  return activityRef ? facts.map((fact) => ({ ...fact, activityRef })) : facts;
}

function activityReferenceForEvent(
  event: CommittedEvent,
  context: FabLogContext,
): FabLogActivityReference | undefined {
  if (event.name === "play") {
    return context.stackLayerForInstanceId?.(event.data.object.instanceId, "card") ?? undefined;
  }
  if (event.name === "activate") {
    return (
      context.stackLayerForInstanceId?.(event.data.object.instanceId, "activated") ?? undefined
    );
  }
  if (event.name === "declare-triggered-layer") {
    return context.stackLayerForLayerId?.(event.data.layer.layerId) ?? undefined;
  }
  return event.cause.kind === "layer"
    ? {
        kind: "stack-layer-event",
        layerId: event.cause.layerId,
        controllerId: event.cause.controllerId,
        sourceInstanceId: event.cause.source?.instanceId ?? null,
      }
    : undefined;
}

function activityReferenceKey(activityRef: FabLogActivityReference | undefined): string {
  if (!activityRef) return "none";
  switch (activityRef.kind) {
    case "stack-layer-opened":
      return `${activityRef.kind}:${activityRef.layerId}`;
    case "stack-layer-event":
      return `${activityRef.kind}:${activityRef.layerId}`;
    case "stack-window-event":
      return `${activityRef.kind}:${activityRef.stackWindowId}`;
  }
}

/**
 * Consecutive same-player draw events collapse into one count line with an
 * owner-only identity appendix (CR 3.7.1: hand contents are private).
 */
function fabLogFactsForEvents(
  events: readonly CommittedEvent[],
  context: FabLogContext,
): readonly FabLogFact[] {
  const facts: FabLogFact[] = [];
  let pendingDraw: {
    readonly playerId: string;
    readonly names: string[];
    readonly objectRefs: ReturnType<typeof objectReference>[];
    readonly activityRef?: FabLogActivityReference;
  } | null = null;
  const flushDraw = (): void => {
    if (!pendingDraw) return;
    const { playerId, names, objectRefs, activityRef } = pendingDraw;
    pendingDraw = null;
    if (names.length === 1) {
      facts.push(
        {
          key: "flesh-and-blood.draw",
          values: { playerId },
          category: "action",
          ...(activityRef ? { activityRef } : {}),
        },
        {
          key: "flesh-and-blood.draw.private",
          values: { playerId, cardNames: names[0]! },
          objectRefs: { cardNames: objectRefs[0]! },
          category: "action",
          visibleTo: [playerId],
          ...(activityRef ? { activityRef } : {}),
        },
      );
      return;
    }
    facts.push(
      {
        key: "flesh-and-blood.draw.cards",
        values: { playerId, count: names.length },
        category: "action",
        ...(activityRef ? { activityRef } : {}),
      },
      {
        key: "flesh-and-blood.draw.private",
        values: { playerId, cardNames: names.join(", ") },
        category: "action",
        visibleTo: [playerId],
        ...(activityRef ? { activityRef } : {}),
      },
    );
  };
  for (const event of events) {
    if (event.name === "draw") {
      const activityRef = activityReferenceForEvent(event, context);
      if (
        pendingDraw &&
        pendingDraw.playerId === event.data.playerId &&
        activityReferenceKey(pendingDraw.activityRef) === activityReferenceKey(activityRef)
      ) {
        pendingDraw.names.push(fabObjectDisplayName(event.data.object));
        pendingDraw.objectRefs.push(objectReference(event.data.object));
      } else {
        flushDraw();
        pendingDraw = {
          playerId: event.data.playerId,
          names: [fabObjectDisplayName(event.data.object)],
          objectRefs: [objectReference(event.data.object)],
          ...(activityRef ? { activityRef } : {}),
        };
      }
      continue;
    }
    flushDraw();
    facts.push(...fabLogFactsForEvent(event, context));
  }
  flushDraw();
  return facts;
}

function messageForCommand(
  command: FabCommand,
  actorId: string,
  context: FabLogContext,
  state: FabRulesSnapshot,
): FabMoveLogMessage {
  switch (command.move) {
    case "begin-play":
      return logMessage("flesh-and-blood.command.begin-play", { actorId });
    case "set-optional-trigger-automation":
      return logMessage("flesh-and-blood.command.set-optional-trigger-automation", {
        actorId,
        cardName: context.displayNameForInstanceId(command.instanceId) ?? "unknown card",
      });
    case "set-automation-preferences": {
      const preferenceKeys = Object.keys(command.preferences);
      if (preferenceKeys.length === 1 && command.preferences.addPlayAndSkipHoldCardId) {
        return logMessage("flesh-and-blood.command.play-and-skip-hold-enabled", {
          actorId,
          cardName: displayNameForCanonicalId(state, command.preferences.addPlayAndSkipHoldCardId),
        });
      }
      if (preferenceKeys.length === 1 && command.preferences.removePlayAndSkipHoldCardId) {
        return logMessage("flesh-and-blood.command.play-and-skip-hold-disabled", {
          actorId,
          cardName: displayNameForCanonicalId(
            state,
            command.preferences.removePlayAndSkipHoldCardId,
          ),
        });
      }
      if (preferenceKeys.length === 1 && command.preferences.addOpponentTriggerYieldCardId) {
        return logMessage("flesh-and-blood.command.opponent-trigger-auto-yield-enabled", {
          actorId,
          cardName: displayNameForCanonicalId(
            state,
            command.preferences.addOpponentTriggerYieldCardId,
          ),
        });
      }
      if (preferenceKeys.length === 1 && command.preferences.removeOpponentTriggerYieldCardId) {
        return logMessage("flesh-and-blood.command.opponent-trigger-auto-yield-disabled", {
          actorId,
          cardName: displayNameForCanonicalId(
            state,
            command.preferences.removeOpponentTriggerYieldCardId,
          ),
        });
      }
      if (preferenceKeys.length === 1 && command.preferences.addInstantYieldCardId) {
        return logMessage("flesh-and-blood.command.instant-auto-yield-enabled", {
          actorId,
          cardName: displayNameForCanonicalId(state, command.preferences.addInstantYieldCardId),
        });
      }
      if (preferenceKeys.length === 1 && command.preferences.removeInstantYieldCardId) {
        return logMessage("flesh-and-blood.command.instant-auto-yield-disabled", {
          actorId,
          cardName: displayNameForCanonicalId(state, command.preferences.removeInstantYieldCardId),
        });
      }
      return logMessage("flesh-and-blood.command.set-automation-preferences", { actorId });
    }
    case "arm-priority-hold":
      return logMessage("flesh-and-blood.command.arm-priority-hold", { actorId });
    case "answer-decision":
      return logMessage("flesh-and-blood.command.answer-decision", { actorId });
    case "activate":
      return logMessage("flesh-and-blood.command.activate", { actorId });
    case "defend":
      return logMessage("flesh-and-blood.command.defend", { actorId });
    case "pass":
      return logMessage("flesh-and-blood.command.pass", { actorId });
    case "end-turn":
      return logMessage("flesh-and-blood.command.end-turn", { actorId });
    case "concede":
      return logMessage("flesh-and-blood.command.concede", { actorId });
  }
}

function displayNameForCanonicalId(state: FabRulesSnapshot, canonicalId: string): string {
  const definition = state.cardDefinitions[canonicalId];
  return definition?.base?.names.join(" // ") || canonicalId;
}

interface FabStackLayerSnapshot {
  readonly layerId: string;
  readonly sourceInstanceId: string;
  readonly controllerId: string;
  readonly kind: "card" | "activated" | "triggered";
}

function openedLayerReference(
  stack: readonly FabStackLayerSnapshot[],
  stackOrdinal: number,
): Extract<FabLogActivityReference, { readonly kind: "stack-layer-opened" }> {
  const layer = stack[stackOrdinal];
  if (!layer || !stack[0]) {
    throw new Error(`Cannot reference missing FAB stack layer at ordinal ${stackOrdinal}.`);
  }
  return {
    kind: "stack-layer-opened",
    stackWindowId: stack[0].layerId,
    layerId: layer.layerId,
    controllerId: layer.controllerId,
    sourceInstanceId: layer.sourceInstanceId,
    respondsToLayerId: stack[stackOrdinal - 1]?.layerId ?? null,
    stackOrdinal: stackOrdinal + 1,
  };
}

export function semanticMoveLogs(input: {
  readonly commandId: string;
  readonly command: FabCommand;
  readonly actorId: string;
  readonly state: FabRulesSnapshot;
  readonly status: FabCommandStatus;
  readonly events: readonly CommittedEvent[];
  /** Ordered bottom-to-top stack immediately after the accepted player command. */
  readonly stackAfterCommand: readonly FabStackLayerSnapshot[];
  readonly timestamp: number;
  /** Resolved reaction delta captured from authoritative evaluated state. */
  readonly resolvedReaction?: {
    readonly actorId: string;
    readonly cardName: string;
    readonly objectRef: { readonly instanceId: string; readonly canonicalId: string | null };
    readonly role: "attack-reaction" | "defense-reaction";
    readonly combatState: Extract<FabCombatLogState, { readonly kind: "reaction" }>;
  };
}): readonly FabMoveLog[] {
  const context: FabLogContext = {
    displayNameForInstanceId: (instanceId) => {
      const object = findObject(input.state, instanceId);
      return object ? fabObjectDisplayName(object) : null;
    },
    publicDisplayNameForInstanceId: (instanceId) => {
      const object = findObject(input.state, instanceId);
      return object && object.visibility === "public" && !object.faceDown
        ? fabObjectDisplayName(object)
        : null;
    },
    opponentIdForPlayerId: (playerId) =>
      input.state.playerIds.find((candidate) => candidate !== playerId) ?? null,
    stackLayerForInstanceId: (instanceId, layerKind) => {
      let stackOrdinal = -1;
      for (let index = input.stackAfterCommand.length - 1; index >= 0; index -= 1) {
        const layer = input.stackAfterCommand[index];
        if (layer?.sourceInstanceId === instanceId && layer.kind === layerKind) {
          stackOrdinal = index;
          break;
        }
      }
      if (stackOrdinal < 0) return null;
      return openedLayerReference(input.stackAfterCommand, stackOrdinal);
    },
    stackLayerForLayerId: (layerId) => {
      const stackOrdinal = input.stackAfterCommand.findIndex((layer) => layer.layerId === layerId);
      return stackOrdinal < 0 ? null : openedLayerReference(input.stackAfterCommand, stackOrdinal);
    },
  };
  const hasCompletedPlay = input.events.some((event) => event.name === "play");
  const facts = fabLogFactsForEvents(
    input.events.filter((event) => !hasCompletedPlay || event.name !== "announce-card"),
    context,
  );
  const commandMessage = messageForCommand(input.command, input.actorId, context, input.state);
  const isPrivateAutomationConfiguration =
    input.command.move === "set-automation-preferences" ||
    input.command.move === "set-optional-trigger-automation";
  const logs: FabMoveLog[] = [
    {
      commandId: input.commandId,
      moveType: input.command.move,
      playerId: input.actorId,
      timestamp: input.timestamp,
      sequence: 0,
      turnNumber: input.state.turnNumber,
      public: isPrivateAutomationConfiguration ? [] : [commandMessage],
      ...(isPrivateAutomationConfiguration
        ? { privateByPlayerId: { [input.actorId]: [commandMessage] } }
        : {}),
    },
  ];
  if (facts.length > 0) {
    const publicMessages: FabMoveLogMessage[] = [];
    const privateByPlayerId: Record<string, FabMoveLogMessage[]> = {};
    for (const fact of facts) {
      const message = logMessage(
        fact.key,
        fact.values,
        fact.objectRefs,
        fact.activityRef,
        fact.combatRole,
        fact.combatState,
        fact.narrativeRole,
      );
      if (fact.visibleTo === undefined || fact.visibleTo.length === 0) {
        publicMessages.push(message);
        continue;
      }
      for (const playerId of fact.visibleTo) {
        (privateByPlayerId[playerId] ??= []).push(message);
      }
    }
    logs.push({
      commandId: input.commandId,
      moveType: input.command.move,
      playerId: input.actorId,
      timestamp: input.timestamp,
      sequence: logs.length,
      turnNumber: input.state.turnNumber,
      public: publicMessages,
      ...(Object.keys(privateByPlayerId).length > 0 ? { privateByPlayerId } : {}),
    });
  }
  if (input.resolvedReaction) {
    const reaction = input.resolvedReaction;
    logs.push({
      commandId: input.commandId,
      moveType: input.command.move,
      playerId: reaction.actorId,
      timestamp: input.timestamp,
      sequence: logs.length,
      turnNumber: input.state.turnNumber,
      public: [
        logMessage(
          "flesh-and-blood.play",
          { actorId: reaction.actorId, cardName: reaction.cardName },
          { cardName: reaction.objectRef },
          undefined,
          reaction.role,
          reaction.combatState,
        ),
      ],
    });
  }
  if (input.status === "awaiting-decision" && input.state.decision) {
    logs.push({
      commandId: input.commandId,
      moveType: input.command.move,
      playerId: input.actorId,
      timestamp: input.timestamp,
      sequence: logs.length,
      turnNumber: input.state.turnNumber,
      public: [
        logMessage("flesh-and-blood.decision.awaiting", {
          actorId: input.state.decision.actorId,
        }),
      ],
      privateByPlayerId: {
        [input.state.decision.actorId]: [
          logMessage("flesh-and-blood.decision.private", {
            label: input.state.decision.label,
          }),
        ],
      },
    });
  }
  return logs;
}

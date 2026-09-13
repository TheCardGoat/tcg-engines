import {
  feuAwakening,
  nightmareCoil,
  spellwardScepter,
  venousCore,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
  GrandArchiveRuleModification,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, grandArchiveStackItemId } from "../../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchiveStackItem } from "../../game/model.ts";
import {
  collectExpiredGrandArchiveRuleModifications,
  collectGrandArchiveActionRules,
} from "../state/rule-modifications.ts";
import { collectGrandArchiveStateBasedEvents } from "../state/state-based.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
  options: {
    readonly classes?: readonly [GrandArchiveClass, ...GrandArchiveClass[]];
    readonly subtypes?: readonly string[];
    readonly lineageName?: string;
  } = {},
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        ...(options.lineageName ? { lineageName: options.lineageName } : {}),
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: options.classes ?? ["MAGE"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 40 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const filler = card("negation-rules-filler", "ACTION");
const ordinaryAction = card("negation-rules-action", "ACTION");
const aeneanSpell = card("negation-rules-aenean-spell", "ACTION", {
  classes: ["MAGE"],
  subtypes: ["AENEAN", "SPELL"],
});
const rangerChampion = card("negation-rules-ranger", "CHAMPION", { classes: ["RANGER"] });
const danteChampion = card("negation-rules-dante", "CHAMPION", {
  classes: ["MAGE"],
  lineageName: "Dante",
});

function stackItem(
  id: string,
  cardId: GrandArchiveObjectId,
  controllerId: GrandArchivePlayerId,
  createdAtVersion: number,
): GrandArchiveStackItem {
  return {
    id: grandArchiveStackItemId(id),
    kind: "card-activation",
    controllerId,
    sourceId: cardId,
    cardId,
    originZone: "hand",
    paidCostKind: "reserve",
    elysianAuraActiveAtAnnouncement: false,
    announcedCardResolutionAbilities: [],
    selectedModeIds: [],
    targets: [],
    createdAtVersion,
    activationPhase: "main",
    isCopy: false,
    negated: false,
    opportunityPolicy: "normal",
    activationStates: [],
    activationPayment: [],
    championLevelModifier: 0,
    variables: {},
    bindings: {},
  };
}

function player(
  id: "p1" | "p2",
  champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  definitions: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      ...definitions.map((definition) => ({ definitionId: definition.canonicalId, count: 1 })),
      { definitionId: filler.canonicalId, count: 4 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function objectId(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  definitionId: string,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) => candidate.ownerId === playerId && candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing ${definitionId} for ${playerId}`);
  return object.id;
}

function negate(
  program: ReturnType<typeof createGrandArchiveMatchProgram>,
  state: GrandArchiveMatchState,
  kernel: GrandArchiveTransactionKernel,
  actorId: GrandArchivePlayerId,
  itemIds: readonly GrandArchiveStackItem["id"][],
) {
  return executeGrandArchiveEffect(
    {
      kind: "negate",
      subject: { kind: "bound", binding: "negation-targets" },
    },
    {
      program,
      state,
      controllerId: actorId,
      bindings: { "negation-targets": itemIds },
    },
    (current, events) => {
      const transaction = kernel.transact(current, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function ability(cardDefinition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>, id: string) {
  if (cardDefinition.layout.kind !== "single-faced") {
    throw new Error(`${cardDefinition.slug} must be single-faced`);
  }
  const result = cardDefinition.layout.face.abilities.find((candidate) => candidate.id === id);
  if (!result) throw new Error(`${cardDefinition.slug} is missing ${id}`);
  return result;
}

function spellwardRule(): GrandArchiveRuleModification {
  const result = ability(spellwardScepter, "f6lxizyuml-a2");
  if (result.kind !== "activated" || !result.effect || result.effect.kind !== "rule-modification") {
    throw new Error("Spellward Scepter has no executable negation rule");
  }
  return result.effect;
}

function feuRule(): GrandArchiveRuleModification {
  const result = ability(feuAwakening, "0rKmarZ8QN-a2");
  if (result.kind !== "card-resolution" || result.effect.kind !== "sequence") {
    throw new Error("Feu Awakening has no executable resolution sequence");
  }
  const nested = result.effect.effects.find(
    (effect) =>
      effect.kind === "sequence" &&
      effect.effects.some((child) => child.kind === "rule-modification"),
  );
  const rule =
    nested?.kind === "sequence"
      ? nested.effects.find(
          (effect): effect is GrandArchiveRuleModification =>
            effect.kind === "rule-modification" && effect.action === "negate",
        )
      : undefined;
  if (!rule) throw new Error("Feu Awakening has no executable negation rule");
  return rule;
}

describe("Grand Archive negation restrictions", () => {
  it("protects Nightmare Coil's own activation while allowing another activation to be negated", () => {
    const program = createGrandArchiveMatchProgram([
      rangerChampion,
      nightmareCoil,
      ordinaryAction,
      filler,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", rangerChampion, [nightmareCoil, ordinaryAction]),
          player("p2", rangerChampion, []),
        ],
        firstPlayerId: "p1",
        randomSeed: 4001,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const coilId = objectId(initial, p1, nightmareCoil.canonicalId);
    const actionId = objectId(initial, p1, ordinaryAction.canonicalId);
    const coilItem = stackItem("negation-rule-coil", coilId, p1, initial.stateVersion);
    const actionItem = stackItem("negation-rule-action", actionId, p1, initial.stateVersion + 1);
    const kernel = new GrandArchiveTransactionKernel();
    const stacked = kernel.transact(initial, [
      { type: "object-moved", objectId: coilId, from: "main-deck", to: "effects-stack" },
      { type: "stack-item-added", item: coilItem },
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "effects-stack" },
      { type: "stack-item-added", item: actionItem },
    ]).state;

    const result = negate(program, stacked, kernel, p2, [coilItem.id, actionItem.id]);
    expect(result.state.stack.some((item) => item.id === coilItem.id)).toBe(true);
    expect(result.state.stack.some((item) => item.id === actionItem.id)).toBe(false);
  });

  it("protects only Aenean Spell activations while Venous Core's bonuses are active", () => {
    const program = createGrandArchiveMatchProgram([
      danteChampion,
      venousCore,
      aeneanSpell,
      ordinaryAction,
      filler,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", danteChampion, [venousCore, aeneanSpell, ordinaryAction]),
          player("p2", danteChampion, []),
        ],
        firstPlayerId: "p1",
        randomSeed: 4002,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const championId = initial.zones[p1].field[0]!;
    const coreId = objectId(initial, p1, venousCore.canonicalId);
    const spellId = objectId(initial, p1, aeneanSpell.canonicalId);
    const actionId = objectId(initial, p1, ordinaryAction.canonicalId);
    const spellItem = stackItem("negation-rule-spell", spellId, p1, initial.stateVersion);
    const actionItem = stackItem("negation-rule-nonspell", actionId, p1, initial.stateVersion + 1);
    const kernel = new GrandArchiveTransactionKernel();
    const stacked = kernel.transact(initial, [
      { type: "damage-marked", objectId: championId, amount: 25 },
      { type: "object-moved", objectId: coreId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: spellId, from: "main-deck", to: "effects-stack" },
      { type: "stack-item-added", item: spellItem },
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "effects-stack" },
      { type: "stack-item-added", item: actionItem },
    ]).state;

    const result = negate(program, stacked, kernel, p2, [spellItem.id, actionItem.id]);
    expect(result.state.stack.some((item) => item.id === spellItem.id)).toBe(true);
    expect(result.state.stack.some((item) => item.id === actionItem.id)).toBe(false);
  });

  it("applies Feu Awakening's resolved protection only to its controller's card activations", () => {
    const program = createGrandArchiveMatchProgram([
      rangerChampion,
      feuAwakening,
      ordinaryAction,
      filler,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", rangerChampion, [feuAwakening, ordinaryAction]),
          player("p2", rangerChampion, [ordinaryAction]),
        ],
        firstPlayerId: "p1",
        randomSeed: 4003,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = objectId(initial, p1, feuAwakening.canonicalId);
    const p1ActionId = objectId(initial, p1, ordinaryAction.canonicalId);
    const p2ActionId = objectId(initial, p2, ordinaryAction.canonicalId);
    const p1Item = stackItem("negation-rule-feu-p1", p1ActionId, p1, initial.stateVersion);
    const p2Item = stackItem("negation-rule-feu-p2", p2ActionId, p2, initial.stateVersion + 1);
    const kernel = new GrandArchiveTransactionKernel();
    const stacked = kernel.transact(initial, [
      {
        type: "rule-modification-created",
        modification: {
          id: "feu-negation-rule",
          sourceId,
          controllerId: p1,
          effect: feuRule(),
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          bindings: {},
          variables: {},
          durationAnchors: {},
          createdAtVersion: initial.stateVersion,
          createdTurnNumber: initial.turn.number,
          createdPhase: initial.turn.phase,
        },
      },
      { type: "object-moved", objectId: p1ActionId, from: "main-deck", to: "effects-stack" },
      { type: "stack-item-added", item: p1Item },
      { type: "object-moved", objectId: p2ActionId, from: "main-deck", to: "effects-stack" },
      { type: "stack-item-added", item: p2Item },
    ]).state;

    const result = negate(program, stacked, kernel, p2, [p1Item.id, p2Item.id]);
    expect(result.state.stack.some((item) => item.id === p1Item.id)).toBe(true);
    expect(result.state.stack.some((item) => item.id === p2Item.id)).toBe(false);
  });

  it("latches Spellward Scepter to the next exact activation until that stack item leaves", () => {
    const program = createGrandArchiveMatchProgram([
      rangerChampion,
      spellwardScepter,
      ordinaryAction,
      filler,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", rangerChampion, [spellwardScepter, ordinaryAction]),
          player("p2", rangerChampion, [ordinaryAction]),
        ],
        firstPlayerId: "p1",
        randomSeed: 4004,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = objectId(initial, p1, spellwardScepter.canonicalId);
    const protectedActionId = objectId(initial, p1, ordinaryAction.canonicalId);
    const otherActionId = objectId(initial, p2, ordinaryAction.canonicalId);
    const otherItem = stackItem(
      "negation-rule-before-scepter",
      otherActionId,
      p2,
      initial.stateVersion,
    );
    const protectedItem = stackItem(
      "negation-rule-scepter-target",
      protectedActionId,
      p1,
      initial.stateVersion + 1,
    );
    const kernel = new GrandArchiveTransactionKernel();
    const beforeRule = kernel.transact(initial, [
      { type: "object-moved", objectId: otherActionId, from: "main-deck", to: "effects-stack" },
      { type: "stack-item-added", item: otherItem },
    ]).state;
    const pending = kernel.transact(beforeRule, [
      {
        type: "rule-modification-created",
        modification: {
          id: "spellward-negation-rule",
          sourceId,
          controllerId: p1,
          effect: spellwardRule(),
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          bindings: {},
          variables: {},
          durationAnchors: { expires: {} },
          createdAtVersion: beforeRule.stateVersion,
          createdTurnNumber: beforeRule.turn.number,
          createdPhase: beforeRule.turn.phase,
        },
      },
    ]).state;

    const earlierNegation = negate(program, pending, kernel, p1, [otherItem.id]);
    expect(earlierNegation.state.stack.some((item) => item.id === otherItem.id)).toBe(false);
    const stacked = kernel.transact(earlierNegation.state, [
      {
        type: "object-moved",
        objectId: protectedActionId,
        from: "main-deck",
        to: "effects-stack",
      },
      { type: "stack-item-added", item: protectedItem },
    ]).state;
    expect(
      collectGrandArchiveStateBasedEvents(program, stacked).some(
        (event) => event.type === "rule-modification-expired",
      ),
    ).toBe(false);
    expect(
      collectGrandArchiveActionRules({
        action: "negate",
        activationKind: "card",
        playerId: p2,
        subjectPlayerId: p1,
        candidateId: protectedActionId,
        stackItemId: protectedItem.id,
        fromZone: "effects-stack",
        againstIds: [protectedActionId],
        evaluation: {
          program,
          state: stacked,
          controllerId: p2,
          candidateId: protectedActionId,
          bindings: {},
        },
      }),
    ).toHaveLength(1);

    const protectedNegation = negate(program, stacked, kernel, p2, [protectedItem.id]);
    expect(protectedNegation.state.stack.some((item) => item.id === protectedItem.id)).toBe(true);

    const removed = kernel.transact(protectedNegation.state, [
      { type: "stack-item-removed", itemId: protectedItem.id, outcome: "resolved" },
    ]).state;
    expect(collectExpiredGrandArchiveRuleModifications(program, removed)).toContain(
      "spellward-negation-rule",
    );
  });
});

import { demonsAim } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveRuleModification,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { proposeGrandArchiveAttackDeclaration } from "./combat.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "ATTACK" | "CHAMPION" | "ITEM",
  stats: { readonly level?: number; readonly power?: number; readonly life?: number },
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["WARRIOR"],
          subtypes: [],
        },
        elements: ["NORM"],
        ...(type === "ACTION"
          ? { speed: "fast" as const }
          : type === "ATTACK"
            ? { speed: "slow" as const }
            : {}),
        stats,
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("attack-target-rules-champion", "CHAMPION", {
  level: 0,
  power: 2,
  life: 30,
});
const tauntAlly = card("attack-target-rules-taunt", "ALLY", { power: 1, life: 3 }, [
  {
    id: "attackTargetRulesTaunt-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Taunt",
    keyword: { name: "taunt" },
  },
]);
const filler = card("attack-target-rules-filler", "ACTION", {});
const invalidUnblockableAttack = card(
  "attack-target-rules-invalid-unblockable",
  "ATTACK",
  { power: 1 },
  [
    {
      id: "invalidUnblockableAttack-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Unblockable",
      keyword: { name: "unblockable" },
    },
  ],
);
const invalidTrueSightItem = card("attack-target-rules-invalid-true-sight", "ITEM", {}, [
  {
    id: "invalidTrueSightItem-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "True Sight",
    keyword: { name: "true-sight" },
  },
]);
const stealthAlly = card("attack-target-rules-stealth", "ALLY", { power: 1, life: 3 }, [
  {
    id: "attackTargetRulesStealth-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Stealth",
    keyword: { name: "stealth" },
  },
]);

function demonsAimTargetRule(): GrandArchiveRuleModification {
  if (demonsAim.layout.kind !== "single-faced") {
    throw new Error("Demon's Aim must be single-faced");
  }
  const ability = demonsAim.layout.face.abilities.find(
    (candidate) => candidate.kind === "card-resolution",
  );
  const effects = ability?.effect?.kind === "sequence" ? ability.effect.effects : [];
  const rule = effects.find(
    (effect) =>
      effect.kind === "rule-modification" &&
      effect.action === "declare-target" &&
      effect.ignoredKeyword === "taunt",
  );
  if (rule?.kind !== "rule-modification") {
    throw new Error("Missing Demon's Aim target rule");
  }
  return rule;
}

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p2" ? [{ definitionId: tauntAlly.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive attack target rules", () => {
  it("accepts True Sight and Unblockable only from their rules-defined participant types", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      tauntAlly,
      stealthAlly,
      invalidUnblockableAttack,
      invalidTrueSightItem,
    ]);
    const setupPlayer = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 6 },
        ...(id === "p1"
          ? [
              { definitionId: invalidUnblockableAttack.canonicalId, count: 1 },
              { definitionId: invalidTrueSightItem.canonicalId, count: 1 },
            ]
          : [
              { definitionId: tauntAlly.canonicalId, count: 1 },
              { definitionId: stealthAlly.canonicalId, count: 1 },
            ]),
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [setupPlayer("p1"), setupPlayer("p2")],
        firstPlayerId: "p1",
        randomSeed: 937,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const find = (ownerId: typeof p1, definitionId: string) =>
      Object.values(initial.objects).find(
        (object) => object.ownerId === ownerId && object.definitionId === definitionId,
      )!.id;
    const attackerId = initial.zones[p1].field[0]!;
    const opposingChampionId = initial.zones[p2].field[0]!;
    const attackId = find(p1, invalidUnblockableAttack.canonicalId);
    const itemId = find(p1, invalidTrueSightItem.canonicalId);
    const tauntId = find(p2, tauntAlly.canonicalId);
    const stealthId = find(p2, stealthAlly.canonicalId);
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: attackId,
        from: "main-deck",
        to: "intent",
        hostId: attackerId,
      },
      {
        type: "object-moved",
        objectId: itemId,
        from: "main-deck",
        to: "intent",
        hostId: attackerId,
      },
      { type: "object-moved", objectId: tauntId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: stealthId, from: "main-deck", to: "field" },
      { type: "player-first-turn-completed", playerId: p1 },
    ]).state;
    const command = (targetId: typeof opposingChampionId) => ({
      move: "declare-attack" as const,
      attackerId,
      attackCardId: attackId,
      targetIds: [targetId],
    });

    expect(() =>
      proposeGrandArchiveAttackDeclaration(program, positioned, p1, command(opposingChampionId), {
        resolvedAttack: true,
      }),
    ).toThrow("legal attack target");

    const tauntRested = new GrandArchiveTransactionKernel().transact(positioned, [
      { type: "object-state-changed", objectId: tauntId, state: "rested", value: true },
    ]).state;
    expect(() =>
      proposeGrandArchiveAttackDeclaration(program, tauntRested, p1, command(stealthId), {
        resolvedAttack: true,
      }),
    ).toThrow("legal attack target");
  });

  it("uses Demon's Aim to ignore Taunt during attack declaration", () => {
    const program = createGrandArchiveMatchProgram([champion, tauntAlly, filler, demonsAim]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 931,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = initial.zones[p1].field[0]!;
    const targetId = initial.zones[p2].field[0]!;
    const taunt = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === tauntAlly.canonicalId,
    )!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: taunt.id, from: taunt.zone, to: "field" },
      { type: "player-first-turn-completed", playerId: p1 },
    ]).state;
    const command = {
      move: "declare-attack" as const,
      attackerId,
      targetIds: [targetId],
    };

    expect(
      new GrandArchiveMatchRuntime(program, positioned).execute(command, { playerId: p1 }).ok,
    ).toBe(false);

    const permitted = new GrandArchiveTransactionKernel().transact(positioned, [
      {
        type: "rule-modification-created",
        modification: {
          id: "demons-aim-ignore-taunt",
          controllerId: p1,
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          effect: demonsAimTargetRule(),
          bindings: {},
          variables: {},
          durationAnchors: {},
          createdAtVersion: positioned.stateVersion,
          createdTurnNumber: positioned.turn.number,
          createdPhase: positioned.turn.phase,
        },
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, permitted);

    expect(runtime.execute(command, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.combat?.targetIds).toEqual([targetId]);
  });
});

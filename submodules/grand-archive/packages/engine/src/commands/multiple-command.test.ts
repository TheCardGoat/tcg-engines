import { classicalOpening } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  subtypes: readonly string[] = [],
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes },
        elements: ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 5 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("multiple-command-champion", "CHAMPION");
const automaton = card("multiple-command-automaton", "ALLY", [], ["AUTOMATON"]);
const filler = card("multiple-command-filler", "ACTION");
const commandGrant = card("multiple-command-grant", "ITEM", [
  {
    id: "multipleCommandGrant-a1",
    kind: "static",
    staticKind: "effects",
    text: "Classical Opening has Command Automaton.",
    effects: [
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: {
            zones: ["hand", "effects-stack", "intent"],
            player: "controller",
            filter: { kind: "canonical-id", value: classicalOpening.canonicalId },
          },
        },
        affectedSet: "dynamic",
        duration: { kind: "while-source-in-functional-zone" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "command", subtype: "Automaton" } },
      },
    ],
  },
]);

describe("Grand Archive multiple Command abilities", () => {
  it("lets catalog Classical Opening use an ally matching either active Command subtype", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      automaton,
      filler,
      commandGrant,
      classicalOpening,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: classicalOpening.canonicalId, count: 1 },
        { definitionId: automaton.canonicalId, count: 1 },
        { definitionId: commandGrant.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 2401,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const owned = (definitionId: string) =>
      Object.values(initial.objects).filter(
        (object) => object.ownerId === p1 && object.definitionId === definitionId,
      );
    const attackId = owned(classicalOpening.canonicalId)[0]!.id;
    const automatonId = owned(automaton.canonicalId)[0]!.id;
    const grantId = owned(commandGrant.canonicalId)[0]!.id;
    const paymentIds = owned(filler.canonicalId)
      .slice(0, 2)
      .map((object) => object.id);
    const targetId = initial.zones[p2].field[0]!;
    const staged = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: attackId,
        from: initial.objects[attackId]!.zone,
        to: "hand",
      },
      {
        type: "object-moved",
        objectId: automatonId,
        from: initial.objects[automatonId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: grantId,
        from: initial.objects[grantId]!.zone,
        to: "field",
      },
      ...paymentIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: initial.objects[objectId]!.zone,
        to: "hand" as const,
      })),
    ]).state;
    const ready = {
      ...staged,
      players: {
        ...staged.players,
        [p1]: { ...staged.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, ready);

    const activated = runtime.execute(
      {
        move: "activate-card",
        cardId: attackId,
        attackAttackerId: automatonId,
        reservePayment: paymentIds.map((cardId) => ({ kind: "card" as const, cardId })),
      },
      { playerId: p1 },
    );
    expect(activated).toMatchObject({ ok: true });
    expect(runtime.state.objects[automatonId]?.states.has("rested")).toBe(true);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const declaration = runtime.state.decision;
    if (!declaration || declaration.kind !== "declare-resolved-attack") {
      throw new Error("Expected a resolved Command attack declaration");
    }
    expect(declaration.attackerCandidates).toEqual([automatonId]);
    expect(declaration.weaponCandidates).toEqual([]);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: declaration.id,
          stateVersion: declaration.stateVersion,
          answer: { attackerId: automatonId, targetIds: [targetId], weaponIds: [] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.attackerId).toBe(automatonId);
    expect(runtime.state.objects[attackId]?.zone).toBe("intent");
  });
});

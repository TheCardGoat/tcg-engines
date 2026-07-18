import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, op06JaguarDSaul053 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koCharacter: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP06-053-KO",
  canonicalId: "TEST-OP06-053-KO",
  name: "Test OP06-053 K.O.",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
          },
        ],
      },
    ],
  },
};
registerCards([koCharacter]);

function koSaul() {
  const engine = OnePieceTestEngine.create(
    {
      character: [
        { card: eb01MountainGod018, playedOnTurn: 0 },
        { card: eb01Doma005, rested: true },
      ],
    },
    {
      character: [
        { card: op06JaguarDSaul053, rested: true },
        { card: eb01Doma005, rested: true },
      ],
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
  const saulId = engine.findCardInZone("north", "character", op06JaguarDSaul053);
  const ownCandidateId = engine.findCardInZone("north", "character", eb01Doma005);
  const opposingCandidateId = engine.findCardInZone("south", "character", eb01Doma005);

  engine.declareAttack(attackerId, saulId, "south");

  return { engine, ownCandidateId, opposingCandidateId, saulId };
}

describe("OP06-053 Jaguar.D.Saul", () => {
  test("after battle K.O., may bottom-deck either player's cost-2-or-less Character", () => {
    const { engine, ownCandidateId, opposingCandidateId, saulId } = koSaul();
    const decision = engine.pendingDecision("effectTargetSelection", "north");
    const target = decision.steps[0];

    expect(decision.actorId).toBe("north");
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Saul's bottom-deck choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownCandidateId, opposingCandidateId]),
    );
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      saulId,
    );

    const deckBefore = engine.getView("north").players.north.deckCount;
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownCandidateId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.deckCount).toBe(deckBefore + 1);
    expect(view.players.north.characters.some((card) => card?.instanceId === ownCandidateId)).toBe(
      false,
    );
    expect(
      view.players.south.characters.some((card) => card?.instanceId === opposingCandidateId),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the up-to-one bottom-deck choice", () => {
    const { engine, ownCandidateId, opposingCandidateId } = koSaul();

    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === ownCandidateId)).toBe(
      true,
    );
    expect(
      view.players.south.characters.some((card) => card?.instanceId === opposingCandidateId),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("resolves the same On K.O. choice after an effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06JaguarDSaul053, eb01Doma005] },
      { hand: [koCharacter], character: [eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const saulId = engine.findCardInZone("south", "character", op06JaguarDSaul053);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(koCharacter, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [saulId] }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Saul's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(ownId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      saulId,
    );
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04Chaka008, op04NefeltariVivi001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-008 Chaka", () => {
  test("with DON!! and a Nefeltari Vivi Leader, reduces an opposing Character before K.O. filtering", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04NefeltariVivi001,
        character: [{ card: op04Chaka008, attachedDon: 1, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chakaId = engine.findCardInZone("south", "character", op04Chaka008);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(chakaId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(0);

    const koChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(koChoice?.kind).toBe("selectEntity");
    if (koChoice?.kind !== "selectEntity") throw new Error("Expected Chaka's K.O. choice.");
    expect(koChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === targetId),
    ).toBe(false);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("may skip the power reduction and therefore leaves an ineligible Character in play", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04NefeltariVivi001,
        character: [{ card: op04Chaka008, attachedDon: 1, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chakaId = engine.findCardInZone("south", "character", op04Chaka008);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(chakaId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not trigger without both the named Leader and attached DON!!", () => {
    const wrongLeader = OnePieceTestEngine.create(
      { character: [{ card: op04Chaka008, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    wrongLeader.declareAttack(
      wrongLeader.findCardInZone("south", "character", op04Chaka008),
      wrongLeader.leader("north"),
      "south",
    );
    expect(wrongLeader.getView("south").prompts).toHaveLength(0);

    const noDon = OnePieceTestEngine.create(
      {
        leaderCardId: op04NefeltariVivi001,
        character: [{ card: op04Chaka008, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    noDon.declareAttack(
      noDon.findCardInZone("south", "character", op04Chaka008),
      noDon.leader("north"),
      "south",
    );
    expect(noDon.getView("south").prompts).toHaveLength(0);
  });
});

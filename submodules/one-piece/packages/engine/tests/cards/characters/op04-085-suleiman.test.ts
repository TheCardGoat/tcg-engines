import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Suleiman085,
  op10TrafalgarLaw022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-085 Suleiman", () => {
  test("with an included-Dressrosa Leader, On Play mills even when choosing no target", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10TrafalgarLaw022,
        hand: [op04Suleiman085],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 3,
      },
      { character: [eb01MountainGod018] },
    );
    const suleimanId = engine.findCardInZone("south", "hand", op04Suleiman085);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const milledId = engine.getState().players.south.deck[0]!;

    engine.playCard(op04Suleiman085, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Suleiman's cost target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(suleimanId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(milledId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(5);
  });

  test("When Attacking reduces a chosen cost and mandatorily mills one", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10TrafalgarLaw022,
        character: [{ card: op04Suleiman085, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const suleimanId = engine.findCardInZone("south", "character", op04Suleiman085);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const milledId = engine.getState().players.south.deck[0]!;

    engine.declareAttack(suleimanId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(milledId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does nothing with a non-Dressrosa Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04Suleiman085, playedOnTurn: 0 }],
        deck: [eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const suleimanId = engine.findCardInZone("south", "character", op04Suleiman085);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.declareAttack(suleimanId, engine.leader("north"), "south");

    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

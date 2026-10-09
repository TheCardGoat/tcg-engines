import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Sanji064 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-064 Sanji", () => {
  test("costs 3 in hand when its controller has at least two fewer DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07Sanji064], activeDon: 3 },
      { activeDon: 5 },
    );
    const sanjiId = engine.findCardInZone("south", "hand", op07Sanji064);

    expect(
      engine.getView("south").players.south.hand.find((card) => card.instanceId === sanjiId)?.cost,
    ).toBe(3);
    engine.playCard(op07Sanji064, "south");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === sanjiId),
    ).toBe(true);
  });

  test("uses Blocker through the opponent's public attack decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Sanji064] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op07Sanji064);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Sanji's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(sanjiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [sanjiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.prompts).toHaveLength(0);
  });
  test.each([4, 5])(
    "Law evaluates the hand-cost reduction after returning DON!! against %i opposing DON!!",
    (opposingDon) => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST10-001", hand: [op07Sanji064, eb01Doma005], activeDon: 3, restedDon: 3 },
        { activeDon: opposingDon },
      );
      const sanjiId = engine.findCardInZone("south", "hand", op07Sanji064);
      const domaId = engine.findCardInZone("south", "hand", eb01Doma005);
      expect(
        engine.getView("south").players.south.hand.find((card) => card.instanceId === sanjiId)
          ?.cost,
      ).toBe(6);
      engine.activateEffect(engine.leader("south"), "activateMain", "south");
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      engine.resolveDecision(
        "effectCostReturnDon",
        { selectedIds: ["active-don:0", "active-don:1", "active-don:2"] },
        "south",
      );
      const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
      if (play?.kind !== "selectEntity") throw new Error("Expected Law's hand-play choice.");
      const candidates = play.candidates.map((candidate) => candidate.ref.id);
      expect(candidates).toContain(domaId);
      if (opposingDon === 5) {
        expect(candidates).toContain(sanjiId);
        expect(
          engine.getView("south").players.south.hand.find((card) => card.instanceId === sanjiId)
            ?.cost,
        ).toBe(3);
        engine.resolveDecision("effectPlaySelection", { selectedIds: [sanjiId] }, "south");
        expect(
          engine
            .getView("south")
            .players.south.characters.find((card) => card?.instanceId === sanjiId)?.cost,
        ).toBe(6);
      } else {
        expect(candidates).not.toContain(sanjiId);
        engine.resolveDecision("effectPlaySelection", { selectedIds: [domaId] }, "south");
        expect(
          engine.getView("south").players.south.hand.find((card) => card.instanceId === sanjiId)
            ?.cost,
        ).toBe(6);
      }
      expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );
});

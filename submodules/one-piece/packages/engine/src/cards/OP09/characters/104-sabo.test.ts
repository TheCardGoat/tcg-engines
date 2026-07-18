import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Sanji026,
  op09BeloBetty112,
  op09Sabo104,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-104 Sabo", () => {
  test("On Play can put a Revolutionary Army Character face-up in Life, then take bottom Life", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Sabo104, op09BeloBetty112],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: op09Sabo104.cost,
    });
    const bettyId = engine.findCardInZone("south", "hand", op09BeloBetty112);
    const bottomLifeId = engine.findCardInZone("south", "life", eb01Fourtricks025);

    engine.playCard(op09Sabo104, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Sabo's hand target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(bettyId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bettyId] }, "south");

    const position = engine.pendingDecision("effectLifePosition", "south").steps[0];
    if (position?.kind !== "chooseOption") throw new Error("Expected Sabo's Life position choice.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(engine.getState().players.south.life[0]).toBe(bettyId);
    expect(engine.getState().cards[bettyId]?.faceUp).toBe(true);
  });

  test("Life Trigger draws two with a multicolored Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op02Sanji026,
        life: [op09Sabo104],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const deckBefore = engine.getView("north").players.north.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.deckCount).toBe(deckBefore - 2);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01MonkeyDLuffy024,
  op02EdwardNewgate001,
  op02Kingdew006,
  op08ThankYouForLovingMe053,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-053 Thank You...for Loving Me!!", () => {
  test("Main uses the corrected included Leader gate, either-card search, ordered remainder, and top/bottom choice", () => {
    const deck = [op02Kingdew006, op01MonkeyDLuffy024, eb01Fourtricks025, eb01Doma005];
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EdwardNewgate001,
      hand: [op08ThankYouForLovingMe053],
      deck,
      activeDon: 1,
    });
    const selected = engine.findCardInZone("south", "deck", op01MonkeyDLuffy024);
    const whitebeardPirates = engine.findCardInZone("south", "deck", op02Kingdew006);
    const unrelated = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const initial = [...engine.getState().players.south.deck].slice(0, 3);
    engine.playCard(op08ThankYouForLovingMe053);
    const searchStep = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the private Whitebeard Pirates-or-Luffy search.");
    }
    expect(
      searchStep.candidates.find((candidate) => candidate.ref.id === whitebeardPirates)?.legal,
    ).toBe(true);
    expect(searchStep.candidates.find((candidate) => candidate.ref.id === selected)?.legal).toBe(
      true,
    );
    expect(searchStep.candidates.find((candidate) => candidate.ref.id === unrelated)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selected] }, "south");
    const remainder = initial.filter((id) => id !== selected).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainder }, "south");
    engine.resolveDecision("effectSearchRemainderPosition", { optionId: "top" }, "south");
    expect(engine.getState().players.south.deck.slice(0, 2)).toEqual(remainder);
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(selected);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger draws 1 without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op08ThankYouForLovingMe053],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const draw = engine.findCardInZone("north", "deck", eb01Doma005);
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(draw);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Krieg001, op15MeowbanBrothers028 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-028 Meowban Brothers", () => {
  test("under an {East Blue} Leader it clogs an opposing Character with an opposing DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Krieg001,
        hand: [op15MeowbanBrothers028],
        activeDon: op15MeowbanBrothers028.cost,
      },
      { character: [{ card: eb01Doma005 }], activeDon: 3, restedDon: 1 },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op15MeowbanBrothers028, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the give count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    // Doma is the only opposing Character, so the recipient auto-resolves.

    const north = engine.getView("south").players.north;
    expect(north.characters.find((c) => c?.instanceId === domaId)?.attachedDon).toBe(1);
    expect(north.activeDon + north.restedDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does nothing under a Leader without the {East Blue} type", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15MeowbanBrothers028], activeDon: op15MeowbanBrothers028.cost },
      { character: [{ card: eb01Doma005 }], activeDon: 3, restedDon: 1 },
    );

    engine.playCard(op15MeowbanBrothers028, "south");

    const north = engine.getView("south").players.north;
    expect(
      north.characters.find(
        (c) => c?.instanceId === engine.findCardInZone("north", "character", eb01Doma005),
      )?.attachedDon ?? 0,
    ).toBe(0);
    expect(north.activeDon + north.restedDon).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

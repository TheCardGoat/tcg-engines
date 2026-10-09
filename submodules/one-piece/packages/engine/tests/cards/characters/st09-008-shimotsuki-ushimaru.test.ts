import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st09ShimotsukiUshimaru008 } from "@tcg/op-cards";
describe("ST09-008 Shimotsuki Ushimaru", () => {
  test("can play the yellow Wano Character just taken as Life payment", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st09ShimotsukiUshimaru008, playedOnTurn: 0 }],
        activeDon: 1,
        life: ["ST09-006", "ST09-013"],
        hand: ["ST09-003", "ST09-013", "ST09-014", "OP01-041"],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const source = e.findCardInZone("south", "character", "ST09-008");
    const target = e.findCardInZone("south", "life", "ST09-006");
    e.asSouth().attachDon(source, 1);
    e.asSouth().attack(source, e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("play");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().choosePlay(target);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(false);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.hand).toHaveLength(4);
  });
  test("declines attack payment and retains Life and hand", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st09ShimotsukiUshimaru008, playedOnTurn: 0 }],
        activeDon: 1,
        life: 2,
        hand: ["ST09-006"],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const source = e.findCardInZone("south", "character", "ST09-008");
    e.asSouth().attachDon(source, 1);
    e.asSouth().attack(source, e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
  test("without given DON does not activate Life exchange", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st09ShimotsukiUshimaru008, playedOnTurn: 0 }], life: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST09-008"), e.leader("north"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

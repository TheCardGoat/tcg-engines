import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st09Yamato012 } from "@tcg/op-cards";
describe("ST09-012 Yamato", () => {
  test("top Life payment grants power through opponent turn until next own Refresh", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st09Yamato012, playedOnTurn: 0 }], life: ["ST09-003", "ST09-006"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const card = e.findCardInZone("south", "character", "ST09-012");
    const paid = e.findCardInZone("south", "life", "ST09-003");
    e.asSouth().attack(card, e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
  });
  test("declines attack Life payment with no power increase", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st09Yamato012, playedOnTurn: 0 }], life: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST09-012"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
  });
});

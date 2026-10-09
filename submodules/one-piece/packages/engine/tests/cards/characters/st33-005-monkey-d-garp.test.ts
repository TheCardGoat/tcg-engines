import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST33-005 Garp", () => {
  test("Navy Leader plays blue Navy8000 but excludes other Garp, wrong color, type and power", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP02-093",
      hand: ["ST33-005", "ST33-005", "OP12-056", "OP12-045", "OP05-044", "ST06-008", "ST03-005"],
      activeDon: 6,
    });
    const target = e.findCardInZone("south", "hand", "OP12-045");
    e.asSouth().play("ST33-005");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().choosePlay(target);
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(target);
  });
  test("wrong Leader cannot play eligible Navy", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST02-001",
      hand: ["ST33-005", "OP12-045"],
      activeDon: 6,
    });
    e.asSouth().play("ST33-005");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("OP12-045");
  });
  test("declines optional play with Navy Leader and eligible card", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP02-093",
      hand: ["ST33-005", "OP12-045"],
      activeDon: 6,
    });
    e.asSouth().play("ST33-005");
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-074 Yamato", () => {
  test.each(["1", "0"])("On Play adds optional rested DON and can block: %s", (amount) => {
    const e = OnePieceTestEngine.create({ hand: ["OP17-074"], activeDon: 3 }, {});
    e.playCard("OP17-074");
    e.resolveDecision("effectAddDon", { optionId: amount }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(3 + Number(amount));
    const yamato = e.findCardInZone("south", "character", "OP17-074");
    e.endTurn("south");
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleBlocker", { selectedIds: [yamato] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(yamato);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

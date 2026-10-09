import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-012-makino", () => {
  test("pays bottom Life then privately reorders remaining cards without changing face orientation", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST13-012"],
      activeDon: 1,
      life: [{ cardId: "ST02-002", faceUp: true, publicKnowledge: true }, "ST02-006", "ST02-012"],
    });
    const [up, down, bottom] = e.getState().players.south.life;
    e.playCard("ST13-012", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    e.resolveDecision("effectRearrangeLifeOrder", { selectedIds: [down!, up!] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(bottom);
    expect(e.getState().players.south.life).toEqual([down, up]);
    expect(e.getState().cards[up!]!.faceUp).toBe(true);
    expect(e.getState().cards[down!]!.faceUp).toBe(false);
  });
  test("declines optional Life-to-hand cost", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST13-012"], activeDon: 1, life: 3 });
    const life = [...e.getState().players.south.life];
    e.playCard("ST13-012", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getState().players.south.life).toEqual(life);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

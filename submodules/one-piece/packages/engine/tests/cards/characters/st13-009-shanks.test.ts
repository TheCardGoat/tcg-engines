import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-009-shanks", () => {
  test("FAQ pays any face-up Life, including bottom, then trashes opponent topLife at seven hand", () => {
    let e = OnePieceTestEngine.create(
      {
        hand: ["ST13-009"],
        activeDon: 7,
        life: [
          "ST02-002",
          { cardId: "ST02-006", faceUp: true, publicKnowledge: true },
          { cardId: "ST02-012", faceUp: true, publicKnowledge: true },
        ],
      },
      { hand: Array(7).fill("ST02-002"), life: ["ST02-006", "ST02-012"] },
    );
    const [top, middle, bottom] = e.getState().players.south.life;
    e.playCard("ST13-009", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const prompt = e.pendingDecision("effectCostTurnLifeFaceUp", "south");
    e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: [top!],
    });
    expect(e.pendingDecision("effectCostTurnLifeFaceUp", "south").id).toBe(prompt.id);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectCostTurnLifeFaceUp", { selectedIds: [bottom!] }, "south");
    e.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
    expect(e.getState().cards[top!]!.faceUp).toBe(false);
    expect(e.getState().cards[bottom!]!.faceUp).toBe(false);
    expect(e.getState().cards[middle!]!.faceUp).toBe(true);
    expect(e.getView("south").players.north.trash.map((c) => c.cardId)).toContain("ST02-006");
    expect(e.getView("south").players.north.lifeCount).toBe(1);
  });
  test("declines the optional face-down payment", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST13-009"],
        activeDon: 7,
        life: [{ cardId: "ST02-012", faceUp: true, publicKnowledge: true }],
      },
      { hand: Array(7).fill("ST02-002") },
    );
    const id = e.getState().players.south.life[0]!;
    e.playCard("ST13-009", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getState().cards[id]!.faceUp).toBe(true);
    expect(e.getView("south").players.north.lifeCount).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("pays Life orientation before a failing six-card hand gate", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST13-009"],
        activeDon: 7,
        life: [{ cardId: "ST02-012", faceUp: true, publicKnowledge: true }],
      },
      { hand: Array(6).fill("ST02-002") },
    );
    const id = e.getState().players.south.life[0]!;
    e.playCard("ST13-009", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getState().cards[id]!.faceUp).toBe(false);
    expect(e.getView("south").players.north.lifeCount).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("no face-up Life cannot pay or trash opposing Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST13-009"], activeDon: 7, life: 2 },
      { hand: Array(7).fill("ST02-002") },
    );
    e.playCard("ST13-009", "south");
    expect(e.getView("south").players.north.lifeCount).toBe(4);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-008-sabo", () => {
  test("pays top Life to KO at most cost five and excludes cost six", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST13-008"], activeDon: 5, life: ["ST02-002", "ST02-012"] },
      { character: ["ST13-015", "ST10-004"] },
    );
    const target = e.findCardInZone("north", "character", "ST13-015");
    e.playCard("ST13-008", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostTrashLife", { optionId: "top" }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("target");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST02-002");
  });
  test("declines the optional Life cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST13-008"], activeDon: 5, life: 2 },
      { character: ["ST13-015"] },
    );
    e.playCard("ST13-008", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.north.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("zero Life cannot pay the cost or KO an otherwise eligible Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST13-008"], activeDon: 5, life: 0 },
      { character: ["ST13-015"] },
    );
    const target = e.findCardInZone("north", "character", "ST13-015");
    e.playCard("ST13-008", "south");
    expect(e.getView("south").players.north.characters.some((c) => c?.instanceId === target)).toBe(
      true,
    );
    expect(e.getView("south").players.north.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

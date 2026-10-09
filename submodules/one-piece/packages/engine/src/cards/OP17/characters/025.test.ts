import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-025 Building Snake", () => {
  test.each([0, 1])(
    "gives %i rested DON to the Shanks Leader and consumes its once-per-turn use",
    (amount) => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "OP17-020",
        character: ["OP17-025"],
        restedDon: 2,
      });
      const snake = e.findCardInZone("south", "character", "OP17-025");
      e.activateEffect(snake, "activateMain", "south");
      e.asSouth().chooseAmount(amount);
      const after = e.getView("south").players.south;
      expect(after.leader.attachedDon).toBe(amount);
      expect(after.restedDon).toBe(2 - amount);
      expect(after.leader.power).toBe(5000 + 1000 * amount);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: snake,
        trigger: "activateMain",
      });
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("a non-Shanks Leader cannot receive the rested DON", () => {
    const e = OnePieceTestEngine.create({ character: ["OP17-025"], restedDon: 2 });
    e.activateEffect(e.findCardInZone("south", "character", "OP17-025"), "activateMain", "south");
    e.asSouth().chooseAmount(1);
    expect(e.getView("south").players.south.restedDon).toBe(2);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("On K.O. selects only an opposing rested Character costing at most six", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "OP17-025", rested: true },
          { cardId: "EB01-018", rested: true },
        ],
      },
      { character: ["OP16-003", { cardId: "EB01-018", rested: true }, "EB01-005"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const snake = e.findCardInZone("south", "character", "OP17-025");
    const victim = e.findCardInZone("north", "character", "EB01-018");
    e.asNorth().attack("OP16-003", snake);
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected K.O. selection");
    expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([victim]);
    e.asSouth().chooseTargets(victim);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(snake);
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(victim);
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "EB01-018")).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

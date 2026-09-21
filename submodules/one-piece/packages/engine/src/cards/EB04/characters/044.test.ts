import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-044", () => {
  test("plays for its cost and wins a battle against a rested 1000-power Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-044", attachedDon: 2 }], activeDon: 5 },
      { character: [{ cardId: "OP17-012", rested: true }], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-044");
    const blenheimId = engine.findCardInZone("north", "character", "OP17-012");

    engine.asSouth().attack(selfId, blenheimId);

    const card = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === selfId);
    expect(card?.power).toBe(9000);
    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(
      blenheimId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-044", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "EB04-044",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Sanji014, op01Caribou007, op01MonkeyDLuffy003 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-003 Monkey.D.Luffy", () => {
  test("maps both printed type alternatives and powers only the Character set active", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01MonkeyDLuffy003,
      character: [
        { card: eb01Sanji014, rested: true },
        { card: op01Caribou007, rested: true },
        { card: eb01Doma005, rested: true },
      ],
      activeDon: 4,
    });
    const strawHatId = engine.findCardInZone("south", "character", eb01Sanji014);
    const supernovaId = engine.findCardInZone("south", "character", op01Caribou007);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected the Leader controller to choose a typed Character.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      strawHatId,
      supernovaId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [supernovaId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.find((card) => card?.instanceId === supernovaId)).toMatchObject({
      rested: false,
      power: 5000,
    });
    expect(view.characters.find((card) => card?.instanceId === strawHatId)).toMatchObject({
      rested: true,
      power: 5000,
    });
    expect(view).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

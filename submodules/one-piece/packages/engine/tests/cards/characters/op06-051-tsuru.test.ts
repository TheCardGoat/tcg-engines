import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op06Tsuru051 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-051 Tsuru", () => {
  test("may trash two hand cards, then lets the opponent return one of their Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Tsuru051, eb01Doma005, eb01Fourtricks025],
        activeDon: op06Tsuru051.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const discardIds = [
      engine.findCardInZone("south", "hand", eb01Doma005),
      engine.findCardInZone("south", "hand", eb01Fourtricks025),
    ];
    const returnedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06Tsuru051, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Tsuru's opposing choice.");
    expect(target.candidates).toHaveLength(2);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      returnedId,
    );
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(discardIds),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without trashing cards or returning a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Tsuru051, eb01Doma005, eb01Fourtricks025],
        activeDon: op06Tsuru051.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06Tsuru051, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
    expect(engine.getView("north").players.north.characters[0]?.instanceId).toBe(targetId);
  });
});

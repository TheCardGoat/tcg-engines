import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08King057 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-057 King", () => {
  test("returns two DON!!, exposes both branches, and applies the chosen −2 cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08King057,
        activeDon: 2,
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected King's effect branch choice.");
    expect(choice.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected King's cost target choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      donDeckCount: donDeckBefore + 2,
    });
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

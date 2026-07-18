import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op06Perona021 } from "@tcg/op-cards";

import { getLegalCommands, OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-021 Perona", () => {
  test("maps both printed choices and executes the selected cost-reduction branch once", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op06Perona021 },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Perona's two branches.");
    expect(choice.options.map((option) => option.label)).toEqual(["rest", "modifyCost"]);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.characters[1]?.cost).toBe(2);
    expect(
      getLegalCommands(engine.getState(), "south").some(
        (command) =>
          command.type === "activateEffect" && command.sourceId === engine.leader("south"),
      ),
    ).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

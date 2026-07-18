import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01Kyros040, op02IceAge117 } from "@tcg/op-cards";
import { getLegalCommands, OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-040 Kyros", () => {
  test("turns the top Life face-up to K.O. a cost-0 Character only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb01Kyros040,
        hand: [op02IceAge117],
        life: [eb01Fourtricks025],
        activeDon: 1,
      },
      { character: [eb01Fourtricks025] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const lifeId = engine.findCardInZone("south", "life", eb01Fourtricks025);

    engine.playCard(op02IceAge117);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().cards[lifeId]?.faceUp).toBe(true);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(
      getLegalCommands(engine.getState(), "south").some(
        (command) =>
          command.type === "activateEffect" && command.sourceId === engine.leader("south"),
      ),
    ).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

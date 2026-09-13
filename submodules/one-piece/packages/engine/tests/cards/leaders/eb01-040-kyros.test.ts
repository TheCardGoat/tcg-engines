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

  test("may decline optional so paid effect does not apply", () => {
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
    engine.playCard(op02IceAge117, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

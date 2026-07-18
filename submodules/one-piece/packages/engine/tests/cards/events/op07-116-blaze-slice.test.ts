import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op07BlazeSlice116 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-116 Blaze Slice", () => {
  test("Main grants turn power then rests a cost-4 Character at the opponent two-Life boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07BlazeSlice116], activeDon: 1 },
      { life: 2, character: [eb01Fourtricks025] },
    );
    const target = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const before = engine.getView("south").players.south.leader.power!;
    engine.playCard(op07BlazeSlice116);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(before + 1000);
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === target)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger rests a cost-4 opposing Character without Main/Counter payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Fourtricks025] },
      { life: [op07BlazeSlice116] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const target = engine.findCardInZone("south", "character", eb01Fourtricks025);
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
    expect(
      engine.getView("north").players.south.characters.find((c) => c?.instanceId === target)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

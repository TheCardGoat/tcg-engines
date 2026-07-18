import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08ClovenRose018,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-018 Cloven Rose", () => {
  test("Main powers up to three own Characters then gives an opposing Character -2000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08ClovenRose018], character: [eb01Doma005, eb01Fourtricks025], activeDon: 2 },
      { character: [eb01MountainGod018] },
    );
    const own = engine
      .getState()
      .players.south.characterArea.filter((id): id is string => Boolean(id));
    const opposing = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.playCard(op08ClovenRose018);
    engine.resolveDecision("effectTargetSelection", { selectedIds: own }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposing] }, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.slice(0, 2)
        .map((c) => c?.power),
    ).toEqual([4000, 6000]);
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === opposing)
        ?.power,
    ).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger gives an opposing Leader -3000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op08ClovenRose018] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const before = engine.getView("north").players.south.leader.power!;
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "north",
    );
    expect(engine.getView("north").players.south.leader.power).toBe(before - 3000);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

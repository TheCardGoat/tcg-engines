import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08MunchMunchMutation019 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-019 Munch-Munch Mutation", () => {
  test("Main maps the official -3000 opposing target before the own +3000 target", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08MunchMunchMutation019], character: [eb01Doma005], activeDon: 3 },
      { character: [eb01MountainGod018] },
    );
    const own = engine.findCardInZone("south", "character", eb01Doma005);
    const opposing = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.playCard(op08MunchMunchMutation019);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposing] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [own] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === opposing)
        ?.power,
    ).toBe(4000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === own)?.power,
    ).toBe(6000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger K.O.s the 5000-power boundary", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { life: [op08MunchMunchMutation019] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const target = engine.findCardInZone("south", "character", eb01Doma005);
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
    expect(engine.getView("north").players.south.trash.map((c) => c.instanceId)).toContain(target);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

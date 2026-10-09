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
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, "ST01-005"] },
      { life: [op08MunchMunchMutation019] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const target = engine.findCardInZone("south", "character", "ST01-005");
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const choice = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (choice?.kind !== "selectEntity") throw Error("Expected Trigger KO choice");
    expect(choice.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
    expect(engine.getView("north").players.south.trash.map((c) => c.instanceId)).toContain(target);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
  test("FAQ: Main buffs own Character even with no opposing Characters", () => {
    const e = OnePieceTestEngine.create({
      hand: ["OP08-019"],
      activeDon: 3,
      character: ["ST02-012"],
    });
    const id = e.findCardInZone("south", "character", "ST02-012");
    e.asSouth().play("OP08-019");
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
  });
  test("FAQ: Counter still buffs own Character when attacking Leader has no Characters", () => {
    const e = OnePieceTestEngine.create(
      {},
      { hand: ["OP08-019"], activeDon: 3, character: [{ cardId: "ST02-012", rested: true }] },
    );
    const id = e.findCardInZone("north", "character", "ST02-012");
    e.asSouth().attack(e.leader("south"), id);
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "OP08-019")] },
      "north",
    );
    e.asNorth().chooseTargets(id);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).not.toContain(id);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
  });
});

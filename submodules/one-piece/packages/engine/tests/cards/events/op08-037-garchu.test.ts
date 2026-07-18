import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08Garchu037,
  op08Nekomamushi028,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-037 Garchu", () => {
  test("Main rests an included Minks Character as optional cost before the opposing rest", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08Garchu037], character: [op08Nekomamushi028], activeDon: 1 },
      { character: [eb01Doma005] },
    );
    const cost = engine.findCardInZone("south", "character", op08Nekomamushi028);
    const target = engine.findCardInZone("north", "character", eb01Doma005);
    engine.playCard(op08Garchu037);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === cost)?.rested,
    ).toBe(true);
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === target)
        ?.rested,
    ).toBe(true);
  });

  test("Life Trigger draws 1 without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op08Garchu037],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const draw = engine.findCardInZone("north", "deck", eb01Doma005);
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(draw);
  });
});

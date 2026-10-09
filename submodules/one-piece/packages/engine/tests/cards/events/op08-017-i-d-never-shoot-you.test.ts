import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08IDNeverShootYou017 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-017 I'd Never Shoot You!!!!", () => {
  test("Counter saves its recipient and gives a separate opposing target -1000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { hand: [op08IDNeverShootYou017], life: 2, activeDon: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const debuff = engine.findCardInZone("south", "character", eb01Doma005);
    const event = engine.findCardInZone("north", "hand", op08IDNeverShootYou017);
    const before = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [debuff] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(before);
    expect(
      engine.getView("north").players.south.characters.find((c) => c?.instanceId === debuff)?.power,
    ).toBe(2000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("Counter can skip its own buff and still reduce opposing Leader for the turn", () => {
    const e = OnePieceTestEngine.create({}, { hand: ["OP08-017"], activeDon: 2, life: 3 });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "OP08-017")] },
      "north",
    );
    e.asNorth().chooseTargets();
    e.asNorth().chooseTargets(e.leader("south"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("south").players.south.leader.power).toBe(4000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test.each(["leader", "character"] as const)(
    "Life Trigger gives own%s1000 only for current turn",
    (zone) => {
      const e = OnePieceTestEngine.create({}, { life: ["OP08-017"], character: ["ST02-012"] });
      const id =
        zone === "leader" ? e.leader("north") : e.findCardInZone("north", "character", "ST02-012");
      e.asSouth().attack(e.leader("south"), e.leader("north"));
      e.asNorth().activateLifeTrigger();
      e.asNorth().chooseTargets(id);
      expect(
        zone === "leader"
          ? e.getView("north").players.north.leader.power
          : e.getView("north").players.north.characters[0]?.power,
      ).toBe(zone === "leader" ? 6000 : 4000);
      e.asSouth().endTurn();
      expect(
        zone === "leader"
          ? e.getView("north").players.north.leader.power
          : e.getView("north").players.north.characters[0]?.power,
      ).toBe(zone === "leader" ? 5000 : 3000);
    },
  );
});

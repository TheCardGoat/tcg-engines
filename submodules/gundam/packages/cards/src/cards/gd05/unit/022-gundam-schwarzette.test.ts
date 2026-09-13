import { describe, expect, it } from "vite-plus/test";
import {
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { expectBreachAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05GundamSchwarzette022 } from "./022-gundam-schwarzette.ts";

// @behavioral-proof complete
describe("Gundam Schwarzette (GD05-022)", () => {
  it("<Breach 3> deals exactly 3 damage after destroying a Unit in battle", () => {
    expectBreachAbility(gd05GundamSchwarzette022, 3);
  });

  describe("【Activate･Action】Exile 2 Command cards in your trash from the game：During this battle, when this Unit receives enemy damage, reduce it by 2.", () => {
    it("pays exactly two Command cards during its action-step priority and reduces the enemy Unit's battle damage", () => {
      const enemy = createMockUnit({ ap: 5, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamSchwarzette022],
          trash: [createMockCommand(), createMockCommand()],
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const schwarzetteId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandIds = p1.getCardsInZone("trash");

      expectSuccess(p1.enterBattle(schwarzetteId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(schwarzetteId, 0, { targets: commandIds }));
      expect(p1.getCardsInZone("trash")).toHaveLength(0);
      expect(commandIds.every((id) => p1.getCardZone(id) === "removalArea")).toBe(true);

      // An action resets priority; both players then pass into the damage step.
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getDamage(schwarzetteId)).toBe(3);
    });

    it("cannot activate when fewer than two Command cards can pay the exile cost", () => {
      const enemy = createMockUnit({ ap: 5, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamSchwarzette022],
          trash: [createMockCommand()],
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const schwarzetteId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(schwarzetteId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectFailure(p1.activateAbility(schwarzetteId, 0), "COST_NOT_PAYABLE");
    });
  });
});

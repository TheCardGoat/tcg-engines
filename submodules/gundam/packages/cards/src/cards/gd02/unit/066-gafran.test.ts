import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02Gafran066 } from "./066-gafran.ts";

describe("Gafran (GD02-066)", () => {
  it("requires its printed Lv.2 and one active Resource to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02Gafran066],
      resourceArea: activeResources(1),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02Gafran066), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02Gafran066)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 2,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02Gafran066],
      resourceArea: activeResources(2),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02Gafran066), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02Gafran066)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("This Unit can't choose the enemy player as its attack target.", () => {
    it("rejects a direct attack but permits an attack on a rested enemy Unit", () => {
      const enemy = createMockUnit({ hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [gd02Gafran066], shieldArea: [openingShield], deck: 5 },
        { play: [enemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gafranId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectFailure(p1.enterBattle(gafranId, "direct"), "CANNOT_TARGET_PLAYER");
      expect(p1.isExhausted(gafranId)).toBe(false);
      expectSuccess(p1.enterBattle(gafranId, enemyId));

      expect(p1.isExhausted(gafranId)).toBe(true);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: gafranId });
    });
  });
});

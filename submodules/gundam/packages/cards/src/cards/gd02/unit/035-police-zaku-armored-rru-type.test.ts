import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02PoliceZakuArmoredRruType035 } from "./035-police-zaku-armored-rru-type.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Police Zaku (Armored RRU Type) (GD02-035)", () => {
  describe("Printed Lv.2 and cost 1", () => {
    it("cannot deploy with only 1 total Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02PoliceZakuArmoredRruType035],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play rests both Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02PoliceZakuArmoredRruType035],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    });
  });

  it("This Unit can't choose the enemy player as its attack target.", () => {
    const enemy = createMockUnit({ ap: 1, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        play: [gd02PoliceZakuArmoredRruType035],
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [policeZakuId] = p1.getCardsInZone("battleArea");
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectFailure(p1.enterBattle(policeZakuId!, "direct"), "CANNOT_TARGET_PLAYER");

    expectSuccess(p1.enterBattle(policeZakuId!, enemyId!));
  });
});

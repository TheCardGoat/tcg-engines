import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GuelSDilanza083 } from "./083-guel-s-dilanza.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Guel's Dilanza (GD01-083)", () => {
  it("deploys with visible stats, links with an Academy Pilot, and attacks this turn", () => {
    const academyPilot = createMockPilot({ traits: ["academy"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GuelSDilanza083, academyPilot],
        deck: 2,
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01GuelSDilanza083));
    const dilanzaId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(dilanzaId)).toMatchObject({ effectiveAp: 2, effectiveHp: 2 });
    expect(p1.getCardZone(dilanzaId)).toBe(`battleArea:${PLAYER_ONE}`);
    expectSuccess(p1.assignPilot(academyPilot, dilanzaId));

    expectSuccess(p1.enterBattle(dilanzaId, enemyId));
  });
});

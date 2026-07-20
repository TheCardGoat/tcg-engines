import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaMichaelis076 } from "./076-michaelis.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Michaelis (GD01-076, beta reprint)", () => {
  it("gets AP+1 and HP+1 with four Commands in trash and links with an Academy Pilot", () => {
    const academyPilot = createMockPilot({ traits: ["academy"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [betaMichaelis076, academyPilot],
        deck: 2,
        trash: [createMockCommand(), createMockCommand(), createMockCommand(), createMockCommand()],
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
    expectSuccess(p1.deployUnit(betaMichaelis076));
    const michaelisId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(michaelisId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
    expectSuccess(p1.assignPilot(academyPilot, michaelisId));
    expectSuccess(p1.enterBattle(michaelisId, enemyId));
  });

  it("keeps its printed stats when fewer than four Commands are in trash", () => {
    const engine = GundamTestEngine.create({
      hand: [betaMichaelis076],
      trash: [createMockCommand(), createMockCommand(), createMockCommand(), createMockUnit()],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(betaMichaelis076));
    const michaelisId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(michaelisId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });
});

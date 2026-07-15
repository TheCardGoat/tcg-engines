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
import { gd01Kshatriya051 } from "./051-kshatriya.ts";

describe("Kshatriya (GD01-051)", () => {
  it("deploys with its visible stats and links with a Cyber-Newtype Pilot", () => {
    const cyberNewtype = createMockPilot({
      traits: ["cyber-newtype"],
      apBonus: 0,
      hpBonus: 0,
      level: 1,
      cost: 1,
    });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Kshatriya051, cyberNewtype],
        deck: 2,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.deployUnit(gd01Kshatriya051));
    const kshatriyaId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(kshatriyaId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
    expect(p1.getCardZone(kshatriyaId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);

    expectSuccess(p1.assignPilot(cyberNewtype, kshatriyaId));
    expectSuccess(p1.enterBattle(kshatriyaId, enemyId));
  });
});

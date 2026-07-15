import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04SpiritualSupport103 } from "./103-spiritual-support.ts";

describe("Spiritual Support (GD04-103)", () => {
  it("【Main】grants Repair 2 that recovers 2 HP at the end of the turn", () => {
    const unit = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04SpiritualSupport103],
        play: [{ card: unit, damage: 2 }],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId, { targets: [unitId] }));
    expect(p1.getDamage(unitId)).toBe(2);
    expect(p1.getVisibleCard(unitId)?.keywords).toContain("Repair");
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getBoardView().activePlayer).toBe(PLAYER_TWO);
    expect(p1.getDamage(unitId)).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });
});

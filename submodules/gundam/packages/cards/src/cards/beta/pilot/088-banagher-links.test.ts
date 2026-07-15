import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  activeResources,
} from "@tcg/gundam-engine";
import { betaBanagherLinks088 } from "./088-banagher-links.ts";
describe("Banagher Links (GD01-088)", () => {
  it("【Burst】 adds Banagher to hand when his shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [betaBanagherLinks088] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【When Paired】 with a Link Unit → 1 card drawn", () => {
    const unit = createMockUnit({ level: 5, cost: 1, linkCondition: "[Banagher Links]" });
    const drawCard = createMockUnit({ name: "Drawn Card" });
    const engine = GundamTestEngine.create(
      { hand: [unit, betaBanagherLinks088], resourceArea: activeResources(6), deck: [drawCard] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;
    const pilotId = p1.getHand()[1]!;
    const drawCardId = p1.getCardsInZone("deck")[0]!;
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilotId, unitId));

    expect(p1.getCardZone(drawCardId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("【When Paired】 pairing non-Link Unit → no draw", () => {
    const unit = createMockUnit({ level: 5, cost: 1 });
    const drawCard = createMockUnit({ name: "Undrawn Card" });
    const engine = GundamTestEngine.create(
      { hand: [unit, betaBanagherLinks088], resourceArea: activeResources(6), deck: [drawCard] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;
    const pilotId = p1.getHand()[1]!;
    const drawCardId = p1.getCardsInZone("deck")[0]!;
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilotId, unitId));

    expect(p1.getCardZone(drawCardId)).toBe(`deck:${PLAYER_ONE}`);
  });
});

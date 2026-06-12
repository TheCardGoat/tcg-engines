import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04MomentOfRest102 } from "./102-moment-of-rest.ts";

describe("Moment of Rest (GD04-102)", () => {
  it("【Burst】draws 1", () => {
    const engine = GundamTestEngine.create({ deck: [gd04MomentOfRest102, createMockUnit()] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });

  it("【Main】prevents a rested enemy Lv.5 or lower Unit from readying next opponent start phase", () => {
    const enemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd04MomentOfRest102], resourceArea: activeResources(4), deck: 5 },
      { play: [enemy], resourceArea: activeResources(3), deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[enemyId] = true;

    expectSuccess(p1.playCommand(gd04MomentOfRest102, { targets: [enemyId] }));

    expect(
      engine
        .getG()
        .continuousEffects.some(
          (effect) =>
            effect.targetId === enemyId &&
            effect.payload.kind === "restriction" &&
            effect.payload.restriction === "prevent-active",
        ),
    ).toBe(true);

    engine.endTurn();

    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });

  it("cannot target an active enemy Unit", () => {
    const enemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd04MomentOfRest102], resourceArea: activeResources(4), deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(gd04MomentOfRest102, { targets: [enemyId] }), "INVALID_TARGET");
  });
});

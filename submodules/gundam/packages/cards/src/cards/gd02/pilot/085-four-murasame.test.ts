import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  handleRecoverHPAction,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02FourMurasame085 } from "./085-four-murasame.ts";

describe("Four Murasame (GD02-085)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02FourMurasame085] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd02FourMurasame085.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【During Link】【When Healed】 draws 1 when linked, during your turn, hand ≤ 4", () => {
    // Pilot-resident `type: "triggered"` with a unit-healed event timing and a
    // separate `duringLink` condition.
    // When the paired unit recovers HP, the engine emits a `unitHealed` event
    // whose observer scan picks up Four Murasame (the paired pilot lives in
    // `battleArea` next to the unit per PR #122). The duringLink gate rebinds
    // onto the paired unit (rule 3-3-9-1), handCount ≤ 4 and isTurn:friendly
    // conditions hold, so the draw directive resolves.
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 4,
      cost: 1,
      linkCondition: "[Four Murasame]",
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      {
        hand: [unit, gd02FourMurasame085],
        resourceArea: activeResources(5),
        deck: 3,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(gd02FourMurasame085, unit));

    const runtime = engine.getRuntime();
    const unitId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;

    // Seed damage so the heal is not a no-op.
    runtime.runTestMutation(PLAYER_ONE as PlayerId, ({ G }) => {
      G.damage[unitId] = 2;
    });

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    runtime.runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      handleRecoverHPAction([unitId] as never, 1, {
        G,
        framework,
        sourcePlayerId: PLAYER_ONE,
        sourceCardId: unitId,
      });
    });

    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore + 1);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });
});

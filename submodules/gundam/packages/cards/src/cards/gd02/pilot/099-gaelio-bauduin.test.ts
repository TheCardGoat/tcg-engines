import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02GaelioBauduin099 } from "./099-gaelio-bauduin.ts";

describe("Gaelio Bauduin (GD02-099)", () => {
  it("【Burst】Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02GaelioBauduin099] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【When Paired】 applies AP-2 to a chosen enemy Unit", () => {
    // The printed "4 or more (Gjallarhorn) cards in your trash" precondition
    // is NOT encoded in card data — effect fires unconditionally on pair.
    const pairedUnit = createMockUnit({
      ap: 2,
      hp: 4,
      level: 3,
      cost: 2,
    });
    const enemy = createMockUnit({ ap: 4, hp: 4, level: 4, cost: 2 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd02GaelioBauduin099],
        play: [pairedUnit],
        resourceArea: activeResources(6),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const pairedId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02GaelioBauduin099, pairedId));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    }

    const mod = findStatModifier(engine, enemyId, "ap");
    expect(mod?.modifier).toBe(-2);
  });
});

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  hasContinuousRestriction,
  giveShield,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st04Archangel015 } from "./015-archangel.ts";

describe("Archangel (ST04-015)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [st04Archangel015], resourceArea: activeResources(3), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(st04Archangel015));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Archangel into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st04Archangel015] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st04Archangel015);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Activate·Main】: sets the chosen friendly <Blocker> active AND applies cannot-attack, leaving other Blockers untouched", () => {
    const chosen = createMockUnit({
      ap: 2,
      hp: 3,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const otherBlocker = createMockUnit({
      ap: 2,
      hp: 3,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create({
      hand: [st04Archangel015],
      play: [
        { card: chosen, exhausted: true },
        { card: otherBlocker, exhausted: true },
      ],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    for (let i = 0; i < 3; i++) giveShield(engine, p1.playerId);
    expectSuccess(p1.deployBase(st04Archangel015));
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [chosenId, otherId] = p1.getCardsInZone("battleArea");

    // effectIndex 0 over `getActivatedEffects` — only the 【Activate·Main】
    // effect is surfaced (burst/deploy aren't activated).
    expectSuccess(p1.activateAbility(baseId, 0, { targets: [chosenId!] }));

    expect(engine.getG().exhausted[chosenId!]).toBeFalsy();
    expect(hasContinuousRestriction(engine, chosenId!, "cannot-attack")).toBe(true);
    expect(engine.getG().exhausted[otherId!]).toBe(true);
    expect(hasContinuousRestriction(engine, otherId!, "cannot-attack")).toBe(false);
  });
});

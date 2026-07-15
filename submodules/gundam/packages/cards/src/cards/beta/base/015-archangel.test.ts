import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  activeResources,
  createMockUnit,
  hasContinuousRestriction,
  giveShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaArchangel015 } from "./015-archangel.ts";
describe("Archangel (ST04-015)", () => {
  it("【Burst】Deploy this card — flips Archangel into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [betaArchangel015] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaArchangel015.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 moves 1 Shield into the controller's hand when the base is deployed", () => {
    const engine = GundamTestEngine.create({
      hand: [betaArchangel015],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    // Seed some shields so addShieldToHand has something to move.
    for (let i = 0; i < 3; i++) giveShield(engine, p1.playerId);

    const shieldsBefore = p1.getCardsInZone("shieldArea").length;
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(betaArchangel015));

    expect(p1.getCardsInZone("baseSection").length).toBe(1);
    // A shield moved to hand (-1 in shieldArea); hand loses base but gains shield = net 0.
    expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
    expect(p1.getHand().length).toBe(handBefore);
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
      hand: [betaArchangel015],
      play: [
        { card: chosen, exhausted: true },
        { card: otherBlocker, exhausted: true },
      ],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    for (let i = 0; i < 3; i++) giveShield(engine, p1.playerId);
    expectSuccess(p1.deployBase(betaArchangel015));
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

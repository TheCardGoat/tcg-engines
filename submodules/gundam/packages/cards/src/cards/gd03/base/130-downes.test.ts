import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Downes130 } from "./130-downes.ts";

describe("Downes (GD03-130)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03Downes130] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03Downes130);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd03Downes130], resourceArea: activeResources(5), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03Downes130));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: false } }));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getCardsInZone("baseSection").length).toBe(1);
  });

  it("【Deploy】 may pay the chosen Lv.4 or lower Vagan Unit's cost to deploy it from trash", () => {
    const vaganUnit = createMockUnit({
      cardNumber: "TEST-VAGAN-L4",
      name: "Test Vagan Unit",
      traits: ["vagan"],
      level: 4,
      cost: 2,
      hp: 4,
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Downes130],
      trash: [vaganUnit],
      resourceArea: activeResources(6),
      deck: 6,
    });
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashUnitId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.deployBase(gd03Downes130, { targets: [trashUnitId] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));

    expect(p1.getCardsInZone("battleArea")).toContain(trashUnitId);
    expect(p1.getCardsInZone("trash")).not.toContain(trashUnitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
  });

  it("【Deploy】 leaves the trash Unit and resources untouched when the optional deploy is declined", () => {
    const vaganUnit = createMockUnit({
      cardNumber: "TEST-VAGAN-DECLINE",
      traits: ["vagan"],
      level: 4,
      cost: 2,
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Downes130],
      trash: [vaganUnit],
      resourceArea: activeResources(6),
      deck: 6,
    });
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashUnitId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.deployBase(gd03Downes130, { targets: [trashUnitId] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: false } }));

    expect(p1.getCardsInZone("trash")).toContain(trashUnitId);
    expect(p1.getCardsInZone("battleArea")).not.toContain(trashUnitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("【Deploy】 only considers Vagan Units that are Lv.4 or lower in trash", () => {
    const wrongTrait = createMockUnit({
      cardNumber: "TEST-NON-VAGAN",
      traits: ["earth federation"],
      level: 4,
      cost: 1,
    });
    const tooHighLevel = createMockUnit({
      cardNumber: "TEST-VAGAN-L5",
      traits: ["vagan"],
      level: 5,
      cost: 1,
    });
    const validUnit = createMockUnit({
      cardNumber: "TEST-VAGAN-L3",
      traits: ["vagan"],
      level: 3,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Downes130],
      trash: [wrongTrait, tooHighLevel, validUnit],
      resourceArea: activeResources(6),
      deck: 6,
    });
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [wrongTraitId, tooHighLevelId, validUnitId] = p1.getCardsInZone("trash");

    expectSuccess(p1.deployBase(gd03Downes130, { targets: [validUnitId!] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));

    expect(p1.getCardsInZone("battleArea")).toEqual([validUnitId]);
    expect(p1.getCardsInZone("trash")).toEqual([wrongTraitId, tooHighLevelId]);
  });

  it("【Deploy】 does not deploy from trash when the Unit's cost cannot be paid", () => {
    const expensiveUnit = createMockUnit({
      cardNumber: "TEST-VAGAN-EXPENSIVE",
      traits: ["vagan"],
      level: 4,
      cost: 4,
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Downes130],
      trash: [expensiveUnit],
      resourceArea: activeResources(5),
      deck: 6,
    });
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashUnitId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.deployBase(gd03Downes130, { targets: [trashUnitId] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));

    expect(p1.getCardsInZone("trash")).toContain(trashUnitId);
    expect(p1.getCardsInZone("battleArea")).not.toContain(trashUnitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });
});

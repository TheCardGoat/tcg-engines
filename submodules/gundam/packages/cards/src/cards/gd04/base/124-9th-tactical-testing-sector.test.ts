import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundvLva025 } from "../unit/025-gundv-lva.ts";
import { gd049thTacticalTestingSector124 } from "./124-9th-tactical-testing-sector.ts";

describe("9th Tactical Testing Sector (GD04-124)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd049thTacticalTestingSector124],
      resourceArea: activeResources(3),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd049thTacticalTestingSector124));

    expect(p1.getHand()).toHaveLength(1);
  });

  it("【Burst】 offers its owner the choice to deploy this card after a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd049thTacticalTestingSector124] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd049thTacticalTestingSector124)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Burst】 leaves this card in trash when its owner declines", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd049thTacticalTestingSector124] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p2.getCardZone(gd049thTacticalTestingSector124)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("when you place an EX Resource, gives a friendly Academy Unit AP+2 this turn", () => {
    const otherDawnOfFold = createMockUnit({ traits: ["dawn of fold"] });
    const chosenAcademyUnit = createMockUnit({
      name: "Chosen Academy Unit",
      traits: ["academy"],
      ap: 3,
    });
    const otherAcademyUnit = createMockUnit({
      name: "Other Academy Unit",
      traits: ["academy"],
      ap: 3,
    });
    const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd049thTacticalTestingSector124],
        play: [gd04GundvLva025, otherDawnOfFold, chosenAcademyUnit, otherAcademyUnit],
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [gundvLvaId, , chosenAcademyUnitId, otherAcademyUnitId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const resourcesBefore = p1.getResourceCount();

    expectSuccess(p1.enterBattle(gundvLvaId!, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: baseId,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: expect.arrayContaining([chosenAcademyUnitId, otherAcademyUnitId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [chosenAcademyUnitId!] }));

    expect(p1.getCardZone(gundvLvaId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getResourceCount()).toBe(resourcesBefore + 1);
    expect(p1.getVisibleCard(chosenAcademyUnitId!)?.effectiveAp).toBe(5);
    expect(p1.getVisibleCard(otherAcademyUnitId!)?.effectiveAp).toBe(3);
  });
});

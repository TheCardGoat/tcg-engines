import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Hammerhead128 } from "./128-hammerhead.ts";

describe("Hammerhead (GD02-128)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02Hammerhead128] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Hammerhead Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Hammerhead128)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds a Shield and destroys the chosen 2-AP enemy with a Teiwaz Link Unit in play", () => {
    const linkUnit = createMockUnit({
      traits: ["teiwaz"],
      linkCondition: "[Link Pilot]",
    });
    const linkPilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
    const eligible = createMockUnit({ ap: 2, hp: 6 });
    const tooStrong = createMockUnit({ ap: 3, hp: 6 });
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [linkPilot, gd02Hammerhead128],
        play: [linkUnit],
        shieldArea: [returnedShield],
        resourceArea: activeResources(5),
      },
      { play: [eligible, tooStrong] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const linkUnitId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, tooStrongId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(linkPilot, linkUnitId));
    expectSuccess(p1.deployBase(gd02Hammerhead128));
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible 2-AP enemy Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expect(choice.legalTargetIds).not.toContain(tooStrongId);
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getCardZone(eligibleId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(tooStrongId!)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("does not destroy an enemy without a friendly Teiwaz Link Unit", () => {
    const enemy = createMockUnit({ ap: 2, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02Hammerhead128],
        play: [createMockUnit({ traits: ["teiwaz"] })],
        shieldArea: [createMockUnit({ name: "Shield" })],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd02Hammerhead128));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("cannot be deployed below its printed Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Hammerhead128],
      resourceArea: activeResources(3),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02Hammerhead128),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02Hammerhead128)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 4,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Hammerhead128],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, hammerheadId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(hammerheadId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(hammerheadId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});

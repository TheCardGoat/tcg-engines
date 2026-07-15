import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Farsia058 } from "../unit/058-farsia.ts";
import { gd03Defurse064 } from "../unit/064-defurse.ts";
import { gd03AeuHellion083 } from "../unit/083-aeu-hellion.ts";
import { gd03Downes130 } from "./130-downes.ts";

describe("Downes (GD03-130)", () => {
  it("deploys from Burst without offering the trash deploy during the opponent's turn", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const remainingShield = createMockUnit({
      cardNumber: "TEST-REMAINING-SHIELD",
      name: "Remaining Shield",
    });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        shieldArea: [gd03Downes130, remainingShield],
        trash: [gd03Farsia058],
        resourceArea: activeResources(4),
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const trashUnitId = p2.getCardsInZone("trash")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03Downes130)).toBe(`baseSection:${PLAYER_TWO}`);
    expect(p2.getCardZone(remainingShield)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardsInZone("trash")).toContain(trashUnitId);
    expect(p2.getBoardView().pendingChoice).toBeUndefined();
  });

  it("lets the player accept, choose, pay for, and deploy an eligible Vagan Unit from trash", () => {
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Downes130],
      trash: [gd03Farsia058, gd03Defurse064, gd03AeuHellion083],
      resourceArea: activeResources(6),
      shieldArea: [returnedShield],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [validUnitId, highLevelId, wrongTraitId] = p1.getCardsInZone("trash");

    expectSuccess(p1.deployBase(gd03Downes130));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_ONE,
      sourceCardId: p1.getCardsInZone("baseSection")[0],
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));
    const targetPrompt = p1.getBoardView().pendingChoice;
    expect(targetPrompt).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      legalTargetIds: [validUnitId],
    });
    expect(targetPrompt?.kind === "targetSelection" ? targetPrompt.legalTargetIds : []).not.toEqual(
      expect.arrayContaining([highLevelId, wrongTraitId]),
    );
    expectSuccess(p1.resolveEffect({ targets: [validUnitId!] }));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03Downes130)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("battleArea")).toContain(validUnitId);
    expect(p1.getCardsInZone("trash")).toEqual([highLevelId, wrongTraitId]);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("leaves the Unit in trash and pays only for Downes when the player declines", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03Downes130],
      trash: [gd03Farsia058],
      resourceArea: activeResources(6),
      shieldArea: [createMockUnit({ name: "Shield" })],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashUnitId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.deployBase(gd03Downes130));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: false } }));

    expect(p1.getCardsInZone("trash")).toContain(trashUnitId);
    expect(p1.getCardsInZone("battleArea")).not.toContain(trashUnitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("does not offer the optional deploy when no eligible Vagan Unit can be paid for", () => {
    const expensiveVagan = createMockUnit({
      cardNumber: "TEST-EXPENSIVE-VAGAN",
      traits: ["vagan"],
      level: 4,
      cost: 4,
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Downes130],
      trash: [expensiveVagan, gd03Defurse064, gd03AeuHellion083],
      resourceArea: activeResources(5),
      shieldArea: [createMockUnit({ name: "Shield" })],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashBefore = p1.getCardsInZone("trash");

    expectSuccess(p1.deployBase(gd03Downes130));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("trash")).toEqual(trashBefore);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });
});

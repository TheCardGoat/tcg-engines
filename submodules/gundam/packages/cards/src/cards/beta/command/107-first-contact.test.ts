import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaFirstContact107 } from "./107-first-contact.ts";
describe("First Contact (GD01-107, beta reprint)", () => {
  it("【Burst】Place 1 EX Resource.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { shieldArea: [betaFirstContact107], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    const [exResourceId] = p1.getCardsInZone("resourceArea");
    expect(p1.isExhausted(exResourceId!)).toBe(false);
  });

  it("【Main】places the top Resource from the resource deck rested and trashes the Command", () => {
    const engine = GundamTestEngine.create({
      hand: [betaFirstContact107],
      resourceArea: activeResources(3),
      resourceDeck: 2,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cmdId = p1.getHand()[0]!;
    const existingResources = new Set(p1.getCardsInZone("resourceArea"));
    const resourceDeckBefore = p1.getCardsInZone("resourceDeck").length;

    expectSuccess(p1.playCommand(betaFirstContact107));

    const placedResourceId = p1
      .getCardsInZone("resourceArea")
      .find((cardId) => !existingResources.has(cardId));
    expect(placedResourceId).toBeDefined();
    expect(p1.isExhausted(placedResourceId!)).toBe(true);
    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(resourceDeckBefore - 1);
    expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
  });
});

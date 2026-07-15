import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  createMockBase,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd02ANewSign117 } from "./117-a-new-sign.ts";

describe("A New Sign (GD02-117)", () => {
  it("【Burst】Chooses an AEUG Base from trash and moves it to hand", () => {
    const aeugBase = createMockBase({ traits: ["aeug"], hp: 5 });
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd02ANewSign117], trash: [aeugBase], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [baseId] = p1.getCardsInZone("trash");
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [baseId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [baseId!] }));

    expect(p1.getCardZone(baseId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd02ANewSign117)).toBe(`trash:${PLAYER_ONE}`);
  });

  describe("【Main】Draw 3. Then, discard 2.", () => {
    it("draws 3, then asks which 2 cards from the updated hand to discard", () => {
      const firstDiscard = createMockUnit({ name: "First Discard" });
      const secondDiscard = createMockUnit({ name: "Second Discard" });
      const engine = GundamTestEngine.create({
        hand: [gd02ANewSign117, firstDiscard, secondDiscard],
        resourceArea: activeResources(4),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [commandId, firstDiscardId, secondDiscardId] = p1.getHand();

      expectSuccess(p1.playCommand(gd02ANewSign117));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([firstDiscardId, secondDiscardId]),
        minTargets: 2,
        maxTargets: 2,
      });
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected A New Sign to ask which 2 cards to discard after drawing");
      }
      expect(choice.legalTargetIds).toHaveLength(5);
      expectSuccess(p1.resolveEffect({ targets: [firstDiscardId!, secondDiscardId!] }));

      expect(p1.getCardZone(firstDiscardId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(secondDiscardId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(3);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
      expectCardInTrash(engine, commandId!, p1.playerId);
    });
  });
});

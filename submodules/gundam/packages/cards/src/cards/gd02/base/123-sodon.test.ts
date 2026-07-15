import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  activeResources,
} from "@tcg/gundam-engine";
import { gd02Sodon123 } from "./123-sodon.ts";

describe("Sodon (GD02-123)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const tokenMaker = createMockUnit({
      name: "Token Maker",
      cost: 0,
      effects: [
        {
          type: "triggered",
          activation: { timing: ["deploy"] },
          directives: [
            {
              action: {
                action: "deployToken",
                token: {
                  name: "Friendly Token",
                  traits: [],
                  ap: 1,
                  hp: 1,
                  deployState: "active",
                },
              },
            },
          ],
          sourceText: "【Deploy】Deploy 1 Unit token.",
        },
      ],
    });
    const firstShield = createMockUnit({ name: "First Shield" });
    const secondShield = createMockUnit({ name: "Second Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [tokenMaker, gd02Sodon123],
        shieldArea: [firstShield, secondShield],
        resourceArea: activeResources(6),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [tokenMakerId, sodonId] = p1.getHand();
    const shieldIds = p1.getCardsInZone("shieldArea");

    expectSuccess(p1.deployUnit(tokenMakerId!));
    const tokenId = p1.getCardsInZone("battleArea")[1]!;
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(sodonId!));
    const ordering = p1.getBoardView().pendingChoice;
    if (ordering?.kind !== "ordering") throw new Error("Expected Deploy-effect ordering");
    const sodonEffect = ordering.candidates.find((candidate) => candidate.sourceCardId === sodonId);
    expectSuccess(p1.resolveEffect({ pendingEffectId: sodonEffect!.effectId }));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;
    expect(choice.legalTargetIds).toEqual([tokenId]);
    expectSuccess(p1.resolveEffect({ targets: [tokenId] }));

    // Top shield enters hand; hand count unchanged (base out, shield in).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Sodon into baseSection on shield destruction", () => {
    const attacker = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd02Sodon123] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_TWO}`);
  });
});

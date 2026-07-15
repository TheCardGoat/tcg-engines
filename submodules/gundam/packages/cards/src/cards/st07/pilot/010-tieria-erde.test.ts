import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07TieriaErde010 } from "./010-tieria-erde.ts";

describe("Tieria Erde (ST07-010)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st07TieriaErde010] },
    );
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

    expect(p2.getHand()).toContain(shieldId);
  });

  it("【Destroyed】draws 1 when the paired CB Unit is destroyed on your opponent's turn", () => {
    const cbLinkUnit = createMockUnit({
      traits: ["cb"],
      linkCondition: "[Tieria Erde]",
      hp: 5,
    });
    const engine = GundamTestEngine.create(
      {
        hand: [st07TieriaErde010],
        play: [{ card: cbLinkUnit, exhausted: true }],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [createMockUnit({ ap: 7, hp: 6 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07TieriaErde010, unitId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    const deckBeforeBattle = p1.getCardsInZone("deck").length;
    expectSuccess(p2.enterBattle(attackerId, unitId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBeforeBattle - 1);
  });

  it("does not draw when the paired CB Unit is destroyed on your turn", () => {
    const cbLinkUnit = createMockUnit({
      traits: ["cb"],
      linkCondition: "[Tieria Erde]",
      ap: 1,
      hp: 5,
    });
    const defender = createMockUnit({ ap: 7, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07TieriaErde010],
        play: [cbLinkUnit],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getCardsInZone("deck").length;

    expectSuccess(p1.assignPilot(st07TieriaErde010, unitId));
    expectSuccess(p1.enterBattle(unitId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
    expect(p1.getHand()).toHaveLength(0);
  });

  it("draws exactly 1 when an opponent's effect destroys the paired CB Unit", () => {
    const cbLinkUnit = createMockUnit({
      traits: ["cb"],
      linkCondition: "[Tieria Erde]",
      hp: 5,
    });
    const destroyCommand = createMockCommand({
      name: "Destroy Enemy Unit",
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "destroy",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Choose 1 enemy Unit. Destroy it.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [st07TieriaErde010],
        play: [cbLinkUnit],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { hand: [destroyCommand], resourceArea: activeResources(1), deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st07TieriaErde010, unitId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    const handBefore = p1.getHand().length;
    const deckBefore = p1.getCardsInZone("deck").length;
    expectSuccess(p2.playCommand(destroyCommand, { targets: [unitId] }));

    expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getHand()).toHaveLength(handBefore + 1);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
  });
});

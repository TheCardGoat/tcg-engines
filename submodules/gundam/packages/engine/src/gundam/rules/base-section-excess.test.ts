import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

const burstDeploySelf: CardEffect = {
  type: "triggered",
  activation: { timing: ["burst"] },
  directives: [{ action: { action: "deploySelf" } }],
  sourceText: "【Burst】Deploy this card.",
};

const drawOnDeploy: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【Deploy】Draw 1.",
};

const drawTwoWhenDestroyed: CardEffect = {
  type: "triggered",
  activation: { timing: ["destroyed"] },
  directives: [{ action: { action: "draw", count: 2 } }],
  sourceText: "【Destroyed】Draw 2.",
};

function deckCards() {
  return [
    createMockUnit({ name: "Deck card 1" }),
    createMockUnit({ name: "Deck card 2" }),
    createMockUnit({ name: "Deck card 3" }),
  ];
}

describe("Base-section excess rules management (11-5-2)", () => {
  it("places a hand-deployed Base first, asks which visible Base to trash, then resolves Deploy", () => {
    const establishedBase = createMockBase({
      name: "Established Base",
      effects: [drawTwoWhenDestroyed],
    });
    const incomingBase = createMockBase({
      name: "Incoming Base",
      level: 1,
      cost: 1,
      effects: [drawOnDeploy],
    });
    const engine = GundamTestEngine.create({
      hand: [incomingBase],
      baseSection: [establishedBase],
      resourceArea: activeResources(1),
      deck: deckCards(),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const establishedBaseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.deployBase(incomingBase));

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a Base-section replacement choice");
    }
    const visibleBases = p1.getCardsInZone("baseSection");
    const incomingBaseId = visibleBases.find((cardId) => cardId !== establishedBaseId)!;
    expect(visibleBases).toEqual(expect.arrayContaining([establishedBaseId, incomingBaseId]));
    expect(choice).toMatchObject({
      controllerId: PLAYER_ONE,
      sourceCardId: incomingBaseId,
      minTargets: 1,
      maxTargets: 1,
      prompt: "Choose 1 Base in your Base section to place into your trash.",
    });
    expect(choice.legalTargetIds).toEqual(
      expect.arrayContaining([establishedBaseId, incomingBaseId]),
    );
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);

    expectSuccess(p1.resolveEffect({ targets: [establishedBaseId] }));

    expect(p1.getCardZone(establishedBaseId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(incomingBaseId)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("baseSection")).toEqual([incomingBaseId]);
    // The incoming Base's Deploy draws exactly 1. The established Base's
    // Destroyed effect does not trigger because rules management is not destruction.
    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });

  it("uses the same visible choice when a second Burst Base is deployed", () => {
    const establishedBase = createMockBase({
      name: "Established Burst Base",
      effects: [burstDeploySelf, drawTwoWhenDestroyed],
    });
    const incomingBase = createMockBase({
      name: "Incoming Burst Base",
      effects: [burstDeploySelf, drawOnDeploy],
    });
    const suppressionAttacker = createMockUnit({
      name: "Suppression Attacker",
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Suppression" }],
    });
    const engine = GundamTestEngine.create(
      { play: [suppressionAttacker] },
      { shieldArea: [establishedBase, incomingBase], deck: deckCards() },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    const ordering = p2.getBoardView().pendingChoice;
    if (ordering?.kind !== "ordering") {
      throw new Error("Expected the Shield owner to order simultaneous Burst effects");
    }
    const establishedBurst = ordering.candidates.find((candidate) =>
      candidate.label.startsWith("Established Burst Base:"),
    );
    if (!establishedBurst) throw new Error("Expected the established Base's Burst choice");
    expectSuccess(p2.resolveEffect({ pendingEffectId: establishedBurst.effectId }));
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    const establishedBaseId = p2.getCardsInZone("baseSection")[0]!;
    const incomingBurst = p2.getBoardView().pendingChoice;
    if (incomingBurst?.kind !== "optional") {
      throw new Error("Expected the remaining Base's Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a Base-section replacement choice after Burst deployment");
    }
    const visibleBases = p2.getCardsInZone("baseSection");
    const incomingBaseId = visibleBases.find((cardId) => cardId !== establishedBaseId)!;
    expect(visibleBases).toEqual(expect.arrayContaining([establishedBaseId, incomingBaseId]));
    expect(choice).toMatchObject({
      controllerId: PLAYER_TWO,
      sourceCardId: incomingBaseId,
      minTargets: 1,
      maxTargets: 1,
    });
    expect(choice.legalTargetIds).toEqual(
      expect.arrayContaining([establishedBaseId, incomingBaseId]),
    );
    expect(p2.getHand()).toHaveLength(0);
    expect(p2.getBoardView().players[PLAYER_TWO]?.deckCount).toBe(3);

    expectSuccess(p2.resolveEffect({ targets: [establishedBaseId] }));

    expect(p2.getCardZone(establishedBaseId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(incomingBaseId)).toBe(`baseSection:${PLAYER_TWO}`);
    expect(p2.getCardsInZone("baseSection")).toEqual([incomingBaseId]);
    // The new Base's Deploy resolves only after replacement. The removed
    // Base was placed in trash, so its Destroyed draw never triggers.
    expect(p2.getHand()).toHaveLength(1);
    expect(p2.getBoardView().players[PLAYER_TWO]?.deckCount).toBe(2);
  });

  it("removes a replaced EX Base token from the game without leaving a trash ghost", () => {
    const deployExBase = createMockCommand({
      name: "Deploy EX Base",
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [{ action: { action: "deployExBase" } }],
          sourceText: "【Main】Deploy 1 EX Base.",
        },
      ],
    });
    const incomingBase = createMockBase({ name: "Incoming Base", level: 0, cost: 0 });
    const engine = GundamTestEngine.create({ hand: [deployExBase, incomingBase] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(deployExBase));
    const exBaseId = p1.getCardsInZone("baseSection")[0]!;
    const trashBefore = p1.getBoardView().players[PLAYER_ONE]!.trashCount;
    expectSuccess(p1.deployBase(incomingBase));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([exBaseId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [exBaseId] }));

    expect(p1.getCardZone(exBaseId)).toBeUndefined();
    expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    expect(p1.getBoardView().players[PLAYER_ONE]!.trashCount).toBe(trashBefore);
  });

  it("deploys an EX Base into an occupied section and lets the player keep either visible Base", () => {
    const deployExBase = createMockCommand({
      name: "Deploy EX Base into occupied section",
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [{ action: { action: "deployExBase" } }],
          sourceText: "【Main】Deploy 1 EX Base.",
        },
      ],
    });
    const establishedBase = createMockBase({ name: "Established Base" });
    const engine = GundamTestEngine.create({
      hand: [deployExBase],
      baseSection: [establishedBase],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const establishedBaseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.playCommand(deployExBase));

    const visibleBases = p1.getCardsInZone("baseSection");
    const exBaseId = visibleBases.find((cardId) => cardId !== establishedBaseId)!;
    expect(visibleBases).toHaveLength(2);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([establishedBaseId, exBaseId]),
    });

    expectSuccess(p1.resolveEffect({ targets: [establishedBaseId] }));

    expect(p1.getCardsInZone("baseSection")).toEqual([exBaseId]);
    expect(p1.getCardZone(establishedBaseId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});

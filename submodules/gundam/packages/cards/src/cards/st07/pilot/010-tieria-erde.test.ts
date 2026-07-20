import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st07TieriaErde010 } from "./010-tieria-erde.ts";

describe("Tieria Erde (ST07-010)", () => {
  it("accepts Burst and adds itself to hand", () => {
    const engine = GundamTestEngine.create(
      { play: [createMockUnit()] },
      { shieldArea: [st07TieriaErde010] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
    expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("declines Burst and puts itself in trash", () => {
    const engine = GundamTestEngine.create(
      { play: [createMockUnit()] },
      { shieldArea: [st07TieriaErde010] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));
    expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("pairs for Lv.4/cost1 and grants +1 AP/+1 HP", () => {
    const engine = GundamTestEngine.create({
      hand: [st07TieriaErde010],
      play: [createMockUnit({ ap: 2, hp: 3 })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07TieriaErde010, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });

  it("requires Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [st07TieriaErde010],
      play: [createMockUnit()],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(
      p1.assignPilot(st07TieriaErde010, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires one active resource", () => {
    const engine = GundamTestEngine.create({
      hand: [st07TieriaErde010],
      play: [createMockUnit()],
      resourceArea: restedResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(
      p1.assignPilot(st07TieriaErde010, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCES",
    );
  });

  it("draws exactly one when its paired CB Unit is destroyed on the opponent's turn", () => {
    const host = createMockUnit({ traits: ["cb"], linkCondition: "[Tieria Erde]", hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07TieriaErde010],
        play: [{ card: host, exhausted: true }],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [createMockUnit({ ap: 5, hp: 5 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07TieriaErde010, hostId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
    expectSuccess(p2.enterBattle(attackerId, hostId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when the paired CB Unit is destroyed on its controller's turn", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [st07TieriaErde010], play: [host], resourceArea: activeResources(4), deck: 5 },
      { play: [{ card: createMockUnit({ ap: 5, hp: 5 }), exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const before = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
    expectSuccess(p1.assignPilot(st07TieriaErde010, hostId));
    expectSuccess(p1.enterBattle(hostId, p2.getCardsInZone("battleArea")[0]!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(before);
    expect(p1.getHand()).toHaveLength(0);
  });

  it("does not draw when its paired non-CB Unit is destroyed on the opponent's turn", () => {
    const host = createMockUnit({ traits: ["zeon"], hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07TieriaErde010],
        play: [{ card: host, exhausted: true }],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [createMockUnit({ ap: 5, hp: 5 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const before = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
    expectSuccess(p1.assignPilot(st07TieriaErde010, hostId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, hostId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(before);
  });

  it("draws for opponent-effect destruction through public playCommand", () => {
    const host = createMockUnit({ traits: ["cb"], hp: 5 });
    const destroy = createMockCommand({
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
          sourceText: "Destroy an enemy Unit.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      { hand: [st07TieriaErde010], play: [host], resourceArea: activeResources(4), deck: 5 },
      { hand: [destroy], resourceArea: activeResources(1), deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07TieriaErde010, id));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    const before = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
    expectSuccess(p2.playCommand(destroy, { targets: [id] }));
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(before - 1);
  });
});

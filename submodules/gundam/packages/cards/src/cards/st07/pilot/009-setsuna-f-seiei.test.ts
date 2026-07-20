import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st07SetsunaFSeiei009 } from "./009-setsuna-f-seiei.ts";

describe("Setsuna F. Seiei (ST07-009)", () => {
  it("accepts Burst and adds the revealed Shield to its controller's hand", () => {
    const engine = GundamTestEngine.create(
      { play: [createMockUnit()] },
      { shieldArea: [st07SetsunaFSeiei009] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");
    expect(burst).toMatchObject({ controllerId: PLAYER_TWO });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
    expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("declines Burst and puts the revealed Shield in trash", () => {
    const engine = GundamTestEngine.create(
      { play: [createMockUnit()] },
      { shieldArea: [st07SetsunaFSeiei009] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));
    expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("pairs for Lv.4/cost1 and grants printed +2 AP/+1 HP", () => {
    const engine = GundamTestEngine.create({
      hand: [st07SetsunaFSeiei009],
      play: [createMockUnit({ ap: 3, hp: 4 })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 5, effectiveHp: 5 });
  });

  it("requires Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [st07SetsunaFSeiei009],
      play: [createMockUnit()],
      resourceArea: activeResources(3),
    });
    expectFailure(
      engine
        .asPlayer(PLAYER_ONE)
        .assignPilot(
          st07SetsunaFSeiei009,
          engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!,
        ),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires one active resource", () => {
    const engine = GundamTestEngine.create({
      hand: [st07SetsunaFSeiei009],
      play: [createMockUnit()],
      resourceArea: restedResources(4),
    });
    expectFailure(
      engine
        .asPlayer(PLAYER_ONE)
        .assignPilot(
          st07SetsunaFSeiei009,
          engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!,
        ),
      "INSUFFICIENT_RESOURCES",
    );
  });

  it("below seven CB trash cards gives only the paired Unit AP+1 this turn", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 3, hp: 8 });
    const ally = createMockUnit({ traits: ["cb"], ap: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07SetsunaFSeiei009],
        play: [host, ally],
        trash: Array.from({ length: 6 }, () => createMockUnit({ traits: ["cb"] })),
        resourceArea: activeResources(4),
      },
      { play: [{ card: createMockUnit({ hp: 10 }), exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, allyId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, hostId!));
    expectSuccess(p1.enterBattle(hostId!, p2.getCardsInZone("battleArea")[0]!));
    expect(p1.getVisibleCard(hostId!)).toMatchObject({ effectiveAp: 6 });
    expect(p1.getVisibleCard(allyId!)).toMatchObject({ effectiveAp: 2 });
  });

  it("at exactly seven CB trash cards buffs all and only friendly CB Units once instead", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 3, hp: 8 });
    const cbAlly = createMockUnit({ traits: ["cb"], ap: 2 });
    const nonCb = createMockUnit({ traits: ["zeon"], ap: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07SetsunaFSeiei009],
        play: [host, cbAlly, nonCb],
        trash: Array.from({ length: 7 }, () => createMockUnit({ traits: ["cb"] })),
        resourceArea: activeResources(4),
      },
      { play: [{ card: createMockUnit({ traits: ["cb"], hp: 10 }), exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, cbId, nonCbId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, hostId!));
    expectSuccess(p1.enterBattle(hostId!, enemyId));
    expect(p1.getVisibleCard(hostId!)).toMatchObject({ effectiveAp: 6 });
    expect(p1.getVisibleCard(cbId!)).toMatchObject({ effectiveAp: 3 });
    expect(p1.getVisibleCard(nonCbId!)).toMatchObject({ effectiveAp: 4 });
    expect(p1.getVisibleCard(enemyId)).toMatchObject({ effectiveAp: 2 });
  });

  it("does not count seven non-CB trash cards", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 3, hp: 8 });
    const ally = createMockUnit({ traits: ["cb"], ap: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07SetsunaFSeiei009],
        play: [host, ally],
        trash: Array.from({ length: 7 }, () => createMockUnit({ traits: ["zeon"] })),
        resourceArea: activeResources(4),
      },
      { play: [{ card: createMockUnit({ hp: 10 }), exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, allyId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, hostId!));
    expectSuccess(p1.enterBattle(hostId!, p2.getCardsInZone("battleArea")[0]!));
    expect(p1.getVisibleCard(hostId!)).toMatchObject({ effectiveAp: 6 });
    expect(p1.getVisibleCard(allyId!)).toMatchObject({ effectiveAp: 2 });
  });

  it("expires the conditional AP bonus at the end of the turn", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 3, hp: 8 });
    const engine = GundamTestEngine.create(
      { hand: [st07SetsunaFSeiei009], play: [host], resourceArea: activeResources(4) },
      { play: [{ card: createMockUnit({ ap: 0, hp: 10 }), exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, id));
    expectSuccess(p1.enterBattle(id, p2.getCardsInZone("battleArea")[0]!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 5 });
  });
});

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st07SetsunaFSeiei009 } from "./009-setsuna-f-seiei.ts";

describe("Setsuna F. Seiei (ST07-009)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [st07SetsunaFSeiei009] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Attack】gives only this Unit AP+1 during this turn with fewer than 7 CB cards in trash", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 3, hp: 5 });
    const ally = createMockUnit({ traits: ["cb"], ap: 2, hp: 5 });
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07SetsunaFSeiei009],
        play: [host, ally],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, allyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, hostId!));
    expectSuccess(p1.enterBattle(hostId!, enemyId));

    const apBuffs = engine
      .getG()
      .continuousEffects.filter((entry) => entry.payload.kind === "stat-modifier");
    expect(apBuffs.some((entry) => entry.targetId === hostId)).toBe(true);
    expect(apBuffs.some((entry) => entry.targetId === allyId)).toBe(false);
  });

  it("【Attack】gives all friendly CB Units AP+1 instead with 7 or more CB cards in trash", () => {
    const host = createMockUnit({ traits: ["cb"], ap: 3, hp: 5 });
    const ally = createMockUnit({ traits: ["cb"], ap: 2, hp: 5 });
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const trash = Array.from({ length: 7 }, () => createMockUnit({ traits: ["cb"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [st07SetsunaFSeiei009],
        play: [host, ally],
        resourceArea: activeResources(4),
        trash,
        deck: 5,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, allyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st07SetsunaFSeiei009, hostId!));
    expectSuccess(p1.enterBattle(hostId!, enemyId));

    const apBuffs = engine
      .getG()
      .continuousEffects.filter((entry) => entry.payload.kind === "stat-modifier");
    expect(apBuffs.some((entry) => entry.targetId === hostId)).toBe(true);
    expect(apBuffs.some((entry) => entry.targetId === allyId)).toBe(true);
  });
});

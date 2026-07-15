import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { st02ZechsMerquise011 } from "./011-zechs-merquise.ts";

describe("Zechs Merquise (ST02-011)", () => {
  it("adds itself to its owner's hand when revealed as a Burst", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st02ZechsMerquise011] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("draws when its linked Unit destroys an enemy Unit with battle damage", () => {
    const linkedHost = createMockUnit({
      name: "Zechs Host",
      ap: 3,
      hp: 5,
      level: 5,
      linkCondition: "[Zechs Merquise]",
    });
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [st02ZechsMerquise011],
        play: [linkedHost],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.assignPilot(st02ZechsMerquise011, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("trash")).toContain(defenderId);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when a different friendly Unit destroys the enemy", () => {
    const linkedHost = createMockUnit({
      name: "Zechs Host",
      ap: 3,
      hp: 5,
      level: 5,
      linkCondition: "[Zechs Merquise]",
    });
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [st02ZechsMerquise011],
        play: [linkedHost, attacker],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, attackerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.assignPilot(st02ZechsMerquise011, hostId!));
    expectSuccess(p1.enterBattle(attackerId!, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("trash")).toContain(defenderId);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expect(p1.getHand()).toHaveLength(0);
  });
});

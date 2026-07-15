import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03JamilNeate096 } from "./096-jamil-neate.ts";

describe("Jamil Neate (GD03-096)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03JamilNeate096] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03JamilNeate096)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【During Link】【Attack】 may discard 1; if you do, draw 1", () => {
    const host = createMockUnit({
      level: 4,
      cost: 1,
      ap: 3,
      hp: 5,
      linkCondition: "[Jamil Neate]",
    });
    const discardFodder = createMockUnit({ level: 1, cost: 1 });
    const keptCard = createMockUnit({ level: 1, cost: 1 });
    const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
    const engine = GundamTestEngine.create(
      {
        hand: [gd03JamilNeate096, discardFodder, keptCard],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, discardFodderId, keptCardId] = p1.getHand();

    expectSuccess(p1.assignPilot(gd03JamilNeate096, host));
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getPilotId(attackerId)!;
    const deckBefore = p1.getCardsInZone("deck").length;
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: pilotId,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([discardFodderId, keptCardId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [discardFodderId!] }));

    expect(p1.getCardZone(discardFodderId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(keptCardId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
  });

  it("skips the draw when the optional discard is declined", () => {
    const host = createMockUnit({
      level: 4,
      cost: 1,
      ap: 3,
      hp: 5,
      linkCondition: "[Jamil Neate]",
    });
    const discardFodder = createMockUnit({ level: 1, cost: 1 });
    const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
    const engine = GundamTestEngine.create(
      {
        hand: [gd03JamilNeate096, discardFodder],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.assignPilot(gd03JamilNeate096, host));
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getPilotId(attackerId)!;
    const deckBefore = p1.getCardsInZone("deck").length;
    const handBefore = p1.getHand().length;
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: pilotId,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getCardZone(discardFodder)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
    expect(p1.getHand().length).toBe(handBefore);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
  });

  it("does not offer the discard when Jamil's paired Unit is not linked", () => {
    const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Different Pilot]" });
    const discardFodder = createMockUnit({ level: 1, cost: 1 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03JamilNeate096, discardFodder],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const handBefore = p1.getHand().length;

    expectSuccess(p1.assignPilot(gd03JamilNeate096, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getHand()).toHaveLength(handBefore - 1);
    expect(p1.getCardsInZone("trash")).toHaveLength(0);
  });
});

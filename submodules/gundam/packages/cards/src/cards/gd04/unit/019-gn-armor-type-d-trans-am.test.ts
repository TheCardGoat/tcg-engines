import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GnArmorTypeDTransAm019 } from "./019-gn-armor-type-d-trans-am.ts";

describe("GN Armor Type-D (Trans-Am) (GD04-019)", () => {
  it("<Breach 3> deals 3 damage to the enemy Base after destroying a Unit in battle", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const base = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04GnArmorTypeDTransAm019] },
      { play: [{ card: defender, exhausted: true }], baseSection: [base] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gnArmorId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.enterBattle(gnArmorId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(baseId)).toBe(3);
  });

  it("【Destroyed】adds a revealed Lv.5-or-lower CB Unit from the top 3 cards to hand", () => {
    const cbTutor = createMockUnit({
      name: "CB Tutor",
      level: 4,
      traits: ["cb"],
    });
    const filler1 = createMockUnit({ name: "Filler 1", traits: ["unrelated"] });
    const filler2 = createMockUnit({ name: "Filler 2", traits: ["unrelated"] });
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 5, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        play: [{ card: gd04GnArmorTypeDTransAm019, exhausted: true }],
        deck: [cbTutor, filler1, filler2],
      },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gnArmorId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, gnArmorId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const cbTutorId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          0: {
            tutorCardId: cbTutorId,
          },
        },
      }),
    );

    expect(p1.getCardsInZone("trash")).toContain(gnArmorId);
    expect(p1.getHand()).toContain(cbTutorId);
    expect(p1.getCardsInZone("deck")).toHaveLength(2);
  });

  it("does not tutor a high-level CB Unit, a CB Pilot, or a non-CB Unit", () => {
    const highLevelCbUnit = createMockUnit({
      name: "High-Level CB Unit",
      level: 6,
      traits: ["cb"],
    });
    const cbPilot = createMockPilot({ name: "CB Pilot", traits: ["cb"] });
    const nonCbUnit = createMockUnit({ name: "Non-CB Unit", level: 4, traits: ["academy"] });
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 5, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        play: [{ card: gd04GnArmorTypeDTransAm019, exhausted: true }],
        deck: [highLevelCbUnit, cbPilot, nonCbUnit],
      },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gnArmorId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, gnArmorId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toEqual([]);
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { 0: {} },
      }),
    );

    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardsInZone("deck")).toHaveLength(3);
  });
});

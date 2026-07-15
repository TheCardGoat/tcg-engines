import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01ZakuISniperType048 } from "./048-zaku-i-sniper-type.ts";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Zaku I Sniper Type (GD01-048)", () => {
  it("rests to give one other friendly Unit AP+1 with Support", () => {
    const firstAlly = createMockUnit({ ap: 2, hp: 4 });
    const secondAlly = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      play: [gd01ZakuISniperType048, firstAlly, secondAlly],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sniperId, firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(sniperId!, firstAllyId!));

    expect(p1.isExhausted(sniperId!)).toBe(true);
    expect(p1.getVisibleCard(firstAllyId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(secondAllyId!)?.effectiveAp).toBe(2);
  });

  it.each([
    ["Zeon", ["zeon"]],
    ["Neo Zeon", ["neo zeon"]],
  ])("reveals and adds a %s Unit from the top of the deck", (_label, traits) => {
    const eligible = createMockUnit({ name: `${_label} Unit`, traits });
    const engine = GundamTestEngine.create({
      hand: [gd01ZakuISniperType048],
      resourceArea: activeResources(2),
      deck: [eligible],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01ZakuISniperType048));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({ kind: "deckLook" });
    if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(1);
    expect(choice.legalTutorCardIds).toEqual(choice.revealedCardIds);
    const revealedId = choice.revealedCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: revealedId } },
      }),
    );

    expect(p1.getCardZone(revealedId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
  });

  it("shows no add-to-hand option for a non-Zeon Unit and returns the revealed card to the deck", () => {
    const academyUnit = createMockUnit({ traits: ["academy"] });
    const sentinel = createMockUnit({ name: "Untouched Sentinel" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ZakuISniperType048],
        resourceArea: activeResources(2),
        deck: [sentinel, academyUnit],
      },
      { deck: 2 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01ZakuISniperType048));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({ kind: "deckLook", legalTutorCardIds: [] });
    if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
    const revealedId = choice.revealedCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { toBottom: [revealedId] } },
      }),
    );

    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);

    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expect(p1.getBoardView().players[PLAYER_ONE]?.hand?.map((card) => card.definitionId)).toContain(
      sentinel.cardNumber,
    );
  });

  it("links with a Zeon Pilot and can attack on the turn it was deployed", () => {
    const zeonPilot = createMockPilot({ traits: ["zeon"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ZakuISniperType048, zeonPilot],
        deck: 2,
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.deployUnit(gd01ZakuISniperType048));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          [choice.directiveIndex]: { toBottom: choice.revealedCardIds },
        },
      }),
    );
    const sniperId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(zeonPilot, sniperId));

    expectSuccess(p1.enterBattle(sniperId, enemyId));
  });
});

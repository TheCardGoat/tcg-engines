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
import { gd01DuelGundamAssaultShroud045 } from "./045-duel-gundam-assault-shroud.ts";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Duel Gundam (Assault Shroud) (GD01-045)", () => {
  it("shows the top three cards, deploys the chosen eligible ZAFT Unit, and leaves the rest in deck", () => {
    const yzak = createMockPilot({ name: "Yzak Jule", level: 1, cost: 1 });
    const eligible = createMockUnit({ name: "Eligible ZAFT", traits: ["zaft"], level: 4 });
    const wrongTrait = createMockUnit({ name: "Wrong Trait", traits: ["academy"], level: 3 });
    const tooHigh = createMockUnit({ name: "Too High", traits: ["zaft"], level: 5 });
    const defender = createMockUnit({ hp: 7 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01DuelGundamAssaultShroud045, yzak],
        resourceArea: activeResources(5),
        deck: [wrongTrait, eligible, tooHigh, createMockUnit({ name: "Turn Draw" })],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [defender] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(defenderId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.deployUnit(gd01DuelGundamAssaultShroud045));
    const duelId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(yzak, duelId));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "deckLook",
      revealedCardIds: expect.any(Array),
      legalTutorCardIds: expect.any(Array),
    });
    if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const eligibleId = choice.legalTutorCardIds[0]!;

    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: eligibleId } },
      }),
    );

    expect(p1.getCardZone(eligibleId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    expectSuccess(p1.enterBattle(duelId, defenderId));
  });

  it("allows the player to decline an eligible deployment", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const eligible = createMockUnit({ traits: ["zaft"], level: 4 });
    const wrongTrait = createMockUnit({ traits: ["academy"], level: 4 });
    const tooHigh = createMockUnit({ traits: ["zaft"], level: 5 });
    const sentinel = createMockUnit({ name: "Untouched Sentinel" });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01DuelGundamAssaultShroud045],
        resourceArea: activeResources(1),
        deck: [sentinel, wrongTrait, tooHigh, eligible],
      },
      { deck: 2 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const duelId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, duelId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
    expect(choice.legalTutorCardIds).toHaveLength(1);
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);

    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expect(p1.getBoardView().players[PLAYER_ONE]?.hand?.map((card) => card.definitionId)).toContain(
      sentinel.cardNumber,
    );
  });

  it("shows no deploy option when the revealed cards fail the trait and level filters", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const wrongTrait = createMockUnit({ traits: ["academy"], level: 4 });
    const tooHigh = createMockUnit({ traits: ["zaft"], level: 5 });
    const wrongColor = createMockUnit({ traits: ["zeon"], level: 3 });
    const sentinel = createMockUnit({ name: "Untouched Sentinel" });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01DuelGundamAssaultShroud045],
        resourceArea: activeResources(1),
        deck: [sentinel, wrongTrait, tooHigh, wrongColor],
      },
      { deck: 2 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const duelId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, duelId));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "deckLook",
      legalTutorCardIds: [],
    });
    if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);

    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expect(p1.getBoardView().players[PLAYER_ONE]?.hand?.map((card) => card.definitionId)).toContain(
      sentinel.cardNumber,
    );
  });
});

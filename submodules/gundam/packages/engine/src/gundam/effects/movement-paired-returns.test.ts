import { describe, expect, it } from "vite-plus/test";
import type { CardEffect, EffectAction } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

function commandWith(action: EffectAction) {
  const effect: CardEffect = {
    type: "command",
    activation: { timing: ["main"] },
    directives: [{ action }],
    sourceText: "【Main】Resolve the movement test action.",
  };
  return createMockCommand({ level: 0, cost: 0, effects: [effect] });
}

function returnAction(action: "returnToHand" | "returnToDeck"): EffectAction {
  const target = {
    owner: "opponent" as const,
    zone: "battleArea" as const,
    cardType: "unit" as const,
    count: 1,
  };
  return action === "returnToHand" ? { action, target } : { action, position: "bottom", target };
}

function passMainTurn(engine: GundamTestEngine): void {
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p2.passPhase());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.passActionStep());
}

describe("paired cards follow Units that leave the battle area", () => {
  it("returns the paired Pilot to its owner's hand with the chosen Unit", () => {
    const returnCommand = commandWith(returnAction("returnToHand"));
    const unit = createMockUnit({ name: "Paired return target" });
    const pilot = createMockPilot({ name: "Following Pilot", level: 0, cost: 0 });
    const engine = GundamTestEngine.create(
      { hand: [returnCommand], deck: 3 },
      { hand: [pilot], play: [unit], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p2.getCardsInZone("battleArea")[0]!;
    const pilotId = p2.getHand()[0]!;

    expectSuccess(p2.assignPilot(pilotId, unitId));
    passMainTurn(engine);
    expectSuccess(p1.playCommand(returnCommand));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [unitId],
    });
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));

    expect(p2.getCardZone(unitId)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(pilotId)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardsInZone("battleArea")).toHaveLength(0);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("increases the owner's public Deck count by both paired cards", () => {
    const returnCommand = commandWith(returnAction("returnToDeck"));
    const unit = createMockUnit({ name: "Deck return target" });
    const pilot = createMockPilot({ name: "Deck-following Pilot", level: 0, cost: 0 });
    const engine = GundamTestEngine.create(
      { hand: [returnCommand], deck: 3 },
      { hand: [pilot], play: [unit], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p2.getCardsInZone("battleArea")[0]!;
    const pilotId = p2.getHand()[0]!;
    const deckBefore = p2.getBoardView().players[PLAYER_TWO]!.deckCount;

    expectSuccess(p2.assignPilot(pilotId, unitId));
    passMainTurn(engine);
    expectSuccess(p1.playCommand(returnCommand));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));

    expect(p2.getBoardView().players[PLAYER_TWO]!.deckCount).toBe(deckBefore + 2);
    expect(p2.getCardsInZone("battleArea")).toHaveLength(0);
    expect(p2.getHand()).toHaveLength(0);
  });

  it("removes a returned Unit token while its paired real Pilot stays in hand", () => {
    const deployToken = commandWith({
      action: "deployToken",
      token: {
        name: "Returnable Token",
        traits: ["test team"],
        ap: 1,
        hp: 1,
        deployState: "active",
      },
    });
    const returnCommand = commandWith(returnAction("returnToHand"));
    const pilot = createMockPilot({ name: "Token Pilot", level: 0, cost: 0 });
    const engine = GundamTestEngine.create(
      { hand: [returnCommand], deck: 3 },
      { hand: [deployToken, pilot], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p2.playCommand(deployToken));
    const tokenId = p2.getCardsInZone("battleArea")[0]!;
    const pilotId = p2.getHand()[0]!;
    expectSuccess(p2.assignPilot(pilotId, tokenId));
    passMainTurn(engine);
    expectSuccess(p1.playCommand(returnCommand));
    expectSuccess(p1.resolveEffect({ targets: [tokenId] }));

    expect(p2.getCardZone(tokenId)).toBeUndefined();
    expect(p2.getCardsInZone("hand")).not.toContain(tokenId);
    expect(p2.getCardsInZone("removalArea")).not.toContain(tokenId);
    expect(p2.getCardZone(pilotId)).toBe(`hand:${PLAYER_TWO}`);
  });
});

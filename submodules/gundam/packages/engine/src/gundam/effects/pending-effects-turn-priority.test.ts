import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../index.ts";

const optionalCommandObserver: CardEffect = {
  type: "triggered",
  activation: { timing: ["onCommandEffectActivated"] },
  directives: [{ optional: true, action: { action: "draw", count: 1 } }],
  sourceText: "When a Command effect activates, you may draw 1.",
};

describe("pending-effect priority follows the turn player", () => {
  it("offers the turn player's trigger before the opponent who played an Action Command", () => {
    const attacker = createMockUnit({
      name: "Turn-player observer",
      ap: 2,
      hp: 5,
      effects: [optionalCommandObserver],
    });
    const defender = createMockUnit({
      name: "Standby-player observer",
      ap: 1,
      hp: 5,
      effects: [optionalCommandObserver],
    });
    const actionCommand = createMockCommand({
      name: "Action Draw",
      level: 1,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["action"] },
          directives: [{ action: { action: "draw", count: 1 } }],
          sourceText: "【Action】Draw 1.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 5 },
      {
        hand: [actionCommand],
        play: [{ card: defender, exhausted: true }],
        resourceArea: activeResources(1),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p2.getHand()[0]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.playCommand(commandId));

    // The Action window belongs to P2, but P1 remains the turn player.
    // Rule 10-1-6-6 therefore offers P1's simultaneous trigger first.
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_ONE,
      sourceCardId: attackerId,
    });
    expect(p2.getBoardView().pendingChoice).toBeUndefined();

    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: defenderId,
    });
  });
});

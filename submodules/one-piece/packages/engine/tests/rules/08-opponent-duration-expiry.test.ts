import { getCard } from "@tcg/op-cards";
import type { Action } from "@tcg/op-types";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// OP01 FAQ (Mr.3/Galdino): an effect activated during the opponent's turn
// lasting until the end of their next turn ends in that same turn.
describe("opponent-turn duration creation", () => {
  test("Oinkchuck's battle-KO cost bonus expires at the end of that opponent turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB01-018"] },
      { character: [{ card: getCard("OP14-082"), rested: true }, "OP06-091"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attacker = engine.findCardInZone("south", "character", "EB01-018");
    const oink = engine.findCardInZone("north", "character", "OP14-082");
    const ally = engine.findCardInZone("north", "character", "OP06-091");
    const cost = () =>
      engine.getView("north").players.north.characters.find((c) => c?.instanceId === ally)?.cost;
    expect(cost()).toBe(1);
    engine.declareAttack(attacker, oink, "south");
    expect(engine.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(oink);
    expect(cost()).toBe(5);
    engine.endTurn("south");
    expect(cost()).toBe(1);
  });

  test.each(["untilEndOfOpponentNextTurn", "untilEndOfOpponentNextEndPhase"] as const)(
    "synthetic Counter modifiers expire this opponent turn: %s",
    (duration) => {
      // Synthetic Counter fixture isolates shared actions; it is not a claim
      // that Paradise Waterfall has these printed effects.
      const event = getCard("OP01-057");
      const original = event.effects;
      const target = { player: "self", zones: ["leader"], count: { amount: 1 } } as const;
      const actions: Action[] = [
        { action: "setBasePower", target: { ...target, zones: ["leader"] }, value: 7000, duration },
        { action: "modifyPower", target: { ...target, zones: ["leader"] }, value: 1000, duration },
      ];
      try {
        event.effects = { effects: [{ trigger: "counter", actions }] };
        const engine = OnePieceTestEngine.create(
          {},
          { hand: [event], activeDon: 1 },
          { firstPlayer: "north", activeSeat: "south" },
        );
        engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
        engine.resolveDecision(
          "battleCounter",
          { selectedIds: [engine.findCardInZone("north", "hand", event)] },
          "north",
        );
        expect(engine.getView("north").players.north.leader.power).toBe(8000);
        engine.endTurn("south");
        expect(engine.getView("north").players.north.leader.power).toBe(5000);
      } finally {
        event.effects = original;
      }
    },
  );

  test("a real Barrier Bulls bonus survives a synthetic extra own turn and ends after the opponent", () => {
    const event = getCard("OP01-059");
    const original = event.effects;
    try {
      event.effects = { effects: [{ trigger: "main", actions: [{ action: "extraTurn" }] }] };
      const engine = OnePieceTestEngine.create(
        { hand: [event, "OP15-019"], activeDon: 10 },
        {},
        { firstPlayer: "north", activeSeat: "south" },
      );
      engine.playCard(event, "south");
      engine.playCard("OP15-019", "south");
      expect(engine.getView("south").players.south.leader.power).toBe(6000);
      engine.endTurn("south");
      expect(engine.getState().activeSeat).toBe("south");
      expect(engine.getView("south").players.south.leader.power).toBe(6000);
      engine.endTurn("south");
      expect(engine.getState().activeSeat).toBe("north");
      expect(engine.getView("south").players.south.leader.power).toBe(6000);
      engine.endTurn("north");
      expect(engine.getView("south").players.south.leader.power).toBe(5000);
    } finally {
      event.effects = original;
    }
  });
});

import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

// No current catalog example is claimed. This synthetic native block tests
// CR 10-2-8 through public commands and restores the catalog after each case.
function withOpponentEndDraw(run: () => void) {
  const card = getCard("ST01-012");
  const original = card.effects;
  try {
    card.effects = {
      effects: [
        {
          trigger: "endOfOpponentTurn",
          optional: true,
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    };
    run();
  } finally {
    card.effects = original;
  }
}

test("10-2-8: own end does not trigger; opponent end resolves once before handoff after saved choice", () =>
  withOpponentEndDraw(() => {
    let engine = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        character: ["ST01-012"],
        deck: ["ST01-002", "ST01-003", "ST01-004", "ST01-005"],
      },
      { leaderCardId: "ST06-001", deck: ["ST06-009", "ST06-006", "ST06-007"] },
    );
    engine.asSouth().endTurn();
    expect(engine.getView("south").activeSeat).toBe("north");
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.asNorth().endTurn();
    expect(engine.getView("south").activeSeat).toBe("north");
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    const promptId = engine.pendingDecision("effectOptional", "south").id;
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    expect(engine.pendingDecision("effectOptional", "south").id).toBe(promptId);
    engine.asSouth().acceptOptional();
    // One effect draw, followed by exactly one normal Draw Phase draw.
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
      "ST01-002",
      "ST01-003",
    ]);
    expect(engine.getView("south").activeSeat).toBe("south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  }));

test("10-2-8: declining the optional opponent-end effect leaves only the normal turn draw", () =>
  withOpponentEndDraw(() => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        character: ["ST01-012"],
        deck: ["ST01-002", "ST01-003", "ST01-004"],
      },
      { leaderCardId: "ST06-001" },
      { activeSeat: "north" },
    );
    engine.asNorth().endTurn();
    expect(engine.getView("south").activeSeat).toBe("north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
      "ST01-002",
    ]);
    expect(engine.getView("south").activeSeat).toBe("south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  }));

test("10-2-8: a source negated for this turn does not trigger before negation expires", () =>
  withOpponentEndDraw(() => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        character: ["ST01-012"],
        deck: ["ST01-002", "ST01-003", "ST01-004"],
      },
      { leaderCardId: "OP09-081", hand: ["OP09-098"], activeDon: 4 },
      { activeSeat: "north" },
    );
    const source = engine.findCardInZone("south", "character", "ST01-012");
    engine.asNorth().play("OP09-098");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [source] }, "north");
    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === source),
    ).toBe(true);
    engine.asNorth().endTurn();
    expect(engine.getView("south").activeSeat).toBe("south");
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
      "ST01-002",
    ]);
  }));

import type { CardEffects, Target } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import {
  applyCommand,
  createMatch,
  OnePieceTestEngine,
  projectStateForSeat,
  ST01_MAIN_DECK,
  type EngineCommand,
} from "../../src/index.ts";

const leaderTarget: Target = {
  player: "self",
  self: true,
  zones: ["leader"],
  count: { amount: 1 },
};

// Synthetic native effects for CR 2-9-4; no current printed catalog example is claimed.
function withLifeEffects(effects: CardEffects, run: () => void, leaderId = "ST01-001") {
  const leader = getCard(leaderId);
  const original = leader.effects;
  try {
    leader.effects = effects;
    run();
  } finally {
    leader.effects = original;
  }
}

function completeSetup(southLeader = "ST01-001", northLeader = "OP01-001") {
  const mainDeck = (leader: string) => {
    if (leader !== "OP03-040" && leader !== "OP15-022") return [...ST01_MAIN_DECK];
    const prefix = leader === "OP03-040" ? "ST03" : "ST06";
    // Legal single-color fixture: twelve playsets and two copies of a thirteenth card.
    return Array.from({ length: 13 }, (_, index) =>
      Array.from(
        { length: index === 12 ? 2 : 4 },
        () => `${prefix}-${String(index + 2).padStart(3, "0")}`,
      ),
    ).flat();
  };
  let state = createMatch({
    firstPlayer: "south",
    shuffleDecks: false,
    players: {
      south: { leaderCardId: southLeader, mainDeck: mainDeck(southLeader) },
      north: { leaderCardId: northLeader, mainDeck: mainDeck(northLeader) },
    },
  });
  const commands: EngineCommand[] = [
    { type: "chooseJoKenPo", seat: "south", choice: "paper" },
    { type: "chooseJoKenPo", seat: "north", choice: "rock" },
    { type: "chooseFirstPlayer", seat: "south", firstPlayer: "south" },
    { type: "keepHand", seat: "south" },
    { type: "keepHand", seat: "north" },
    { type: "startGame", seat: "south" },
  ];
  for (const command of commands) {
    const result = applyCommand(state, command);
    expect(result.accepted, result.reason ?? undefined).toBe(true);
    state = result.state;
  }
  return state;
}

test("2-9-4 and 5-2-1-7: permanent Life value changes starting Life, preserving hidden order", () =>
  withLifeEffects(
    {
      permanentEffects: [
        {
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 2, duration: "permanent" },
          ],
        },
      ],
    },
    () => {
      const state = completeSetup();
      const view = projectStateForSeat(state, "spectator");
      expect(view.players.south.leader.lifeValue).toBe(7);
      expect(view.players.south.lifeCount).toBe(7);
      expect(view.players.north.lifeCount).toBe(5);
      expect(
        view.players.south.life.every(
          (card) => card.hidden && card.cardId === null && card.lifeValue === null,
        ),
      ).toBe(true);
      expect(view.players.south.deckCount).toBe(38);
      expect(
        projectStateForSeat(state, "judge").players.south.life.map((card) => card.cardId),
      ).toEqual(ST01_MAIN_DECK.slice(5, 12).toReversed());
      const printed = getCard("ST01-001");
      if (printed.cardType !== "leader") throw new Error("Expected Leader.");
      expect(printed.life).toBe(5);
    },
  ));

test("2-9-4: resolved Life value persists through save and damage without adding Life cards", () =>
  withLifeEffects(
    {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 2, duration: "permanent" },
          ],
        },
      ],
    },
    () => {
      let engine = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          life: ["ST01-002", "ST01-003"],
          deck: ["ST01-004", "ST01-005"],
        },
        { leaderCardId: "OP01-001", deck: ["ST01-016", "ST01-017"] },
      );
      engine.asSouth().activateMain(engine.leader("south"));
      expect(engine.getView("south").players.south.leader.lifeValue).toBe(7);
      expect(engine.getView("south").players.south.lifeCount).toBe(2);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.asSouth().endTurn();
      engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
      engine.resolveDecision("lifeTrigger", { optionId: "skip" }, "south");
      expect(engine.getView("south").players.south.lifeCount).toBe(1);
      expect(engine.getView("south").players.south.leader.lifeValue).toBe(7);
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
    },
  ));

test("2-9-4: expiry changes Life value alone, and Life-count conditions still count cards", () =>
  withLifeEffects(
    {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 2, duration: "thisTurn" },
            {
              action: "draw",
              player: "self",
              amount: 1,
              condition: { condition: "lifeCount", player: "self", comparison: "eq", value: 2 },
            },
          ],
        },
      ],
    },
    () => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          life: ["ST01-002", "ST01-003"],
          deck: ["ST01-004", "ST01-005"],
        },
        { leaderCardId: "OP01-001", deck: ["ST01-016", "ST01-017"] },
      );
      engine.asSouth().activateMain(engine.leader("south"));
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-004",
      ]);
      expect(engine.getView("south").players.south.leader.lifeValue).toBe(7);
      engine.asSouth().endTurn();
      expect(engine.getView("south").players.south.leader.lifeValue).toBe(5);
      expect(engine.getView("south").players.south.lifeCount).toBe(2);
    },
  ));

test("1-3-6: negative Life value displays zero but later arithmetic retains the negative amount", () =>
  withLifeEffects(
    {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: -8, duration: "thisTurn" },
            {
              action: "optional",
              actions: [
                { action: "modifyLifeValue", target: leaderTarget, value: 4, duration: "thisTurn" },
              ],
            },
          ],
        },
      ],
    },
    () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        life: ["ST01-002", "ST01-003"],
      });
      engine.asSouth().activateMain(engine.leader("south"));
      expect(engine.getView("south").players.south.leader.lifeValue).toBe(0);
      expect(engine.getView("south").players.south.lifeCount).toBe(2);
      engine.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
      expect(engine.getView("south").players.south.leader.lifeValue).toBe(1);
      expect(engine.getView("south").players.south.lifeCount).toBe(2);
      expect(engine.getView("south").status).toBe("active");
    },
  ));

test("5-2-1-7: starting Life snapshots its value before placement changes a permanent condition", () =>
  withLifeEffects(
    {
      permanentEffects: [
        {
          conditions: [{ condition: "lifeCount", player: "self", comparison: "eq", value: 0 }],
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 2, duration: "permanent" },
          ],
        },
      ],
    },
    () => {
      const state = completeSetup();
      const view = projectStateForSeat(state, "south");
      // Before placement the bonus gives seven. After the first card the predicate
      // stops matching, but it must not shrink this already-started placement.
      expect(view.players.south.lifeCount).toBe(7);
      expect(view.players.south.leader.lifeValue).toBe(5);
      expect(view.players.south.deckCount).toBe(38);
      expect(
        projectStateForSeat(state, "judge").players.south.life.map((card) => card.cardId),
      ).toEqual(ST01_MAIN_DECK.slice(5, 12).toReversed());
    },
  ));

test("2-9-4: negating a permanent source restores Life value without moving its Life cards", () =>
  withLifeEffects(
    {
      permanentEffects: [
        {
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 2, duration: "permanent" },
          ],
        },
      ],
    },
    () => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: ["EB01-005"], life: ["ST01-002", "ST01-003"] },
        { leaderCardId: "ST06-001", life: ["OP09-097", "ST06-009"] },
      );
      expect(engine.getView("south").players.south.leader.lifeValue).toBe(7);
      expect(engine.getView("south").players.south.characters[0]?.lifeValue).toBeNull();
      expect(
        engine.getView("north").players.south.life.every((card) => card.lifeValue === null),
      ).toBe(true);
      engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
      engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [engine.leader("south")] },
        "north",
      );
      expect(engine.getView("south").players.south.leader.lifeValue).toBe(5);
      expect(engine.getView("south").players.south.lifeCount).toBe(2);
      expect(engine.getView("judge").players.south.life.map((card) => card.cardId)).toEqual([
        "ST01-002",
        "ST01-003",
      ]);
    },
  ));

test("1-3-2 and 9-2-1: excessive starting Life places available cards then processes empty-deck defeat", () =>
  withLifeEffects(
    {
      permanentEffects: [
        {
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 100, duration: "permanent" },
          ],
        },
      ],
    },
    () => {
      const state = completeSetup();
      const view = projectStateForSeat(state, "south");
      expect(view.players.south.lifeCount).toBe(45);
      expect(view.players.south.deckCount).toBe(0);
      expect(view.players.north.lifeCount).toBe(5);
      expect(view).toMatchObject({
        status: "finished",
        finishReason: "emptyDeck",
        winner: "north",
      });
      expect(view.prompts).toHaveLength(0);
    },
  ));

test("9-2-1: simultaneous empty starting decks make both players lose without a seat-order winner", () =>
  withLifeEffects(
    {
      permanentEffects: [
        {
          actions: [
            {
              action: "modifyLifeValue",
              target: { player: "both", zones: ["leader"], count: { amount: "all" } },
              value: 100,
              duration: "permanent",
            },
          ],
        },
      ],
    },
    () => {
      const state = completeSetup();
      const view = projectStateForSeat(state, "spectator");
      expect(view.players.south.lifeCount).toBe(45);
      expect(view.players.north.lifeCount).toBe(45);
      expect(view.players.south.deckCount).toBe(0);
      expect(view.players.north.deckCount).toBe(0);
      expect(view).toMatchObject({ status: "finished", finishReason: "emptyDeck", winner: null });
      expect(view.logs.some((entry) => entry.message.includes("Both players lose"))).toBe(true);
    },
  ));

test("5-2-1-7: both starting quantities are captured before either player's Life changes", () =>
  withLifeEffects(
    {
      permanentEffects: [
        {
          conditions: [{ condition: "totalLifeCount", comparison: "eq", value: 0 }],
          actions: [
            {
              action: "modifyLifeValue",
              target: { player: "both", zones: ["leader"], count: { amount: "all" } },
              value: 2,
              duration: "permanent",
            },
          ],
        },
      ],
    },
    () => {
      const view = projectStateForSeat(completeSetup(), "spectator");
      expect(view.players.south.lifeCount).toBe(7);
      expect(view.players.north.lifeCount).toBe(7);
      expect(view.players.south.leader.lifeValue).toBe(5);
      expect(view.players.north.leader.lifeValue).toBe(5);
      expect(view.players.south.deckCount).toBe(38);
      expect(view.players.north.deckCount).toBe(38);
    },
  ));

// Keep the real Leaders' printed replacements; only the Life-value bonus is synthetic.
test("2-9-4 startup exhaustion preserves Nami's alternate win", () =>
  withLifeEffects(
    {
      ...getCard("OP03-040").effects,
      permanentEffects: [
        {
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 100, duration: "permanent" },
          ],
        },
      ],
    },
    () => {
      const view = projectStateForSeat(completeSetup("OP03-040"), "south");
      expect(view.players.south.lifeCount).toBe(45);
      expect(view).toMatchObject({
        status: "finished",
        finishReason: "effectWin",
        winner: "south",
      });
    },
    "OP03-040",
  ));

test("2-9-4 startup exhaustion preserves Brook's deferred defeat until turn end", () =>
  withLifeEffects(
    {
      ...getCard("OP15-022").effects,
      permanentEffects: [
        {
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 100, duration: "permanent" },
          ],
        },
      ],
    },
    () => {
      const engine = OnePieceTestEngine.fromState(completeSetup("OP15-022"));
      expect(engine.getView("south")).toMatchObject({
        status: "active",
        phase: "main",
        winner: null,
      });
      expect(engine.getView("south").players.south.deckCount).toBe(0);
      expect(engine.getView("south").players.south.lifeCount).toBe(45);
      engine.asSouth().endTurn();
      expect(engine.getView("south")).toMatchObject({
        status: "finished",
        finishReason: "emptyDeck",
        winner: "north",
      });
    },
    "OP15-022",
  ));

test("simultaneous startup alternate wins suspend and retain the saved first-turn continuation", () =>
  withLifeEffects(
    {
      ...getCard("OP03-040").effects,
      permanentEffects: [
        {
          actions: [
            { action: "modifyLifeValue", target: leaderTarget, value: 100, duration: "permanent" },
          ],
        },
      ],
    },
    () => {
      let engine = OnePieceTestEngine.fromState(completeSetup("OP03-040", "OP03-040"));
      expect(engine.getView("judge")).toMatchObject({
        status: "active",
        phase: "setup",
        winner: null,
      });
      const firstPrompt = engine.getView("judge").prompts[0];
      if (!firstPrompt) throw new Error("Expected simultaneous win review.");
      engine.exec({
        type: "judgeResolvePrompt",
        seat: "judge",
        promptId: firstPrompt.id,
        note: "No intervention yet.",
      });
      expect(engine.getView("judge").phase).toBe("setup");
      expect(engine.getView("judge").prompts).toHaveLength(1);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      for (const seat of ["south", "north"] as const) {
        const cardId = engine.getView("judge").players[seat].life[0]?.instanceId;
        if (!cardId) throw new Error("Expected a Life card for judge intervention.");
        engine.exec({
          type: "judgeMoveCard",
          seat: "judge",
          instanceId: cardId,
          owner: seat,
          zone: "deck",
          deckPosition: "top",
        });
        expect(engine.getView("judge").phase).toBe("setup");
      }
      const prompt = engine.getView("judge").prompts[0];
      if (!prompt) throw new Error("Expected saved startup review.");
      engine.exec({
        type: "judgeResolvePrompt",
        seat: "judge",
        promptId: prompt.id,
        note: "Both decks restored; continue the first turn.",
      });
      expect(engine.getView("south")).toMatchObject({
        status: "active",
        phase: "main",
        activeSeat: "south",
        winner: null,
      });
      expect(engine.getView("south").players.south.activeDon).toBe(1);
      expect(engine.getView("south").players.south.deckCount).toBe(1);
      expect(engine.getView("judge").prompts).toHaveLength(0);
    },
    "OP03-040",
  ));

import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const linn = getCard("ac-ac3-092");
const victim = getCard("ac-ac1-055");
function fixture() {
  const game = Spec.fromFixture({
    playerOne: { hand: [linn], resource: [linn, linn, linn] },
    playerTwo: { clash: [victim], deck: [victim, victim] },
  });
  const targetId = game.playerTwo.at(victim, "clash").instanceId;
  game.playerOne.play(linn);
  while (game.state.responseWindow && !game.state.pendingChoices.length)
    game.asPlayer(game.state.responseWindow.openFor).passRound();
  return {
    targetId,
    engine: new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" }),
  };
}
function submit(
  engine: AlphaClashServerEngine,
  values: { selection?: string[]; confirm?: boolean },
) {
  const view = engine.getInteractionView("p1");
  const action = view.actions.find((action) => action.id.startsWith("resolveChoice:"));
  if (!action) throw new Error("Missing trigger choice");
  const result = engine.submitInteraction(
    "p1",
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    },
    { gameId: "trigger-targets", sourceAuthority: "server" },
  );
  return { action, result };
}

it("projects LINN's declared opponent as a player and requires that selection", () => {
  const { engine } = fixture();
  const before = structuredClone(engine.state);
  const rejected = submit(engine, { selection: [] });
  expect(rejected.action.inputs[0]).toMatchObject({
    required: true,
    min: 1,
    candidates: [{ entity: { kind: "player", instanceId: "player-two" } }],
  });
  expect(rejected.result.success).toBe(false);
  expect(engine.state).toEqual(before);
  expect(submit(engine, { selection: ["player-two"] }).result.success).toBe(true);
  expect(engine.state.deckOrder["player-two"]).toHaveLength(2);
});

it("submits an empty optional target without losing LINN's mandatory diminish", () => {
  const { engine } = fixture();
  expect(submit(engine, { selection: ["player-two"] }).result.success).toBe(true);
  const skipped = submit(engine, { selection: [] });
  expect(skipped.action.inputs[0]).toMatchObject({
    required: false,
    min: 0,
    max: 1,
    confirmBeforeSubmit: true,
  });
  expect(skipped.result.success).toBe(true);
  expect(engine.state.deckOrder["player-two"]).toHaveLength(1);
  expect(engine.state.pendingChoices).toHaveLength(0);
});

it("declares LINN's Bounty target and separately accepts its optional resolution", () => {
  const { engine, targetId } = fixture();
  expect(submit(engine, { selection: ["player-two"] }).result.success).toBe(true);
  expect(submit(engine, { selection: [targetId] }).result.success).toBe(true);
  expect(engine.state.cards[targetId].counters.bounty ?? 0).toBe(0);
  expect(submit(engine, { confirm: true }).result.success).toBe(true);
  expect(engine.state.cards[targetId].counters.bounty).toBe(1);
});

it.each([false, true])(
  "Death declares its recovery target before the optional resolution (accept: %s)",
  (accept) => {
    const death = getCard("ac-ac2-010");
    const recovered = getCard("ac-ac4-008");
    const game = Spec.fromFixture({
      activePlayer: "player-two",
      portalOpen: true,
      playerOne: { clash: [death], oblivion: [recovered], deck: [victim] },
    });
    const id = game.playerOne.at(recovered, "oblivion").instanceId;
    game.playerTwo.endTurn();
    const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
    expect(submit(engine, { selection: [id] }).result.success).toBe(true);
    expect(engine.state.cards[id].zone).toBe("oblivion");
    expect(submit(engine, { confirm: accept }).result.success).toBe(true);
    expect(engine.state.cards[id].zone).toBe(accept ? "clash" : "oblivion");
    expect(engine.state.pendingChoices).toHaveLength(0);
  },
);

it.each([false, true])(
  "Beginning preserves its optional first slot through Accessory declaration (Clash selected: %s)",
  (selectClash) => {
    const beginning = getCard("ac-ac7-171");
    const weapon = getCard("ac-ac1-016");
    const g = Spec.fromFixture({
      activePlayer: "player-two",
      playerOne: { clashground: [beginning], accessory: [weapon], deck: [victim] },
      playerTwo: { clash: [victim] },
    });
    const clash = g.playerTwo.at(victim, "clash").instanceId;
    const accessory = g.playerOne.at(weapon, "accessory").instanceId;
    g.playerTwo.endTurn();
    const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    expect(submit(engine, { selection: selectClash ? [clash] : [] }).result.success).toBe(true);
    expect(engine.state.cards[accessory].zone).toBe("accessory");
    expect(submit(engine, { selection: [accessory] }).result.success).toBe(true);
    expect(engine.state.cards[clash].zone).toBe(selectClash ? "oblivion" : "clash");
    expect(engine.state.cards[accessory].zone).toBe("oblivion");
    expect(engine.state.players["player-one"].health).toBe(selectClash ? 30 : 28);
  },
);

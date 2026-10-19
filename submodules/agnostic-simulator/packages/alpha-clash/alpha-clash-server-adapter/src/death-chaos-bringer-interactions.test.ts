import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const death = getCard("ac-ac2-001"),
  lost = getCard("ac-ac4-008"),
  body = getCard("ac-ac3-007"),
  filler = getCard("ac-ac2-025");
const context = { gameId: "chaos-bringer-audit", sourceAuthority: "server" as const };
const send = action({
  id: "adapter-chaos-send",
  name: "Send",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [{ type: "sendToOblivion", target: { type: "card", zones: ["clash"], chosen: true } }],
});
function submit(
  engine: AlphaClashServerEngine,
  values: InteractionSubmission["values"],
  id?: string,
) {
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => (id ? a.id === id : a.id.startsWith("resolveChoice:")));
  if (!action) throw Error("Expected action");
  return engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action, values }),
    context,
  );
}
it.each([
  { select: true, accept: true },
  { select: false, accept: true },
  { select: true, accept: false },
  { select: false, accept: false },
])(
  "Chaos Bringer declares its target before confirming engagement (select $select, accept $accept)",
  ({ select, accept }) => {
    const g = Spec.fromFixture({
      definitions: [send],
      playerOne: { contender: death, clash: [lost, body, body], hand: [send], deck: [filler] },
    });
    const ids = g.playerOne.instances(body).map((c) => c.instanceId);
    g.playerOne.play(send, lost);
    for (let n = 0; n < 20 && g.state.responseWindow && !g.state.pendingChoices.length; n++)
      g.asPlayer(g.state.responseWindow.openFor).passRound();
    let engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const declaration = engine
      .getInteractionView("p1")
      .actions.find((a) => a.id.startsWith("resolveChoice:"));
    expect(declaration?.inputs[0]).toMatchObject({ kind: "entity-selection", min: 0, max: 1 });
    expect(submit(engine, { selection: select ? [ids[1]] : [] }).success).toBe(true);
    expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(0);
    engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    expect(submit(engine, { confirm: accept }).success).toBe(true);
    const saved = Spec.fromState(engine.state);
    expect(saved.playerOne.handCount()).toBe(accept ? 1 : 0);
    expect(saved.playerOne.ready(death)).toBe(!accept);
    expect(saved.atk(saved.state.cards[ids[0]])).toBe(2);
    expect(saved.atk(saved.state.cards[ids[1]])).toBe(select && accept ? 3 : 2);
    expect(engine.state.pendingChoices).toHaveLength(0);
  },
);
it("Chaos Bringer recovers the second same-name target through an interaction and preserves its end-turn banish", () => {
  const g = Spec.fromFixture({
      playerOne: { contender: death, health: 10, oblivion: [body, body] },
    }),
    ids = g.playerOne.instances(body).map((c) => c.instanceId),
    source = g.playerOne.contender().instanceId;
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  expect(submit(engine, { targetId: [ids[1]] }, `activateAbility:${source}:2`).success).toBe(true);
  expect(engine.state.cards[ids[0]].zone).toBe("oblivion");
  expect(engine.state.cards[ids[1]].zone).toBe("clash");
  const saved = Spec.fromState(JSON.parse(JSON.stringify(engine.state)));
  saved.playerOne.endTurn();
  expect(saved.state.cards[ids[1]].zone).toBe("banished");
  expect(saved.state.cards[ids[0]].zone).toBe("oblivion");
});

import { expect, it } from "vite-plus/test";
import { clashCard, contender, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const kili = getCard("ac-ac4-001"),
  mayhem = getCard("ac-ac2-034"),
  black = getCard("ac-ac4-008"),
  green = getCard("ac-ac2-025");
const body = clashCard({
  id: "adapter-mayhem-body",
  name: "Body",
  affiliation: "alpha",
  colors: [],
  cost: { total: 0 },
  attack: 4,
  defense: 6,
});
const defender = contender({
  id: "adapter-kili-defender",
  name: "Defender",
  colors: [],
  health: 30,
  attack: 0,
  defense: 0,
});
const seats = { p1: "player-one", p2: "player-two" } as const;
function settle(g: Spec) {
  for (let n = 0; n < 30 && g.state.responseWindow && !g.state.pendingChoices.length; n++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
function submit(engine: AlphaClashServerEngine, values: InteractionSubmission["values"]) {
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!action) throw Error("Missing choice");
  return engine.submitInteraction("p1", buildInteractionSubmission({ view, action, values }), {
    gameId: "kili-mayhem-audit",
    sourceAuthority: "server",
  });
}
it.each([true, false])(
  "Kilimanjaro submits its optional attack draw (%s), preserving the chosen discard copy through JSON",
  (accept) => {
    const g = Spec.fromFixture({
        definitions: [defender],
        playerOne: { contender: kili, hand: [black], deck: [black, green] },
        playerTwo: { contender: defender },
      }),
      original = g.playerOne.at(black, "hand").instanceId;
    g.playerOne.attack(g.playerOne.contender(), g.playerTwo.contender());
    settle(g);
    let engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
    expect(submit(engine, { confirm: accept }).success).toBe(true);
    if (accept) {
      const fresh = Object.values(engine.state.cards).find(
        (c) => c.zone === "hand" && c.definitionId === black.id && c.instanceId !== original,
      )!;
      expect(engine.state.pendingChoices[0]).toHaveProperty("discard");
      engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), seats);
      expect(submit(engine, { selection: [fresh.instanceId] }).success).toBe(true);
      expect(engine.state.cards[fresh.instanceId].zone).toBe("oblivion");
    }
    expect(engine.state.cards[original].zone).toBe("hand");
    const saved = Spec.fromState(engine.state);
    // The server automatically passes the remaining empty windows and completes this clash.
    expect(saved.state.clash).toBeNull();
    expect(saved.playerTwo.health()).toBe(accept ? 28 : 29);
    expect(saved.playerOne.atk(saved.playerOne.contender())).toBe(1);
    expect(engine.state.pendingChoices).toHaveLength(0);
  },
);
it("Mayhem Maker's saved declaration selects the exact duplicate and draws once", () => {
  const g = Spec.fromFixture({
      definitions: [body],
      playerOne: { hand: [mayhem], resource: [green, green] },
      playerTwo: { clash: [body, body] },
    }),
    ids = g.playerTwo.instances(body).map((c) => c.instanceId);
  g.playerOne.play(mayhem);
  settle(g);
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  expect(submit(engine, { selection: [ids[1]] }).success).toBe(true);
  const saved = Spec.fromState(engine.state);
  expect(saved.atk(saved.state.cards[ids[1]])).toBe(3);
  expect(saved.atk(saved.state.cards[ids[0]])).toBe(4);
  expect(saved.playerOne.handCount()).toBe(1);
});
it("Mayhem Maker's submitted target invalidated by an earlier trigger cancels its draw", () => {
  const exiler = clashCard({
    ...body,
    affiliation: "alpha",
    id: "adapter-mayhem-exiler",
    name: "Exiler",
    abilities: [
      {
        kind: "triggered",
        text: "Banish Body",
        trigger: { event: "enterPlay" },
        observer: { controller: "friendly", characterName: "Pestilence" },
        effects: [
          {
            type: "banish",
            target: {
              type: "card",
              controller: "opponent",
              zones: ["clash"],
              exactNames: [body.name],
            },
          },
        ],
      },
    ],
  });
  const g = Spec.fromFixture({
      definitions: [body, exiler],
      playerOne: { hand: [mayhem], clash: [exiler], resource: [green, green] },
      playerTwo: { clash: [body] },
    }),
    id = g.playerTwo.at(body, "clash").instanceId;
  g.playerOne.play(mayhem);
  settle(g);
  const c = g.state.pendingChoices[0];
  if (c.kind !== "modal" || !c.triggerOrder) throw Error("Expected order");
  const first = c.triggerOrder.batch.find(
    (t) => t.sourceId === g.playerOne.at(exiler, "clash").instanceId,
  )!;
  g.run({
    type: "resolveChoice",
    playerId: c.playerId,
    choiceId: c.id,
    orderedIds: [
      first.id,
      ...c.triggerOrder.batch.filter((t) => t.id !== first.id).map((t) => t.id),
    ],
  });
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  expect(submit(engine, { selection: [id] }).success).toBe(true);
  expect(engine.state.cards[id].zone).toBe("banished");
  expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(0);
});

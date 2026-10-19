import { expect, it } from "vite-plus/test";
import { clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const pest = getCard("ac-db1-054"),
  green = getCard("ac-ac2-025");
const body = clashCard({
  id: "adapter-infectious-body",
  name: "Body",
  affiliation: "alpha",
  colors: [],
  cost: { total: 0 },
  attack: 4,
  defense: 6,
});
function submit(engine: AlphaClashServerEngine, values: InteractionSubmission["values"]) {
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!action) throw Error("Missing choice");
  return engine.submitInteraction("p1", buildInteractionSubmission({ view, action, values }), {
    gameId: "infectious-audit",
    sourceAuthority: "server",
  });
}
function settle(g: Spec) {
  for (let n = 0; n < 30 && g.state.responseWindow && !g.state.pendingChoices.length; n++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
it.each([false, true])(
  "Pestilence declares the exact debuff target and preserves the %s-Portal discard through saves",
  (open) => {
    const g = Spec.fromFixture({
        definitions: [body],
        portalOpen: open,
        playerOne: { hand: [pest, green, green], resource: [green] },
        playerTwo: { clash: [body, body] },
      }),
      ids = g.playerTwo.instances(body).map((c) => c.instanceId),
      discards = g.playerOne
        .instances(green)
        .filter((c) => c.zone === "hand")
        .map((c) => c.instanceId);
    g.playerOne.play(pest);
    settle(g);
    let engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    expect(submit(engine, { selection: [ids[1]] }).success).toBe(true);
    const projected = Spec.fromState(engine.state);
    expect(projected.atk(engine.state.cards[ids[1]])).toBe(2);
    expect(projected.atk(engine.state.cards[ids[0]])).toBe(4);
    if (open) {
      expect(engine.state.pendingChoices).toHaveLength(0);
      expect(projected.playerOne.handCount()).toBe(2);
    } else {
      expect(engine.state.pendingChoices[0]).toMatchObject({ discard: expect.any(Object) });
      engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
        p1: "player-one",
        p2: "player-two",
      });
      expect(submit(engine, { selection: [discards[1]] }).success).toBe(true);
      expect(engine.state.cards[discards[0]].zone).toBe("hand");
      expect(engine.state.cards[discards[1]].zone).toBe("oblivion");
      expect(engine.state.pendingChoices).toHaveLength(0);
    }
  },
);
it("Pestilence does not expose a discard after its submitted target is removed by an earlier trigger", () => {
  const exiler = clashCard({
    ...body,
    id: "adapter-infectious-exiler",
    name: "Exiler",
    affiliation: "alpha",
    abilities: [
      {
        kind: "triggered",
        text: "Banish Body on entry",
        trigger: { event: "enterPlay" },
        observer: { controller: "friendly", characterName: "Pestilence" },
        effects: [
          {
            type: "banish",
            target: {
              type: "card",
              controller: "opponent",
              zones: ["clash"],
              exactNames: ["Body"],
            },
          },
        ],
      },
    ],
  });
  const g = Spec.fromFixture({
      definitions: [body, exiler],
      playerOne: { clash: [exiler], hand: [pest, green], resource: [green] },
      playerTwo: { clash: [body] },
    }),
    id = g.playerTwo.at(body, "clash").instanceId;
  g.playerOne.play(pest);
  settle(g);
  const c = g.state.pendingChoices[0];
  if (c.kind !== "modal" || !c.triggerOrder) throw Error("Missing order");
  const source = g.playerOne.at(exiler, "clash").instanceId;
  const first = c.triggerOrder.batch.find((t) => t.sourceId === source)!;
  g.run({
    type: "resolveChoice",
    playerId: c.playerId,
    choiceId: c.id,
    orderedIds: [
      first.id,
      ...c.triggerOrder.batch.filter((t) => t.id !== first.id).map((t) => t.id),
    ],
  });
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  expect(submit(engine, { selection: [id] }).success).toBe(true);
  expect(engine.state.cards[id].zone).toBe("banished");
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(1);
});

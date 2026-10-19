import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const voice = getCard("ac-ac7-001"),
  shadow = getCard("ac-ac7-016"),
  host = getCard("ac-ac7-015"),
  black = getCard("ac-ac4-008"),
  seats = { p1: "player-one", p2: "player-two" } as const;
const banish = action({
  id: "adapter-voice-banish",
  name: "Banish",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [
    {
      type: "banish",
      target: { type: "card", zones: ["oblivion"], controller: "friendly", chosen: true },
    },
  ],
});
function settle(g: Spec) {
  while (g.state.responseWindow && !g.state.pendingChoices.length)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
function fixture(health = 18, withVoice = true) {
  const g = Spec.fromFixture({
      definitions: [banish],
      playerOne: {
        ...(withVoice ? { contender: voice } : {}),
        health,
        hand: [banish, banish],
        oblivion: [shadow, shadow],
        resource: [black, black],
      },
    }),
    ids = g.playerOne.instances(shadow).map((c) => c.instanceId);
  for (const id of ids) {
    g.playerOne.play(
      g.playerOne.instances(banish).find((c) => c.zone === "hand")!,
      g.state.cards[id],
    );
    settle(g);
  }
  return { g, ids };
}
function submit(e: AlphaClashServerEngine, values: InteractionSubmission["values"], id?: string) {
  const view = e.getInteractionView("p1"),
    a = view.actions.find((a) => (id ? a.id === id : a.id.startsWith("resolveChoice:")));
  if (!a) throw Error("Missing action " + id);
  return e.submitInteraction("p1", buildInteractionSubmission({ view, action: a, values }), {
    gameId: "voice-audit",
    sourceAuthority: "server",
  });
}
it("Voice exposes an eligible banished card, accepts manual payment, and consumes the one-per-turn Action", () => {
  const { g, ids } = fixture(),
    resources = g.playerOne.instances(black).map((c) => c.instanceId);
  let e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  const actions = e.getInteractionView("p1").actions;
  expect(actions.find((a) => a.id === `playCard:${ids[1]}`)?.enabled).toBe(true);
  const result = submit(
    e,
    { resourcePayment: [JSON.stringify([resources[1], "black"])] },
    `playCard:${ids[1]}`,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(e.state.cards[ids[1]].zone).toBe("clash");
  expect(e.state.players["player-one"].health).toBe(18);
  expect(e.state.cards[resources[1]].ready).toBe(false);
  expect(e.state.cards[resources[0]].ready).toBe(true);
  e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
  expect(
    e.getInteractionView("p1").actions.some((a) => a.id === `playCard:${ids[0]}` && a.enabled),
  ).toBe(false);
});
it.each(["health", "contender"])(
  "Voice does not offer a banished play without its active permission (%s)",
  (reason) => {
    const { g, ids } = fixture(reason === "health" ? 19 : 18, reason !== "contender"),
      e = new AlphaClashServerEngine(g.state, seats);
    expect(
      e
        .getInteractionView("p1")
        .actions.some((a) => ids.some((id) => a.id === `playCard:${id}`) && a.enabled),
    ).toBe(false);
  },
);
it("Voice's declared Portal target preserves a duplicate identity through saved interaction", () => {
  const g = Spec.fromFixture({
      playerOne: { contender: voice, clash: [host, host], resource: [black, black] },
    }),
    ids = g.playerOne.instances(host).map((c) => c.instanceId);
  g.playerOne.activatePortal();
  settle(g);
  const e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  expect(submit(e, { selection: [ids[1]] }).success).toBe(true);
  const result = Spec.fromState(e.state);
  expect(result.atk(e.state.cards[ids[1]])).toBe(4);
  expect(result.atk(e.state.cards[ids[0]])).toBe(3);
});

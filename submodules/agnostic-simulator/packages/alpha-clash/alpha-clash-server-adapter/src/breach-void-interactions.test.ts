import { expect, it } from "vite-plus/test";
import { action, clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { effectiveKeywords } from "@tcg/alpha-clash-engine";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const breach = getCard("ac-ac7-004"),
  black = getCard("ac-ac4-008"),
  relic = getCard("ac-ac7-186");
const body = clashCard({
  id: "adapter-breach-body",
  name: "Body",
  affiliation: "alpha",
  colors: [],
  cost: { total: 0 },
  attack: 0,
  defense: 8,
});
const banish = action({
  id: "adapter-breach-banish",
  name: "Banish",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [{ type: "banish", target: { type: "card", zones: ["oblivion"], chosen: true } }],
});
const seats = { p1: "player-one", p2: "player-two" } as const;
function submit(
  engine: AlphaClashServerEngine,
  values: InteractionSubmission["values"],
  id?: string,
) {
  const view = engine.getInteractionView("p1"),
    a = view.actions.find((a) => (id ? a.id === id : a.id.startsWith("resolveChoice:")));
  if (!a) throw Error("Missing action " + id);
  return engine.submitInteraction("p1", buildInteractionSubmission({ view, action: a, values }), {
    gameId: "breach-void-audit",
    sourceAuthority: "server",
  });
}
it.each([false, true])(
  "Breach selects a duplicate Accessory with manual black payment and resumes its optional draw (%s)",
  (accept) => {
    const g = Spec.fromFixture({
      definitions: [body, banish],
      playerOne: {
        hand: [banish, breach],
        clash: [body],
        accessory: [relic, relic],
        oblivion: [body],
        resource: [black],
      },
    });
    g.playerOne.play(banish, g.playerOne.at(body, "oblivion"));
    while (g.state.responseWindow) g.asPlayer(g.state.responseWindow.openFor).passRound();
    g.playerOne.attack(g.playerOne.at(body, "clash"), g.playerTwo.contender());
    g.playerTwo.passRound();
    g.playerTwo.passRound();
    const ids = g.playerOne.instances(relic).map((c) => c.instanceId),
      source = g.playerOne.at(breach, "hand").instanceId,
      resource = g.playerOne.at(black, "resource").instanceId;
    let engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
    const input = engine
      .getInteractionView("p1")
      .actions.find((a) => a.id === `playCard:${source}`)
      ?.inputs.find((i) => i.id === "targetId");
    if (input?.kind !== "entity-selection") throw Error("Expected target selection");
    expect(input.candidates.map((c) => c.entity.instanceId)).toEqual(expect.arrayContaining(ids));
    const before = structuredClone(engine.state),
      bad = submit(
        engine,
        { targetId: [resource], resourcePayment: [JSON.stringify([resource, "black"])] },
        `playCard:${source}`,
      );
    expect(bad.success).toBe(false);
    expect(engine.state).toEqual(before);
    const played = submit(
      engine,
      { targetId: [ids[1]], resourcePayment: [JSON.stringify([resource, "black"])] },
      `playCard:${source}`,
    );
    expect(played.success, JSON.stringify(played)).toBe(true);
    engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), seats);
    const result = submit(engine, { confirm: accept });
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(effectiveKeywords(engine.state, ids[1])).toContain("undisputed");
    expect(effectiveKeywords(engine.state, ids[0])).not.toContain("undisputed");
    expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(accept ? 1 : 0);
    expect(engine.state.cards[resource].ready).toBe(false);
  },
);

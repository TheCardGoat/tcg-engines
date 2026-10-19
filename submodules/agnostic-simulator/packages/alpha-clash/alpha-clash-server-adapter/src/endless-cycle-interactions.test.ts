import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const endless = getCard("ac-ac8-181"),
  body = getCard("ac-ac3-007"),
  filler = getCard("ac-ac4-113"),
  context = { gameId: "endless-audit", sourceAuthority: "server" as const };
it.each([false, true])(
  "Endless Cycle declares four exact targets and the chosen payment route (Manifest: %s)",
  (manifest) => {
    const g = Spec.fromFixture({
        playerOne: {
          hand: [endless],
          resource: [body, body],
          oblivion: [body, body],
          deck: [filler, filler, filler, filler, filler],
        },
        playerTwo: { oblivion: [body, body] },
      }),
      source = g.playerOne.hand(endless).instanceId,
      ids = Object.values(g.state.cards)
        .filter((c) => c.zone === "oblivion" && c.definitionId === body.id)
        .map((c) => c.instanceId),
      payment = g.playerOne
        .instances(body)
        .filter((c) => c.zone === "resource")
        .map((c) => JSON.stringify([c.instanceId, "black"]));
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
        p1: "player-one",
        p2: "player-two",
      }),
      view = engine.getInteractionView("p1"),
      choice = view.actions.find((a) => a.id === `playCard:${source}`);
    if (!choice) throw Error("Missing Endless play");
    expect(choice.inputs.find((i) => i.id === "targetIds")).toMatchObject({ min: 4, max: 4 });
    const values = {
      manifestRoute: [manifest ? "manifest" : "normal"],
      targetIds: ids,
      ...(!manifest ? { resourcePayment: payment } : {}),
    };
    const before = structuredClone(engine.state);
    expect(
      engine.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action: choice,
          values: { ...values, targetIds: ids.slice(1) },
        }),
        context,
      ).success,
    ).toBe(false);
    expect(engine.state).toEqual(before);
    const result = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action: choice, values }),
      context,
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    for (const id of ids) {
      expect(engine.state.cards[id].zone).toBe("deck");
      expect(engine.state.deckOrder[engine.state.cards[id].owner]).toContain(id);
    }
    expect(engine.state.manifestedThisTurn["player-one"]).toBe(manifest);
    expect(
      g.playerOne
        .instances(body)
        .filter((c) => c.zone === "resource")
        .every((c) => engine.state.cards[c.instanceId].ready === manifest),
    ).toBe(true);
  },
);
it("a saved response removing one Endless target cancels the other three shuffles through the adapter", () => {
  const response = action({
    id: "adapter-endless-banish",
    name: "Response",
    colors: [],
    cost: { total: 0 },
    subtype: "quick",
    counterTags: ["counter-play"],
    effects: [{ type: "banish", target: { type: "card", zones: ["oblivion"], chosen: true } }],
  });
  const g = Spec.fromFixture({
      definitions: [response],
      playerOne: { hand: [endless], resource: [body, body], oblivion: [body, body] },
      playerTwo: { oblivion: [body, body], hand: [response] },
    }),
    ids = Object.values(g.state.cards)
      .filter((c) => c.zone === "oblivion" && c.definitionId === body.id)
      .map((c) => c.instanceId);
  g.run({
    type: "playCard",
    playerId: "player-one",
    cardId: g.playerOne.hand(endless).instanceId,
    targetId: ids[0],
    targetIds: ids.slice(1),
  });
  g.playerTwo.respond(response, g.state.cards[ids[0]]);
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  for (let n = 0; n < 20 && engine.state.responseWindow; n++) {
    const actor = engine.state.responseWindow.openFor === "player-one" ? "p1" : "p2";
    expect(engine.dispatch("pass", actor, {}, context).success).toBe(true);
  }
  expect(engine.state.responseWindow).toBeNull();
  for (const id of ids)
    expect(engine.state.cards[id].zone).toBe(id === ids[0] ? "banished" : "oblivion");
  expect(engine.state.moveLog.some((l) => l.type === "effect.shuffle")).toBe(false);
});

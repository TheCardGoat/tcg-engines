import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const surge = getCard("ac-ac7-200"),
  shadow = getCard("ac-ac7-016"),
  black = getCard("ac-ac4-008"),
  seats = { p1: "player-one", p2: "player-two" } as const;
function submit(
  e: AlphaClashServerEngine,
  seat: "p1" | "p2",
  values: InteractionSubmission["values"],
  id?: string,
) {
  const view = e.getInteractionView(seat),
    a = view.actions.find((a) => (id ? a.id === id : a.id.startsWith("resolveChoice:")));
  if (!a) throw Error("Missing action " + id);
  return e.submitInteraction(seat, buildInteractionSubmission({ view, action: a, values }), {
    gameId: "surge-audit",
    sourceAuthority: "server",
  });
}
function fixture() {
  const g = Spec.fromFixture({
    playerOne: { clashground: [surge] },
    playerTwo: { hand: [black, black], deck: [shadow], resource: [{ card: black, ready: false }] },
  });
  const ids = g.playerTwo
    .instances(black)
    .filter((c) => c.zone === "hand")
    .map((c) => c.instanceId);
  g.playerOne.endTurn();
  return { g, ids };
}
it.each([false, true])(
  "Surge exposes the active opponent's health or hand-banish penalty (banish %s)",
  (banishing) => {
    const { g, ids } = fixture();
    let e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
    const choice = e.state.pendingChoices[0];
    if (choice.kind !== "modal") throw Error("Expected penalty modes");
    const mode = choice.options.find((o) => o.label.startsWith(banishing ? "Banish" : "Lose"));
    if (!mode) throw Error("Missing mode");
    expect(submit(e, "p2", { selection: [mode.id] }).success).toBe(true);
    if (banishing) {
      e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
      const input = e
        .getInteractionView("p2")
        .actions.find((a) => a.id.startsWith("resolveChoice:"))
        ?.inputs.find((i) => i.id === "selection");
      if (input?.kind !== "option-selection") throw Error("Expected hand selection");
      expect(input.options.map((o) => o.entity?.instanceId)).toEqual(ids);
      const chosen = input.options.find((o) => o.entity?.instanceId === ids[1]);
      if (!chosen) throw Error("Missing second copy");
      const result = submit(e, "p2", { selection: [chosen.id] });
      expect(result.success, JSON.stringify(result)).toBe(true);
    }
    expect(e.state.cards[ids[0]].zone).toBe("hand");
    expect(e.state.cards[ids[1]].zone).toBe(banishing ? "banished" : "hand");
    expect(e.state.players["player-two"].health).toBe(banishing ? 25 : 24);
    expect(e.state.pendingChoices).toHaveLength(0);
  },
);
it("Surge's saved Void discount is reflected in the simulator resource quote and manual payment", () => {
  const banish = action({
    id: "adapter-surge-banish",
    name: "Banish",
    colors: [],
    cost: { total: 0 },
    subtype: "basic",
    effects: [{ type: "banish", target: { type: "card", zones: ["oblivion"], chosen: true } }],
  });
  const host = getCard("ac-ac7-015");
  const g = Spec.fromFixture({
    definitions: [banish],
    playerOne: { hand: [banish, host], oblivion: [surge], resource: [black, black, black, black] },
  });
  g.playerOne.play(banish, g.playerOne.at(surge, "oblivion"));
  while (g.state.responseWindow && !g.state.pendingChoices.length)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  const id = g.playerOne.at(host, "hand").instanceId,
    resources = g.playerOne.instances(black).map((c) => c.instanceId),
    e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  const result = submit(
    e,
    "p1",
    { resourcePayment: resources.slice(1).map((id) => JSON.stringify([id, "black"])) },
    `playCard:${id}`,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(e.state.cards[id].zone).toBe("clash");
  expect(e.state.cards[resources[0]].ready).toBe(true);
  expect(e.state.cards[resources[1]].ready).toBe(false);
});

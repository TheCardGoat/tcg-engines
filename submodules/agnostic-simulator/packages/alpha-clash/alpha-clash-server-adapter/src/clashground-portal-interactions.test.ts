import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const orbit = getCard("ac-ac2-025"),
  amazon = getCard("ac-ac1-025"),
  white = getCard("ac-ac1-051"),
  black = getCard("ac-ac4-008");
const context = { gameId: "clashground-portals", sourceAuthority: "server" as const };
it.each([false, true])(
  "an opponent's Orbit enables native Portal activation with one resource (own Orbit: %s)",
  (own) => {
    const g = Spec.fromFixture({
      playerOne: { resource: own ? [] : [white], ...(own ? { clashground: [orbit] } : {}) },
      playerTwo: { clashground: [orbit] },
    });
    const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    const view = engine.getInteractionView("p1"),
      action = view.actions.find((a) => a.id === "activatePortal");
    if (!action) throw Error("Missing Portal action");
    expect(action.enabled).toBe(true);
    expect(
      engine.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: {} }),
        context,
      ).success,
    ).toBe(true);
    expect(engine.state.portalOpen).toBe(true);
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.controller === "player-one" && c.zone === "resource" && c.ready,
      ),
    ).toHaveLength(0);
  },
);
it("Amazon's discard interaction preserves the chosen hand instance through JSON", () => {
  const g = Spec.fromFixture({
    activePlayer: "player-two",
    playerOne: { deck: [white, white, black] },
    playerTwo: { clashground: [amazon] },
  });
  g.playerTwo.endTurn();
  const ids = g.playerOne
    .instances(white)
    .filter((c) => c.zone === "hand")
    .map((c) => c.instanceId);
  expect(ids).toHaveLength(2);
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!action) throw Error("Missing discard");
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action, values: { selection: [ids[1]] } }),
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.cards[ids[1]].zone).toBe("oblivion");
  expect(engine.state.cards[ids[0]].zone).toBe("hand");
  expect(engine.state.phase).toEqual({ name: "expansion", step: "resource" });
});

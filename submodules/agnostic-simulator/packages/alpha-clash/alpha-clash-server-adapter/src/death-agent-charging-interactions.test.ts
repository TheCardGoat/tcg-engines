import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const context = { gameId: "death-audit", sourceAuthority: "server" as const };
it.each(["yes", "no"])(
  "Charging Through's saved Challenge prompt submits %s and resolves its Portal buff",
  (option) => {
    const charging = getCard("ac-sotv-002");
    const g = Spec.fromFixture({
      playerOne: { clash: [charging] },
      playerTwo: { contender: getCard("ac-ac2-098") },
    });
    g.playerOne.attack(charging, g.playerTwo.contender());
    g.playerTwo.passRound();
    g.clashToDamage();
    const source = g.playerOne.at(charging, "clash").instanceId,
      c = g.state.pendingChoices[0];
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const view = engine.getInteractionView("p1"),
      action = view.actions.find((a) => a.id === `resolveChoice:${c.id}`);
    if (!action) throw Error("Missing Challenge choice");
    const result = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action, values: { confirm: option === "yes" } }),
      context,
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(engine.state.portalOpen).toBe(option === "yes");
    expect(engine.state.pendingChoices).toHaveLength(0);
    const saved = Spec.fromState(JSON.parse(JSON.stringify(engine.state)));
    expect(saved.atk(saved.state.cards[source])).toBe(option === "yes" ? 4 : 3);
  },
);
it("Defeating the second Agent instance through interactions returns that instance without a search choice", () => {
  const agent = getCard("ac-ac2-007");
  const kill = getCard("ac-ac1-118");
  const g = Spec.fromFixture({
      playerOne: { hand: [kill], clash: [agent, agent], resource: [kill, kill] },
    }),
    ids = g.playerOne.instances(agent).map((c) => c.instanceId),
    spell = g.playerOne.at(kill, "hand").instanceId;
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" }),
    view = engine.getInteractionView("p1"),
    play = view.actions.find((a) => a.id === `playCard:${spell}`);
  if (!play) throw Error("Missing play action");
  const result = engine.submitInteraction(
    "p1",
    buildInteractionSubmission({
      view,
      action: play,
      values: {
        targetId: [ids[1]],
        resourcePayment: g.playerOne
          .instances(kill)
          .filter((c) => c.zone === "resource")
          .map((c) => JSON.stringify([c.instanceId, "red"])),
      },
    }),
    context,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  for (let n = 0; n < 10 && engine.state.responseWindow; n++) {
    const seat = engine.state.responseWindow.openFor === "player-one" ? "p1" : "p2",
      v = engine.getInteractionView(seat),
      pass = v.actions.find((a) => a.id === "pass");
    if (!pass) throw Error("Missing pass");
    expect(
      engine.submitInteraction(
        seat,
        buildInteractionSubmission({ view: v, action: pass, values: {} }),
        context,
      ).success,
    ).toBe(true);
  }
  expect(engine.state.cards[ids[1]].zone).toBe("hand");
  expect(engine.state.cards[ids[0]].zone).toBe("clash");
  expect(engine.state.pendingChoices).toHaveLength(0);
});

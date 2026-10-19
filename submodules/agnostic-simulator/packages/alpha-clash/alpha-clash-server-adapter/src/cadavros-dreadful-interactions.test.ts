import { expect, it } from "vite-plus/test";
import { action, clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const cadavros = getCard("ac-ac6-170"),
  dreadful = getCard("ac-ac2-009"),
  gur = getCard("ac-ac3-007"),
  valen = getCard("ac-ac7-072"),
  green = getCard("ac-ac2-025"),
  black = getCard("ac-ac4-008");
const context = { gameId: "cadavros-dreadful", sourceAuthority: "server" as const };
function settle(g: Spec) {
  for (let i = 0; i < 60 && g.state.responseWindow && !g.state.pendingChoices.length; i++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
it.each([true, false])(
  "Cadavros offers its optional draw through a saved interaction: %s",
  (confirm) => {
    const g = Spec.fromFixture({
      playerOne: {
        contender: valen,
        hand: [cadavros],
        resource: [black, green, green],
        deck: [black],
      },
    });
    g.playerOne.play(cadavros);
    settle(g);
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const view = engine.getInteractionView("p1"),
      action = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
    if (!action) throw Error("Missing optional draw");
    expect(
      engine.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: { confirm } }),
        context,
      ).success,
    ).toBe(true);
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.controller === "player-one" && c.zone === "hand",
      ),
    ).toHaveLength(confirm ? 1 : 0);
  },
);
it("Dreadful submits the declared Defeat target before resolving health loss and drawing for that player", () => {
  const kill = action({
    id: "adapter-dreadful-kill",
    name: "Defeat",
    colors: [],
    cost: { total: 0 },
    subtype: "basic",
    effects: [
      {
        type: "dealDamage",
        amount: 2,
        damageType: "non-clash",
        target: { type: "card", zones: ["clash"], chosen: true },
      },
    ],
  });
  const g = Spec.fromFixture({
    definitions: [kill],
    playerOne: { clash: [dreadful], hand: [kill] },
    playerTwo: { health: 15, deck: [black] },
  });
  g.playerOne.play(kill, g.playerOne.at(dreadful, "clash"));
  settle(g);
  expect(g.state.pendingChoices[0]).toMatchObject({
    kind: "target",
    triggerTarget: expect.any(Object),
  });
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  const view = engine.getInteractionView("p1"),
    choice = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!choice) throw Error("Missing target declaration");
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action: choice,
        values: { selection: [g.playerTwo.contender().instanceId] },
      }),
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.players["player-two"].health).toBe(13);
  expect(
    Object.values(engine.state.cards).filter(
      (c) => c.controller === "player-two" && c.zone === "hand",
    ),
  ).toHaveLength(1);
});
it("Gur exposes and submits its free Ambush response with no ready resources", () => {
  const incoming = clashCard({
    id: "adapter-gur-incoming",
    name: "Incoming",
    affiliation: "alpha",
    colors: [],
    cost: { total: 0 },
    attack: 1,
    defense: 5,
  });
  const g = Spec.fromFixture({
    definitions: [incoming],
    turnNumber: 3,
    portalOpen: true,
    playerOne: { hand: [incoming] },
    playerTwo: { accessory: [{ card: gur, faceDown: true, setOnTurn: 1 }] },
  });
  const id = g.playerTwo.at(gur, "accessory").instanceId;
  g.playerOne.play(incoming);
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  const view = engine.getInteractionView("p2"),
    response = view.actions.find((a) => a.id === `respond:${id}`);
  if (!response) throw Error("Missing Gur response");
  expect(response.enabled).toBe(true);
  expect(response.inputs.some((i) => i.id === "resourcePayment")).toBe(false);
  expect(
    engine.submitInteraction(
      "p2",
      buildInteractionSubmission({ view, action: response, values: {} }),
      context,
    ).success,
  ).toBe(true);
  const saved = Spec.fromState(JSON.parse(JSON.stringify(engine.state)));
  settle(saved);
  expect(saved.state.cards[id].zone).toBe("clash");
  expect(saved.state.cards[id].faceDown).toBe(false);
});

import { expect, it } from "vite-plus/test";
import { accessory, action, clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const seats = { p1: "player-one", p2: "player-two" } as const;
const resource = action({
  id: "adapter-huntsman-resource",
  name: "Resource",
  colors: ["white", "green"],
  cost: { total: 0 },
  subtype: "basic",
  effects: [],
});
const body = clashCard({
  id: "adapter-huntsman-body",
  name: "Body",
  affiliation: "alpha",
  colors: [],
  cost: { total: 5 },
  attack: 2,
  defense: 8,
});
const relic = accessory({
  id: "adapter-huntsman-relic",
  name: "Relic",
  colors: [],
  cost: { total: 0 },
  subtype: "relic",
});
function settle(g: Spec) {
  for (let n = 0; n < 40 && g.state.responseWindow && !g.state.pendingChoices.length; n++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
function submit(engine: AlphaClashServerEngine, values: InteractionSubmission["values"]) {
  const view = engine.getInteractionView("p1"),
    choice = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!choice) throw Error("Expected projected choice");
  return engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action: choice, values }),
    { gameId: "huntsman-audit", sourceAuthority: "server" },
  );
}
for (const id of ["ac-ac3-063", "ac-ac1-p01", "ac-ac1-036"])
  it.each([true, false])(
    `${id} submits its exact target before optional acceptance (%s), including JSON continuation`,
    (accept) => {
      const card = getCard(id),
        target = id === "ac-ac1-036" ? body : relic;
      const g = Spec.fromFixture({
        definitions: [resource, body, relic],
        playerOne: {
          hand: [card],
          resource: Array.from({ length: 6 }, () => resource),
          clash: [body],
        },
        playerTwo: id === "ac-ac1-036" ? { clash: [body, body] } : { accessory: [relic, relic] },
      });
      const ids = g.playerTwo.instances(target).map((c) => c.instanceId);
      g.playerOne.play(card);
      settle(g);
      expect(g.state.pendingChoices[0]).toHaveProperty("triggerTarget");
      let engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
      expect(submit(engine, { selection: [ids[1]] }).success).toBe(true);
      expect(engine.state.pendingChoices[0]?.kind).toBe("option");
      engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), seats);
      expect(submit(engine, { confirm: accept }).success).toBe(true);
      expect(engine.state.cards[ids[1]].zone).toBe(
        accept
          ? id === "ac-ac3-063"
            ? "deck"
            : "oblivion"
          : target.cardType === "clash"
            ? "clash"
            : "accessory",
      );
      expect(engine.state.cards[ids[0]].zone).toBe(
        target.cardType === "clash" ? "clash" : "accessory",
      );
      if (id === "ac-ac3-063" && accept)
        expect(engine.state.deckOrder["player-two"][0]).toBe(ids[1]);
      if (id === "ac-ac1-p01")
        expect(Spec.fromState(engine.state).playerOne.atk(body)).toBe(accept ? 3 : 2);
      expect(engine.state.pendingChoices).toHaveLength(0);
    },
  );
it("Cao Ling submits the chosen same-name alternate send cost without resources", () => {
  const cao = getCard("ac-ac3-063");
  const g = Spec.fromFixture({
    definitions: [body, relic],
    playerOne: { hand: [cao], clash: [body, body] },
    playerTwo: { accessory: [relic] },
  });
  const ids = g.playerOne.instances(body).map((c) => c.instanceId),
    cardId = g.playerOne.at(cao, "hand").instanceId;
  const engine = new AlphaClashServerEngine(g.state, seats),
    view = engine.getInteractionView("p1"),
    play = view.actions.find((a) => a.id === `playCard:${cardId}`);
  if (!play) throw Error("Expected alternate play");
  successful(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action: play,
        values: { costRoute: ["alternative"], "alternatePayment:0": [ids[1]] },
      }),
      { gameId: "huntsman-alternative", sourceAuthority: "server" },
    ),
  );
  expect(engine.state.cards[ids[1]].zone).toBe("oblivion");
  expect(engine.state.cards[ids[0]].zone).toBe("clash");
  const saved = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), seats);
  expect(
    submit(saved, { selection: [g.playerTwo.at(relic, "accessory").instanceId] }).success,
  ).toBe(true);
  expect(submit(saved, { confirm: false }).success).toBe(true);
  expect(saved.state.cards[cardId].zone).toBe("clash");
});
it("Chaotic Unmaking submits the exact duplicate discard as its additional cost", () => {
  const card = getCard("ac-ac7-186"),
    filler = getCard("ac-ac4-113");
  const g = Spec.fromFixture({
    playerOne: { hand: [card, filler, filler], resource: [filler, filler, filler] },
  });
  const ids = g.playerOne
      .instances(filler)
      .filter((c) => c.zone === "hand")
      .map((c) => c.instanceId),
    cardId = g.playerOne.at(card, "hand").instanceId;
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats),
    view = engine.getInteractionView("p1"),
    play = view.actions.find((a) => a.id === `playCard:${cardId}`);
  if (!play) throw Error("Expected Unmaking play");
  successful(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action: play,
        values: {
          costRoute: ["normal"],
          discardCostIds: [ids[1]],
          costResources: Object.values(engine.state.cards)
            .filter((c) => c.zone === "resource" && c.controller === "player-one")
            .map((c) => JSON.stringify([c.instanceId, "blue"])),
        },
      }),
      { gameId: "unmaking-discard", sourceAuthority: "server" },
    ),
  );
  expect(engine.state.cards[ids[1]].zone).toBe("oblivion");
  expect(engine.state.cards[ids[0]].zone).toBe("hand");
  expect(engine.state.cards[cardId].zone).toBe("accessory");
});

function successful(result: ReturnType<AlphaClashServerEngine["submitInteraction"]>) {
  expect(result.success, JSON.stringify(result)).toBe(true);
}

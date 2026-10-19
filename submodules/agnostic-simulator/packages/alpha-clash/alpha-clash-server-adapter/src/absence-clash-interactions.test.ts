import { expect, it } from "vite-plus/test";
import { action, clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const seats = { p1: "player-one", p2: "player-two" } as const;
const shadow = getCard("ac-ac7-016"),
  host = getCard("ac-ac7-015"),
  absence = getCard("ac-ac7-001");
const weak = clashCard({
  id: "adapter-absence-weak",
  name: "Weak",
  affiliation: "alpha",
  colors: [],
  cost: { total: 5, pips: { green: 2 } },
  attack: 0,
  defense: 1,
});
function settle(g: Spec) {
  for (let n = 0; n < 40 && g.state.responseWindow && !g.state.pendingChoices.length; n++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
function target(engine: AlphaClashServerEngine, id: string) {
  const view = engine.getInteractionView("p1"),
    choice = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!choice) throw Error("Expected target declaration");
  return engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action: choice, values: { selection: [id] } }),
    { gameId: "absence-clash-audit", sourceAuthority: "server" },
  );
}
it("Shadow submits its exact same-name attack target after JSON restoration", () => {
  const g = Spec.fromFixture({
    definitions: [weak],
    playerOne: { contender: absence, clash: [shadow] },
    playerTwo: { clash: [weak, weak] },
  });
  const ids = g.playerTwo.instances(weak).map((c) => c.instanceId);
  g.playerOne.attack(shadow, g.playerTwo.contender());
  settle(g);
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  expect(target(engine, ids[1]).success).toBe(true);
  expect(engine.state.cards[ids[1]].zone).toBe("banished");
  expect(engine.state.cards[ids[0]].zone).toBe("clash");
  expect(Spec.fromState(engine.state).playerOne.at(shadow, "clash").counters["+1/+1"]).toBe(1);
});
it("New Host's saved Void request rejects its own Contender and applies loss and healing", () => {
  const banish = action({
    id: "adapter-absence-banish",
    name: "Banish",
    colors: [],
    cost: { total: 0 },
    subtype: "basic",
    effects: [
      {
        type: "banish",
        target: { type: "card", controller: "friendly", zones: ["oblivion"], chosen: true },
      },
    ],
  });
  const g = Spec.fromFixture({
    definitions: [banish],
    playerOne: { health: 15, hand: [banish], oblivion: [host] },
    playerTwo: { health: 20 },
  });
  g.playerOne.play(banish, g.playerOne.at(host, "oblivion"));
  settle(g);
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats),
    before = structuredClone(engine.state);
  expect(target(engine, g.playerOne.contender().instanceId).success).toBe(false);
  expect(engine.state).toEqual(before);
  expect(target(engine, g.playerTwo.contender().instanceId).success).toBe(true);
  expect(engine.state.players["player-one"].health).toBe(16);
  expect(engine.state.players["player-two"].health).toBe(19);
});
it("New Host's Victory asks for the opponent's Contender and uses the defeated card's specific cost", () => {
  const g = Spec.fromFixture({
    definitions: [weak],
    playerOne: { clash: [host] },
    playerTwo: { clash: [{ card: weak, ready: false }] },
  });
  const health = g.playerTwo.health();
  g.playerOne.attack(host, g.playerTwo.at(weak, "clash"));
  g.clashToDamage();
  settle(g);
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  expect(target(engine, g.playerTwo.contender().instanceId).success).toBe(true);
  expect(engine.state.players["player-two"].health).toBe(health - 2);
  expect(engine.state.pendingChoices).toHaveLength(0);
});

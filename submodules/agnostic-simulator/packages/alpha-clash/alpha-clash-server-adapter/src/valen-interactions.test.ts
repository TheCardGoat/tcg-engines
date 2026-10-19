import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { hasKeyword, keywordValue } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const valen = getCard("ac-ac7-072"),
  rogue = getCard("ac-ac6-087"),
  enemy = getCard("ac-ac4-147");
const noop = action({
  id: "valen-adapter-action",
  name: "Action",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [],
});
const quick = action({
  id: "valen-adapter-quick",
  name: "Quick",
  colors: [],
  cost: { total: 0 },
  subtype: "quick",
  counterTags: ["counter-play"],
  effects: [],
});
const heal = action({
  ...noop,
  id: "valen-adapter-heal",
  effects: [{ type: "gainHealth", controller: "friendly", amount: 1 }],
});
const context = { gameId: "valen-interactions", sourceAuthority: "server" as const };
function settle(g: Spec) {
  for (let i = 0; i < 40 && g.state.responseWindow && !g.state.pendingChoices.length; i++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
it.each([false, true])(
  "Valen's Recover target interaction selects one instance and rejects the opponent (invalid: %s)",
  (invalid) => {
    const g = Spec.fromFixture({
      definitions: [noop],
      playerOne: { contender: valen, clash: [rogue, rogue], hand: [noop] },
      playerTwo: { clash: [rogue] },
    });
    const [first, second] = g.playerOne.instances(rogue);
    const opposing = g.playerTwo.at(rogue, "clash").instanceId;
    g.playerOne.playAndResolve(noop);
    settle(g);
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const view = engine.getInteractionView("p1"),
      choice = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
    if (!choice) throw Error("Missing Recover choice");
    const input = choice.inputs.find((i) => i.id === "selection");
    if (input?.kind !== "entity-selection") throw Error("Missing targets");
    expect(input.candidates.map((c) => c.entity.instanceId)).toEqual([
      first.instanceId,
      second.instanceId,
    ]);
    const before = structuredClone(engine.state);
    const result = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action: choice,
        values: { selection: [invalid ? opposing : second.instanceId] },
      }),
      context,
    );
    expect(result.success).toBe(!invalid);
    if (invalid) {
      expect(engine.state).toEqual(before);
      return;
    }
    expect(keywordValue(engine.state, first.instanceId, "recover")).toBe(0);
    expect(keywordValue(engine.state, second.instanceId, "recover")).toBe(1);
  },
);
it("Valen's optional full-health draw can be declined through its interaction", () => {
  const g = Spec.fromFixture({
    definitions: [heal],
    playerOne: { contender: valen, hand: [heal], deck: [rogue] },
  });
  g.playerOne.playAndResolve(heal);
  settle(g);
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  const view = engine.getInteractionView("p1"),
    choice = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!choice) throw Error("Missing draw choice");
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action: choice, values: { confirm: false } }),
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.state.deckOrder["player-one"]).toHaveLength(1);
});
it("Valen's Daunting choice can select an opponent's Clash and pays engagement", () => {
  const g = Spec.fromFixture({
    definitions: [noop, quick],
    activePlayer: "player-two",
    playerOne: { contender: valen, health: 12, hand: [quick] },
    playerTwo: { hand: [noop], clash: [enemy] },
  });
  const id = g.playerTwo.at(enemy, "clash").instanceId;
  g.playerTwo.play(noop);
  g.playerOne.respond(quick);
  settle(g);
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  const view = engine.getInteractionView("p1"),
    choice = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!choice) throw Error("Missing Daunting choice");
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action: choice, values: { selection: [id] } }),
      context,
    ).success,
  ).toBe(true);
  expect(hasKeyword(engine.state, id, "daunting")).toBe(true);
  expect(engine.state.cards[engine.state.players["player-one"].contenderId].ready).toBe(false);
});

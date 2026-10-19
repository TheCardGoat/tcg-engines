import { expect, it } from "vite-plus/test";
import { action, clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

it("lets the waiting seat cancel or confirm concession while the opponent orders Oblivion", () => {
  const marcus = getCard("ac-pg-003");
  const ally = clashCard({
    id: "concede-ally",
    name: "Ally",
    affiliation: "alpha",
    colors: [],
    cost: { total: 0 },
    attack: 1,
    defense: 8,
  });
  const incoming = action({
    id: "concede-incoming",
    name: "Incoming",
    colors: [],
    cost: { total: 0 },
    subtype: "basic",
    effects: [],
  });
  const g = Spec.fromFixture({
    definitions: [ally, incoming],
    playerOne: { hand: [incoming] },
    playerTwo: { clash: [marcus, ally] },
  });
  g.playerOne.play(incoming);
  g.playerTwo.activate(marcus, 0);
  for (let i = 0; i < 40 && g.state.responseWindow && !g.state.pendingChoices.length; i++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  const send = g.state.pendingChoices[0];
  if (send.kind !== "modal") throw Error("Expected Marcus optional send");
  const option = send.options.find((option) => option.label === ally.name);
  if (!option) throw Error("Missing ally");
  g.run({ type: "resolveChoice", playerId: "player-two", choiceId: send.id, optionId: option.id });
  expect(g.state.pendingChoices[0]).toMatchObject({ kind: "ordering", playerId: "player-two" });
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  const before = structuredClone(engine.state);
  const view = engine.getInteractionView("p1");
  expect(view.status).toBe("waiting");
  expect(view.actions.map((action) => action.id)).toEqual(["concede"]);
  const concede = view.actions[0];
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action: concede, values: { confirm: false } }),
      { gameId: "ordering-concede", sourceAuthority: "server" },
    ).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
  const result = engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action: concede, values: { confirm: true } }),
    { gameId: "ordering-concede", sourceAuthority: "server" },
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(engine.state.phase.name).toBe("complete");
  expect(engine.state.phase).toMatchObject({ name: "complete", winner: "player-two" });
});

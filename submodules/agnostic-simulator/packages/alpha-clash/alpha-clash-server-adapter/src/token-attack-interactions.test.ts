import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const war = getCard("ac-ac2-112"),
  black = getCard("ac-ac4-008"),
  seats = { p1: "player-one", p2: "player-two" } as const;
function settle(g: Spec) {
  while (g.state.responseWindow && !g.state.pendingChoices.length)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
function fixture() {
  const g = Spec.fromFixture({
    playerOne: { hand: [war], resource: [black, black, black, black], deck: [black, black] },
    playerTwo: { deck: [black, black] },
  });
  g.playerOne.play(war);
  settle(g);
  const choice = g.state.pendingChoices[0];
  if (!choice) throw Error("Expected Portal choice");
  g.run({ type: "resolveChoice", playerId: choice.playerId, choiceId: choice.id, optionId: "no" });
  settle(g);
  g.playerOne.endTurn();
  g.playerTwo.turn("skip");
  g.playerTwo.endTurn();
  g.playerOne.turn("skip");
  return g;
}
it("War Minions are attack candidates and the chosen duplicate attacks through saved interaction", () => {
  const g = fixture(),
    tokens = Object.values(g.state.cards).filter((c) => c.isToken && c.zone === "clash"),
    target = g.playerTwo.contender().instanceId;
  expect(tokens).toHaveLength(2);
  expect(
    applyCommand(structuredClone(g.state), {
      type: "initiateClash",
      playerId: "player-one",
      attackerId: tokens[1].instanceId,
      targetId: target,
    }).success,
  ).toBe(true);
  const e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats),
    view = e.getInteractionView("p1"),
    a = view.actions.find((a) => a.id === "initiateClash");
  if (!a) throw Error("Missing attack");
  const attackers = a.inputs.find((i) => i.id === "attackerId");
  if (attackers?.kind !== "entity-selection") throw Error("Missing attacker candidates");
  for (const token of tokens)
    expect(
      attackers.candidates.some((c) => c.entity.instanceId === token.instanceId && c.enabled),
    ).toBe(true);
  const result = e.submitInteraction(
    "p1",
    buildInteractionSubmission({
      view,
      action: a,
      values: { attackerId: [tokens[1].instanceId], targetId: [target] },
    }),
    { gameId: "token-attack", sourceAuthority: "server" },
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  // The selected 1/1 token is defeated by the Contender's counterstrike and
  // ceases to exist; the other instance remains available to attack.
  expect(e.state.clash).toBeNull();
  expect(e.state.cards[tokens[1].instanceId]).toBeUndefined();
  expect(e.state.cards[tokens[0].instanceId].ready).toBe(true);
  const restored = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats),
    next = restored
      .getInteractionView("p1")
      .actions.find((a) => a.id === "initiateClash")
      ?.inputs.find((i) => i.id === "attackerId");
  if (next?.kind !== "entity-selection") throw Error("Missing remaining attacker");
  expect(
    next.candidates.some((c) => c.entity.instanceId === tokens[1].instanceId && c.enabled),
  ).toBe(false);
  expect(
    next.candidates.some((c) => c.entity.instanceId === tokens[0].instanceId && c.enabled),
  ).toBe(true);
});

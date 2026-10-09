import { expect, it } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import { projectState } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import {
  buildAlphaClashInteractionView,
  alphaClashSubmissionToPayload,
} from "./interaction-protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const titan = getCard("ac-ac6-175");
it("offers Dread Titan from its owner's Oblivion, excludes hand play, and dispatches the play", () => {
  const game = Spec.fromFixture({
    playerOne: {
      hand: [titan],
      oblivion: [titan],
      resource: Array.from({ length: 9 }, () => titan),
    },
    playerTwo: { oblivion: [titan] },
  });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const view = buildAlphaClashInteractionView({
    actorId: "p1",
    seat: "player-one",
    stateVersion: engine.getStateID(),
    playerView: projectState(engine.state, "player-one"),
  });
  const source = game.playerOne.at(titan, "oblivion");
  const action = view.actions.find((action) => action.id === `playCard:${source.instanceId}`);
  if (!action) throw new Error("Missing Oblivion play");
  expect(
    view.actions.some(
      (action) => action.id === `playCard:${game.playerOne.at(titan, "hand").instanceId}`,
    ),
  ).toBe(false);
  expect(
    view.actions.some(
      (action) => action.id === `playCard:${game.playerTwo.at(titan, "oblivion").instanceId}`,
    ),
  ).toBe(false);
  expect(view.actions.some((action) => action.id === `setCard:${source.instanceId}`)).toBe(false);
  const command = alphaClashSubmissionToPayload({
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: engine.getStateID(),
    requestId: action.requestId,
    actionId: action.id,
    values: {},
  });
  expect(
    engine.dispatch(command.moveType, "p1", command.payload, {
      gameId: "titan-test",
      sourceAuthority: "server",
    }).success,
  ).toBe(true);
  expect(engine.state.cards[source.instanceId].zone).toBe("standby");
  expect(
    engine.dispatch("pass", "p2", {}, { gameId: "titan-test", sourceAuthority: "server" }).success,
  ).toBe(true);
  expect(engine.state.cards[source.instanceId].zone).toBe("clash");
});
it("does not offer ordinary Oblivion cards as playable", () => {
  const helper = getCard("ac-ac4-047");
  const game = Spec.fromFixture({ playerOne: { oblivion: [helper] } });
  const view = buildAlphaClashInteractionView({
    actorId: "p1",
    seat: "player-one",
    stateVersion: 1,
    playerView: projectState(game.state, "player-one"),
  });
  expect(
    view.actions.some(
      (action) => action.id === `playCard:${game.playerOne.at(helper, "oblivion").instanceId}`,
    ),
  ).toBe(false);
});

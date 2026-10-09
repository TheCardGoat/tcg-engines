import { expect, it } from "vitest";
import { getCard, allCards } from "@tcg/alpha-clash-cards";
import { projectState } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import {
  buildAlphaClashInteractionView,
  alphaClashSubmissionToPayload,
} from "./interaction-protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

it("offers only white Shadowlight cards in the Clash Zone for the return cost and dispatches the choice", () => {
  const rising = getCard("ac-ac2-014");
  const white = getCard("ac-ac1-052");
  const wrongName = getCard("ac-st2-003");
  const game = Spec.fromFixture({
    playerOne: { hand: [rising, white], clash: [white, rising, wrongName] },
    playerTwo: { clash: [white] },
  });
  const target = game.playerOne.at(white, "clash");
  const hand = game.playerOne.hand(rising);
  const view = buildAlphaClashInteractionView({
    actorId: "p1",
    seat: "player-one",
    stateVersion: 0,
    playerView: projectState(game.state, "player-one"),
  });
  const action = view.actions.find((action) => action.id === `playCard:${hand.instanceId}`);
  expect(action).toBeDefined();
  const input = action?.inputs?.find((input) => input.id === "alternateCostCardIds");
  if (!input || input.kind !== "entity-selection" || !action)
    throw new Error("Missing alternate cost input");
  expect(input.candidates?.map((candidate) => candidate.entity.instanceId)).toEqual([
    target.instanceId,
  ]);
  const command = alphaClashSubmissionToPayload({
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: 0,
    requestId: action.requestId,
    actionId: action.id,
    values: { alternateCostCardIds: [target.instanceId] },
  });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  expect(
    engine.dispatch(command.moveType, "p1", command.payload, {
      gameId: "alternate-cost-test",
      sourceAuthority: "server",
    }).success,
  ).toBe(true);
  expect(engine.state.cards[target.instanceId].zone).toBe("hand");
});

it("offers both named groups for Blink and excludes other Clash cards", () => {
  const blink = getCard("ac-ac1-082");
  const bone = allCards().find((card) => card.cardType === "clash" && card.name.includes("T-Bone"));
  if (!bone) throw new Error("Missing T-Bone");
  const streak = getCard("ac-st2-003");
  const wrong = getCard("ac-ac1-052");
  const game = Spec.fromFixture({ playerOne: { hand: [blink], clash: [bone, streak, wrong] } });
  const view = buildAlphaClashInteractionView({
    actorId: "p1",
    seat: "player-one",
    stateVersion: 0,
    playerView: projectState(game.state, "player-one"),
  });
  const action = view.actions.find(
    (action) => action.id === `playCard:${game.playerOne.hand(blink).instanceId}`,
  );
  const input = action?.inputs?.find((input) => input.id === "alternateCostCardIds");
  if (!input || input.kind !== "entity-selection") throw new Error("Missing alternate cost input");
  expect(input.min).toBe(2);
  expect(input.max).toBe(2);
  expect(input.candidates?.map((candidate) => candidate.entity.instanceId)).toEqual([
    game.playerOne.at(bone, "clash").instanceId,
    game.playerOne.at(streak, "clash").instanceId,
  ]);
});

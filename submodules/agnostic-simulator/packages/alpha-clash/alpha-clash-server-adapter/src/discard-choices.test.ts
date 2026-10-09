import { expect, it } from "vitest";
import type { AcActionCard } from "@tcg/alpha-clash-types";
import { projectState } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import {
  buildAlphaClashInteractionView,
  alphaClashSubmissionToPayload,
} from "./interaction-protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

it("offers a discard selection only to the affected player and dispatches the chosen hand card", () => {
  const cheap: AcActionCard = {
    id: "adapter-discard-cheap",
    name: "Cheap",
    cardType: "action",
    subtype: "basic",
    colors: [],
    cost: { total: 0 },
    effects: [],
  };
  const other = { ...cheap, id: "adapter-discard-other", name: "Other" };
  const spell: AcActionCard = {
    ...cheap,
    id: "adapter-discard-spell",
    name: "Discard spell",
    effects: [{ type: "discard", controller: "opponent", amount: 1 }],
  };
  const game = Spec.fromFixture({
    definitions: [cheap, other, spell],
    playerOne: { hand: [spell] },
    playerTwo: { hand: [cheap, other] },
  });
  const played = game.playerOne.play(spell);
  game.playerTwo.pass();
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const choice = game.state.pendingChoices[0];
  const ownView = buildAlphaClashInteractionView({
    actorId: "p2",
    seat: "player-two",
    stateVersion: engine.getStateID(),
    playerView: projectState(engine.state, "player-two"),
  });
  const action = ownView.actions.find((action) => action.id === `resolveChoice:${choice.id}`);
  const input = action?.inputs?.find((input) => input.id === "selection");
  if (!action || !input || input.kind !== "entity-selection")
    throw new Error("Missing discard input");
  const selected = game.playerTwo.at(other, "hand");
  expect(input.min).toBe(1);
  expect(input.max).toBe(1);
  expect(input.candidates.map((candidate) => candidate.entity.instanceId)).toEqual(
    expect.arrayContaining([selected.instanceId, game.playerTwo.at(cheap, "hand").instanceId]),
  );
  const waiting = buildAlphaClashInteractionView({
    actorId: "p1",
    seat: "player-one",
    stateVersion: engine.getStateID(),
    playerView: projectState(engine.state, "player-one"),
  });
  expect(waiting.actions.some((action) => action.id.startsWith("resolveChoice:"))).toBe(false);
  expect(waiting.status).toBe("waiting");
  const command = alphaClashSubmissionToPayload({
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: engine.getStateID(),
    requestId: action.requestId,
    actionId: action.id,
    values: { selection: [selected.instanceId] },
  });
  const before = structuredClone(engine.state);
  expect(
    engine.dispatch(command.moveType, "p1", command.payload, {
      gameId: "discard-test",
      sourceAuthority: "server",
    }).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
  expect(
    engine.dispatch(command.moveType, "p2", command.payload, {
      gameId: "discard-test",
      sourceAuthority: "server",
    }).success,
  ).toBe(true);
  expect(engine.state.cards[selected.instanceId].zone).toBe("oblivion");
  expect(engine.state.cards[played.instanceId].zone).toBe("oblivion");
});

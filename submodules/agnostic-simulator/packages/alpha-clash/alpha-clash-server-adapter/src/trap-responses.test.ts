import { expect, it } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import type { AcActionCard } from "@tcg/alpha-clash-types";
import { projectState } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import {
  buildAlphaClashInteractionView,
  alphaClashSubmissionToPayload,
} from "./interaction-protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const attacker = getCard("ac-ac1-027");
const other = getCard("ac-ac1-031");
const surprise = getCard("ac-ac1-013");
const missile = getCard("ac-ac1-020");
const spiritual = getCard("ac-ac1-064");
const energy = getCard("ac-ac1-110");
const shockwave = getCard("ac-ac1-089");
const gotcha = getCard("ac-ac1-044");
function view(game: Spec, seat: "player-one" | "player-two") {
  return buildAlphaClashInteractionView({
    actorId: seat === "player-one" ? "p1" : "p2",
    seat,
    stateVersion: 0,
    playerView: projectState(game.state, seat),
  });
}
it("offers an older set Missile Trap, only the attacker as target, and dispatches it", () => {
  const game = Spec.fromFixture({
    turnNumber: 3,
    playerOne: { clash: [attacker, other] },
    playerTwo: {
      hand: [missile],
      accessory: [
        { card: missile, faceDown: true, setOnTurn: 1 },
        { card: missile, faceDown: true, setOnTurn: 3 },
      ],
      resource: [missile, missile, missile],
    },
  });
  game.playerOne.attack(attacker, game.playerTwo.contender());
  const trap = game.playerTwo
    .instances(missile)
    .find((c) => c.zone === "accessory" && c.setOnTurn === 1);
  if (!trap) throw new Error("Missing old Trap");
  const actions = view(game, "player-two").actions.filter((a) => a.id.startsWith("respond:"));
  expect(actions).toHaveLength(1);
  const action = actions[0];
  expect(action.id).toBe(`respond:${trap.instanceId}`);
  const input = action.inputs?.find((i) => i.id === "targetId");
  if (!input || input.kind !== "entity-selection") throw new Error("Missing target input");
  expect(input.candidates?.map((c) => c.entity.instanceId)).toEqual([
    game.playerOne.at(attacker, "clash").instanceId,
  ]);
  const payload = alphaClashSubmissionToPayload({
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: 0,
    requestId: action.requestId,
    actionId: action.id,
    values: { targetId: [game.playerOne.at(attacker, "clash").instanceId] },
  });
  const server = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  expect(
    server.dispatch(payload.moveType, "p2", payload.payload, {
      gameId: "trap-target",
      sourceAuthority: "server",
    }).success,
  ).toBe(true);
  expect(server.state.standby.at(-1)?.cardId).toBe(trap.instanceId);
});
it.each([
  { card: getCard("ac-ac1-005"), allowed: [spiritual, energy] },
  { card: getCard("ac-ac1-009"), allowed: [shockwave] },
])("filters entry Traps for $card.name and needs no target choice", ({ card, allowed }) => {
  const game = Spec.fromFixture({
    playerOne: { hand: [card], resource: Array.from({ length: 8 }, () => card) },
    playerTwo: {
      accessory: [spiritual, energy, shockwave].map((card) => ({
        card,
        faceDown: true,
        setOnTurn: 1,
      })),
    },
  });
  game.playerOne.play(card);
  const actions = view(game, "player-two").actions.filter((a) => a.id.startsWith("respond:"));
  expect(actions.map((a) => a.id).sort()).toEqual(
    allowed.map((c) => `respond:${game.playerTwo.at(c, "accessory").instanceId}`).sort(),
  );
  for (const action of actions) expect(action.inputs).toEqual([]);
});
it("Gotcha is offered for a set Trap activation and dispatches without a card picker", () => {
  const game = Spec.fromFixture({
    playerOne: {
      hand: [attacker],
      resource: [attacker],
      accessory: [{ card: gotcha, faceDown: true, setOnTurn: 1 }],
    },
    playerTwo: {
      accessory: [{ card: spiritual, faceDown: true, setOnTurn: 1 }],
      resource: [spiritual],
    },
  });
  game.playerOne.play(attacker);
  game.playerTwo.respond(spiritual);
  const trap = game.playerOne.at(gotcha, "accessory");
  const action = view(game, "player-one").actions.find(
    (a) => a.id === `respond:${trap.instanceId}`,
  );
  expect(action).toBeDefined();
  expect(action?.inputs).toEqual([]);
  const ordinary = Spec.fromFixture({
    playerOne: { hand: [attacker], resource: [attacker] },
    playerTwo: { accessory: [{ card: gotcha, faceDown: true, setOnTurn: 1 }] },
  });
  ordinary.playerOne.play(attacker);
  expect(view(ordinary, "player-two").actions.some((a) => a.id.startsWith("respond:"))).toBe(false);
});
it("projects current public attack for Destructive Arrival and excludes a buffed attacker", () => {
  const destructive = getCard("ac-ac1-040");
  const plus: AcActionCard = {
    id: "response-plus",
    name: "Plus",
    cardType: "action",
    subtype: "basic",
    colors: [],
    cost: { total: 0 },
    effects: [
      {
        type: "modifyStats",
        target: { type: "card", cardTypes: ["clash"], controller: "friendly", chosen: true },
        attack: 2,
        duration: "endOfTurn",
      },
    ],
  };
  const game = Spec.fromFixture({
    definitions: [plus],
    playerOne: { hand: [plus], clash: [attacker, other] },
    playerTwo: { hand: [destructive], resource: [destructive] },
  });
  game.playerOne.play(plus, game.playerOne.at(attacker, "clash"));
  game.playerTwo.pass();
  game.playerOne.attack(attacker, game.playerTwo.contender());
  const projected = projectState(game.state, "player-two");
  expect(
    projected.cards.find((c) => c.instanceId === game.playerOne.at(attacker, "clash").instanceId)
      ?.attack,
  ).toBe(4);
  expect(view(game, "player-two").actions.some((a) => a.id.startsWith("respond:"))).toBe(false);
});
it("a chosen Clash Buff exposes friendly Contender and Clash targets", () => {
  const inbound = getCard("ac-ac1-093");
  const game = Spec.fromFixture({
    playerOne: { hand: [inbound], clash: [attacker] },
    playerTwo: { clash: [other] },
  });
  game.playerOne.attack(attacker, game.playerTwo.contender());
  game.playerTwo.pass();
  game.playerTwo.pass();
  const action = view(game, "player-one").actions.find(
    (a) => a.id === `playCard:${game.playerOne.hand(inbound).instanceId}`,
  );
  const input = action?.inputs?.find((i) => i.id === "targetId");
  if (!input || input.kind !== "entity-selection") throw new Error("Missing buff input");
  expect(input.candidates?.map((c) => c.entity.instanceId).sort()).toEqual(
    [game.playerOne.contender().instanceId, game.playerOne.at(attacker, "clash").instanceId].sort(),
  );
});
it("hidden cards do not expose their current stats or set turn", () => {
  const game = Spec.fromFixture({
    playerOne: { accessory: [{ card: gotcha, faceDown: true, setOnTurn: 1 }], hand: [attacker] },
  });
  for (const card of projectState(game.state, "player-two").cards.filter(
    (c) => c.controller === "player-one" && (c.faceDown || c.zone === "hand"),
  )) {
    expect(card.attack).toBeUndefined();
    expect(card.defense).toBeUndefined();
    expect(card.setOnTurn).toBeUndefined();
    expect(card.definitionId).toBeNull();
  }
});

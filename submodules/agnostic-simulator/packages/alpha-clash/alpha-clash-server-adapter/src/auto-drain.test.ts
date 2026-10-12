import { expect, test } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const sonoro = getCard("ac-ac1-027");
const missile = getCard("ac-ac1-020");
const context = { gameId: "auto-drain", sourceAuthority: "server" as const };

test("playing a card drains empty response windows in the accepted engine transition", () => {
  const game = Spec.fromFixture({ playerOne: { hand: [sonoro], resource: [sonoro] } });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const id = game.playerOne.at(sonoro, "hand").instanceId;
  const result = engine.dispatch("playCard", "p1", { cardId: id }, context);
  expect(result.success).toBe(true);
  expect(engine.state.cards[id].zone).toBe("clash");
  expect(engine.state.responseWindow).toBeNull();
  expect(engine.state.standby).toHaveLength(0);
  expect(engine.getActivePlayerId()).toBe("p1");
  expect(result.state).toBe(engine.state);
});

test("an attack with no responses, buffs or obstructors drains to damage", () => {
  const game = Spec.fromFixture({ playerOne: { clash: [sonoro] } });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const health = engine.state.players["player-two"].health;
  const result = engine.dispatch(
    "initiateClash",
    "p1",
    {
      attackerId: game.playerOne.at(sonoro, "clash").instanceId,
      targetId: game.playerTwo.contender().instanceId,
    },
    context,
  );
  expect(result.success).toBe(true);
  expect(engine.state.players["player-two"].health).toBeLessThan(health);
  expect(engine.state.clash).toBeNull();
  expect(engine.state.phase.name).toBe("primary");
});

test("draining stops for a legal obstructor", () => {
  const game = Spec.fromFixture({ playerOne: { clash: [sonoro] }, playerTwo: { clash: [sonoro] } });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  expect(
    engine.dispatch(
      "initiateClash",
      "p1",
      {
        attackerId: game.playerOne.at(sonoro, "clash").instanceId,
        targetId: game.playerTwo.contender().instanceId,
      },
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.clash?.step).toBe("obstruct");
  expect(engine.getActivePlayerId()).toBe("p2");
});

test("draining stops for a payable set Trap response", () => {
  const game = Spec.fromFixture({
    turnNumber: 3,
    playerOne: { clash: [sonoro] },
    playerTwo: {
      accessory: [{ card: missile, faceDown: true, setOnTurn: 1 }],
      resource: [missile, missile, missile],
    },
  });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  expect(
    engine.dispatch(
      "initiateClash",
      "p1",
      {
        attackerId: game.playerOne.at(sonoro, "clash").instanceId,
        targetId: game.playerTwo.contender().instanceId,
      },
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.clash?.step).toBe("counter");
  expect(engine.getActivePlayerId()).toBe("p2");
  expect(
    engine.getInteractionView("p2").actions.some((a) => a.enabled && a.id.startsWith("respond:")),
  ).toBe(true);
});

test("an unaffordable Trap does not hold an empty response window", () => {
  const game = Spec.fromFixture({
    turnNumber: 3,
    playerOne: { clash: [sonoro] },
    playerTwo: {
      accessory: [{ card: missile, faceDown: true, setOnTurn: 1 }],
    },
  });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  expect(
    engine.dispatch(
      "initiateClash",
      "p1",
      {
        attackerId: game.playerOne.at(sonoro, "clash").instanceId,
        targetId: game.playerTwo.contender().instanceId,
      },
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.clash).toBeNull();
});

test("draining preserves a Counter ability and its native target choice", () => {
  const warcry = getCard("ac-st3-007");
  const game = Spec.fromFixture({
    playerOne: { clash: [sonoro] },
    playerTwo: { clash: [warcry, sonoro] },
  });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  expect(
    engine.dispatch(
      "initiateClash",
      "p1",
      {
        attackerId: game.playerOne.at(sonoro, "clash").instanceId,
        targetId: game.playerTwo.contender().instanceId,
      },
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.clash?.step).toBe("counter");
  const ability = engine
    .getInteractionView("p2")
    .actions.find((a) => a.enabled && a.id.startsWith("activateAbility:"));
  expect(ability).toBeTruthy();
  expect(
    engine.dispatch(
      "activateAbility",
      "p2",
      {
        cardId: game.playerTwo.at(warcry, "clash").instanceId,
        abilityIndex: 1,
      },
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.pendingChoices.length).toBeGreaterThan(0);
  expect(engine.getActivePlayerId()).toBe("p2");
});

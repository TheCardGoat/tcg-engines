import { expect, test } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import { projectState } from "@tcg/alpha-clash-engine";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { parseProjectedState } from "../../pages/LiveMatch.page";
import { nativeFixtureState } from "../../native-fixture-state";
import {
  fixtureAttack,
  fixturePassResponses,
  fixtureSubmit,
} from "../../native-fixture-test-actions";
import { createCombatBuffFixture, createCombatCounterFixture } from "../../combat-fixture";
import { createResourceStepFixture } from "../../resource-step-fixture";
import { nativeTurnConsole } from "./native-turn-console";
import type { AcSeat } from "../board-types";

function presentation(engine: AlphaClashServerEngine, seat: AcSeat = "player-one") {
  const board = parseProjectedState(projectState(engine.state, seat));
  if (!board) throw new Error("Invalid native projection");
  const view = engine.getInteractionView(seat === "player-one" ? "human" : "bot");
  return nativeTurnConsole(board, view, seat);
}

test("resource and turn actions follow native phases", () => {
  const engine = createResourceStepFixture();
  expect(presentation(engine)).toMatchObject({ phase: "expansion", step: "Resource" });
  expect(presentation(engine)?.actions.map((a) => a.id)).toEqual(["passResource"]);
  fixtureSubmit(engine, "passResource");
  expect(presentation(engine)?.phase).toBe("primary");
  expect(presentation(engine)?.actions.map((a) => a.id)).toContain("endTurn");
  fixtureSubmit(engine, "endTurn");
  expect(presentation(engine, "player-two")).toMatchObject({
    phase: "expansion",
    step: "Resource",
    turnOwner: "you",
    turnNumber: 6,
  });
  expect(presentation(engine)).toMatchObject({ priority: "opponent" });
  expect(presentation(engine)?.actions).toEqual([]);
});

test("playing a card keeps Primary active while the other player responds", () => {
  const sonoro = getCard("ac-ac1-027");
  const fixture = nativeFixtureState({
    id: "turn-hud-response",
    turnNumber: 5,
    playerOne: { contender: getCard("ac-st-001"), hand: [sonoro], resource: [sonoro] },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      hand: [getCard("ac-ac5-060")],
      resource: Array.from({ length: 3 }, () => getCard("ac-ac5-060")),
    },
  });
  const engine = new AlphaClashServerEngine(fixture.state, {
    human: "player-one",
    bot: "player-two",
  });
  const action = engine
    .getInteractionView("human")
    .actions.find((a) => a.id.startsWith("playCard:"))!;
  const values: Record<string, string[]> = {};
  for (const input of action.inputs) {
    if (input.kind === "option-selection" && input.id === "costRoute")
      values[input.id] = ["normal"];
    if (input.kind === "option-selection" && input.presentation?.kind === "cost-slots") {
      values[input.id] = input.presentation.slots.map((slot) =>
        slot.optionIds.find((id) => input.options.find((o) => o.id === id)?.enabled)!,
      );
    }
  }
  fixtureSubmit(engine, action.id, values);
  expect(presentation(engine)).toMatchObject({
    phase: "primary",
    step: "Response",
    priority: "opponent",
  });
  expect(presentation(engine)?.actions).toEqual([]);
  expect(presentation(engine, "player-two")).toMatchObject({
    phase: "primary",
    step: "Response",
    priority: "you",
    turnOwner: "opponent",
  });
  expect(presentation(engine, "player-two")?.actions.map((a) => a.id)).toEqual(["passCounter"]);
  fixturePassResponses(engine);
  expect(presentation(engine)?.step).toBeUndefined();
  expect(presentation(engine)?.actions.map((a) => a.id)).toContain("endTurn");
});

test("Clash decisions belong to the acting seat and return to Primary", () => {
  const engine = createCombatBuffFixture();
  fixtureAttack(engine);
  fixturePassResponses(engine);
  expect(presentation(engine, "player-two")).toMatchObject({
    phase: "clash",
    step: "Obstruction",
    priority: "you",
    turnOwner: "opponent",
  });
  expect(presentation(engine)?.actions).toEqual([]);
  expect(presentation(engine, "player-two")?.actions.map((a) => a.id)).toEqual([
    "declareObstructors",
    "passObstruct",
  ]);
  fixtureSubmit(engine, "passObstruct");
  expect(presentation(engine)).toMatchObject({
    phase: "clash",
    step: "Attacker buff",
    priority: "you",
  });
  fixtureSubmit(engine, "passClashStep");
  expect(presentation(engine, "player-two")).toMatchObject({
    phase: "clash",
    step: "Defender buff",
    priority: "you",
  });
  fixtureSubmit(engine, "passClashStep");
  // Native auto-drain skips windows with no legal response, then resolves damage.
  expect(presentation(engine)).toMatchObject({ phase: "primary", priority: "you" });
});

test("Counter-Attack has one response continuation and no turn-ending action", () => {
  const engine = createCombatCounterFixture();
  fixtureAttack(engine);
  expect(presentation(engine)).toMatchObject({
    phase: "clash",
    step: "Response",
    priority: "opponent",
  });
  expect(presentation(engine, "player-two")?.actions.map((a) => a.id)).toEqual(["passCounter"]);
  fixtureSubmit(engine, "passCounter");
  expect(presentation(engine, "player-two")?.step).toBe("Obstruction");
});

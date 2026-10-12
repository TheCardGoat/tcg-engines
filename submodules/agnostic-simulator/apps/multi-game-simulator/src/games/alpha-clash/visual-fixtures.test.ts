import { playFixtureCardFromHand } from "./prompt-fixture-play";
import { fixtureAttack, fixtureSubmit, fixtureAnswer } from "./native-fixture-test-actions";
import { alphaClashSubmissionToPayload } from "@tcg/alpha-clash-server-adapter";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import { expect, test } from "vite-plus/test";
import { projectState } from "@tcg/alpha-clash-engine";
import { createAlphaClashVisualFixture, alphaClashVisualFixtures } from "./visual-fixtures";

for (const fixture of alphaClashVisualFixtures) {
  test(`${fixture.id} creates an actionable, viewer-safe TestEngine state`, () => {
    const engine = createAlphaClashVisualFixture(fixture.id);
    const actor = engine.getActivePlayerId();
    expect(actor).toBeTruthy();
    expect(engine.getInteractionView(actor!).actions.length).toBeGreaterThan(0);
    const projection = projectState(engine.state, "player-one");
    const hiddenHand = projection.cards.filter(
      (card) => card.controller === "player-two" && card.zone === "hand",
    );
    // Empty hands are valid boundary fixtures; every present opponent card stays hidden.
    expect(hiddenHand.every((card) => card.definitionId === null && card.name === null)).toBe(true);
    expect(projection.cards.filter((card) => card.zone === "contender")).toHaveLength(2);
  });
}
test("clash fixture is produced by an accepted attack command", () => {
  const engine = createAlphaClashVisualFixture("arena-clash");
  expect(engine.state.clash).toBeNull();
  fixtureAttack(engine);
  expect(engine.state.clash).not.toBeNull();
  expect(engine.getActivePlayerId()).toBe("bot");
});
test("counter gallery starts before native counter creation", () => {
  const engine = createAlphaClashVisualFixture("counter-types");
  const cards = projectState(engine.state, "player-one").cards;
  expect(cards.flatMap((card) => Object.keys(card.counters ?? {}))).toEqual([]);
  expect(engine.state.pendingChoices).toHaveLength(0);
});
test("fixture engines reset independently", () => {
  const first = createAlphaClashVisualFixture("arena");
  const second = createAlphaClashVisualFixture("arena");
  first.state.players["player-one"].health = 1;
  expect(second.state.players["player-one"].health).toBe(26);
});

test("Mean-Streak rejects a fractional count without rounding and can retry with zero", () => {
  const engine = createAlphaClashVisualFixture("prompt-number");
  playFixtureCardFromHand(engine, "ac-ac1-077");
  const activate = engine
    .getInteractionView("human")
    .actions.find((a) => a.id.startsWith("activateAbility:"))!;
  fixtureSubmit(engine, activate.id);
  for (const name of ["Mean-Streak, Newfound Powers", "Magnate, Cunning Planner"]) {
    const choice = engine.state.pendingChoices[0];
    if (choice.kind !== "modal") throw new Error("Expected native selection");
    fixtureAnswer(engine, { selection: [choice.options.find((o) => o.label === name)!.id] });
  }
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const submit = (count: number) => {
    const move = alphaClashSubmissionToPayload({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values: { count },
    });
    return engine.dispatch(move.moveType, "human", move.payload, {
      gameId: "count",
      sourceAuthority: "server",
    });
  };
  const before = JSON.stringify(engine.state);
  expect(submit(0.5).success).toBe(false);
  expect(JSON.stringify(engine.state)).toBe(before);
  expect(submit(0).success).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
});

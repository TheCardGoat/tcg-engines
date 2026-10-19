import { beginBarrageFixture as beginBarrage } from "./prompt-fixture-play";
import { playFixtureCardFromHand } from "./prompt-fixture-play";
import { expect, test } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import type { ProjectedState } from "@tcg/alpha-clash-engine";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { createAlphaClashPromptFixture } from "./prompt-fixtures";
import { alphaClashNativeFixturePath } from "./prompt-fixture-catalog";

type Engine = ReturnType<typeof createAlphaClashPromptFixture>;

function submit(
  engine: Engine,
  action: { id: string; requestId: string },
  values: InteractionSubmission["values"],
) {
  const actor = engine.getActivePlayerId()!;
  const view = engine.getInteractionView(actor);
  return engine.submitInteraction(
    actor,
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    },
    { gameId: "native-prompt-test", sourceAuthority: "server" },
  );
}
function submitAction(
  engine: Engine,
  actionId: string,
  values: InteractionSubmission["values"],
  actor = "human",
) {
  const view = engine.getInteractionView(actor);
  const action = view.actions.find((candidate) => candidate.id === actionId);
  if (!action) throw new Error(`Missing action ${actionId}`);
  return engine.submitInteraction(
    actor,
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    },
    { gameId: "native-prompt-test", sourceAuthority: "server" },
  );
}
function passWindows(engine: Engine) {
  for (let n = 0; n < 64; n += 1) {
    if (!engine.state.responseWindow || engine.state.pendingChoices.length) return;
    const actor = engine.state.responseWindow.openFor === "player-two" ? "bot" : "human";
    const pass = engine
      .getInteractionView(actor)
      .actions.find((candidate) => candidate.intent === "pass");
    if (!pass) return;
    submitAction(engine, pass.id, {}, actor);
  }
}

/** The fixture leaves the board untouched; play the card through the production protocol. */
function action(
  engine: Engine,
  predicate: (candidate: { id: string; text: { key: string } }) => boolean,
) {
  const candidate = engine.getInteractionView(engine.getActivePlayerId()!).actions.find(predicate);
  expect(candidate).toBeDefined();
  return candidate!;
}

function resolveChoice(engine: Engine, values: InteractionSubmission["values"]) {
  return submit(
    engine,
    action(engine, (candidate) => candidate.id.startsWith("resolveChoice:")),
    values,
  );
}

const answer = resolveChoice;

function playCard(engine: Engine, definitionId: string) {
  const instance = Object.values(engine.state.cards).find(
    (card) =>
      card.controller === "player-one" &&
      card.zone === "hand" &&
      card.definitionId === definitionId,
  );
  expect(instance).toBeDefined();
  const play = action(engine, (candidate) => candidate.id === `playCard:${instance!.instanceId}`);
  // Playing carries the resource-payment input; assign the cost-slot options.
  const values: InteractionSubmission["values"] = {};
  for (const input of play.inputs) {
    if (input.kind !== "option-selection" || (!input.required && input.id !== "costResources"))
      continue;
    if (input.presentation?.kind === "cost-slots") {
      // Slots may share one option pool: never assign the same resource card twice.
      const usedCards = new Set<string>();
      values[input.id] = input.presentation.slots.map((slot) => {
        const pick =
          slot.optionIds.find((id) => {
            try {
              return !usedCards.has(JSON.parse(id)[0] as string);
            } catch {
              return true;
            }
          }) ?? slot.optionIds[0]!;
        try {
          usedCards.add(JSON.parse(pick)[0] as string);
        } catch {
          // Non-JSON option id: leave the dedupe open.
        }
        return pick;
      });
      continue;
    }
    const payment = input.options.filter((entry) => entry.enabled).slice(0, input.max);
    if (payment.length >= input.min) values[input.id] = payment.map((entry) => entry.id);
  }
  return { play, values };
}

function playFromHand(engine: Engine, definitionId: string) {
  const { play, values } = playCard(engine, definitionId);
  return submit(engine, play, values);
}

test("fixtures start before the player-triggered action", () => {
  for (const id of [
    "prompt-declared-modes",
    "prompt-manifest",
    "prompt-trigger-targets",
    "prompt-number",
    "prompt-targets",
    "prompt-modes",
    "prompt-optional",
    "prompt-foretell",
    "prompt-barrage",
  ]) {
    const engine = createAlphaClashPromptFixture(id);
    expect(engine.state.pendingChoices).toHaveLength(0);
    expect(engine.getActivePlayerId()).toBe("human");
    expect(engine.getInteractionView("human").actions.length).toBeGreaterThan(0);
  }
});

test.each([1, 2])("Mean-Streak moves %i native-created counters", (amount) => {
  const engine = createAlphaClashPromptFixture("prompt-number");
  expect(
    Object.values(engine.state.cards).every((card) => Object.keys(card.counters).length === 0),
  ).toBe(true);
  playFixtureCardFromHand(engine, "ac-ac1-077");
  expect(
    submit(
      engine,
      action(engine, (candidate) => candidate.id.startsWith("activateAbility:")),
      {},
    ).success,
  ).toBe(true);
  const sourceChoice = engine.state.pendingChoices[0];
  if (sourceChoice.kind !== "modal") throw new Error("Expected source choice");
  const sonoro = sourceChoice.options.find(
    (option) => option.label === "Mean-Streak, Newfound Powers",
  )!;
  expect(resolveChoice(engine, { selection: [sonoro.id] }).success).toBe(true);
  const destinationChoice = engine.state.pendingChoices[0];
  if (destinationChoice.kind !== "modal") throw new Error("Expected destination choice");
  const magnate = destinationChoice.options.find(
    (option) => option.label === "Magnate, Cunning Planner",
  )!;
  expect(resolveChoice(engine, { selection: [magnate.id] }).success).toBe(true);
  expect(engine.state.pendingChoices[0]).toMatchObject({ kind: "count", max: 2 });
  expect(resolveChoice(engine, { count: amount }).success).toBe(true);
  const cards = Object.values(engine.state.cards).filter(
    (card) => card.controller === "player-one" && card.zone === "clash",
  );
  expect(cards.find((card) => card.definitionId === "ac-ac1-077")?.counters.streak ?? 0).toBe(
    2 - amount,
  );
  expect(cards.find((card) => card.definitionId === "ac-ac1-028")?.counters.streak).toBe(amount);
});

test("counter activation exposes the board choice with its printed prompt", () => {
  const engine = createAlphaClashPromptFixture("prompt-targets");
  playFixtureCardFromHand(engine, "ac-ac1-077");
  expect(
    submit(
      engine,
      action(engine, (candidate) => candidate.id.startsWith("activateAbility:")),
      {},
    ).success,
  ).toBe(true);
  const first = action(engine, (candidate) => candidate.id.startsWith("resolveChoice:"));
  expect(first.inputs[0]?.text.key).toBe("Choose a Clash to move Streak Counters from");
});

test("Haven and Denver are played through normal actions before their prompts", () => {
  const modes = createAlphaClashPromptFixture("prompt-modes");
  expect(playFromHand(modes, "ac-ac1-051").success).toBe(true);
  expect(modes.state.pendingChoices[0]?.kind).toBe("modal");
  const optional = createAlphaClashPromptFixture("prompt-optional");
  expect(playFromHand(optional, "ac-ac1-001").success).toBe(true);
  expect(optional.state.pendingChoices[0]?.kind).toBe("option");
});

test("Denver's native trigger uses accept, draw, and discard after play", () => {
  const settle = (game: Engine) => {
    while (game.state.responseWindow && !game.state.pendingChoices.length) {
      expect(
        submit(
          game,
          action(game, (candidate) => candidate.id === "passCounter"),
          {},
        ).success,
      ).toBe(true);
    }
  };
  const play = (game: Engine) => {
    expect(playFromHand(game, "ac-ac1-001").success).toBe(true);
    settle(game);
    expect(game.state.pendingChoices[0]).toMatchObject({ kind: "option" });
  };
  const declined = createAlphaClashPromptFixture("prompt-optional");
  const deckSize = declined.state.deckOrder["player-one"].length;
  play(declined);
  expect(resolveChoice(declined, { confirm: false }).success).toBe(true);
  expect(declined.state.deckOrder["player-one"]).toHaveLength(deckSize);

  const accepted = createAlphaClashPromptFixture("prompt-optional");
  play(accepted);
  expect(resolveChoice(accepted, { confirm: true }).success).toBe(true);
  expect(accepted.state.deckOrder["player-one"]).toHaveLength(deckSize - 2);
  const discard = accepted.state.pendingChoices[0];
  if (discard.kind !== "target") throw new Error("Expected discard choice");
  const card = discard.candidates[0];
  expect(resolveChoice(accepted, { selection: card }).success).toBe(true);
  expect(accepted.state.cards[card].zone).toBe("oblivion");
});

test("Clarity and Machina begin with their player actions available", () => {
  const foretell = createAlphaClashPromptFixture("prompt-foretell");
  expect(
    action(foretell, (candidate) => candidate.id.startsWith("activateAbility:")),
  ).toBeDefined();
  expect(foretell.state.pendingChoices).toHaveLength(0);
  const barrage = createAlphaClashPromptFixture("prompt-barrage");
  expect(action(barrage, (candidate) => candidate.id === "initiateClash")).toBeDefined();
  expect(barrage.state.pendingChoices).toHaveLength(0);
});

test("saved mixed-case Counter names load as one named Counter", () => {
  const saved = structuredClone(createAlphaClashPromptFixture("prompt-number").state);
  const source = Object.values(saved.cards).find(
    (card) =>
      card.zone === "clash" &&
      card.controller === "player-one" &&
      card.definitionId === "ac-ac1-027",
  )!;
  source.counters = { Streak: 2, streak: 1 };
  source.removeCountersAfterClash = { Streak: 1 };
  const engine = new AlphaClashServerEngine(saved, { human: "player-one", bot: "player-two" });
  expect(engine.state.cards[source.instanceId].counters).toEqual({ streak: 3 });
  expect(engine.state.cards[source.instanceId].removeCountersAfterClash).toEqual({ streak: 1 });
  const board = engine.getViewerState({ role: "player", actorId: "human" }) as ProjectedState;
  expect(board.cards.find((card) => card.instanceId === source.instanceId)?.counters).toEqual({
    streak: 3,
  });
});

test("mode and optional fixtures open before their card is played", () => {
  for (const [id, definitionId] of [
    ["prompt-modes", "ac-ac1-051"],
    ["prompt-optional", "ac-ac1-001"],
  ] as const) {
    const engine = createAlphaClashPromptFixture(id);
    expect(engine.state.pendingChoices).toHaveLength(0);
    const hand = Object.values(engine.state.cards).filter(
      (c) => c.controller === "player-one" && c.zone === "hand",
    );
    expect(hand.some((c) => c.definitionId === definitionId)).toBe(true);
  }
});

test.each([
  { label: "Your Contender gains two health.", health: 28, hand: 1, deck: 40 },
  { label: "Draw one card.", health: 26, hand: 2, deck: 39 },
])("Haven resolves only the selected mode: $label", ({ label, health, hand, deck }) => {
  const engine = createAlphaClashPromptFixture("prompt-modes");
  expect(playFromHand(engine, "ac-ac1-051").success).toBe(true);
  passWindows(engine);
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "modal") throw new Error("Expected Haven mode");
  const option = choice.options.find((entry) => entry.label === label);
  expect(option).toBeDefined();
  const actor = engine.getActivePlayerId()!;
  const view = engine.getInteractionView(actor);
  const choiceAction = view.actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
  const submission: import("@tcg/protocol").InteractionSubmission = {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: view.stateVersion,
    requestId: choiceAction.requestId,
    actionId: choiceAction.id,
    values: { selection: option!.id },
  };
  const context = { gameId: "haven-modes", sourceAuthority: "server" as const };
  const before = structuredClone(engine.state);
  // An invalid option and a submission by the waiting player cannot consume the choice.
  expect(
    engine.submitInteraction(
      actor,
      { ...submission, values: { selection: "missing-mode" } },
      context,
    ).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
  expect(engine.submitInteraction("bot", submission, context).success).toBe(false);
  expect(engine.state).toEqual(before);
  expect(engine.submitInteraction(actor, submission, context).success).toBe(true);
  expect(engine.state.players["player-one"].health).toBe(health);
  expect(engine.state.deckOrder["player-one"]).toHaveLength(deck);
  expect(
    Object.values(engine.state.cards).filter(
      (card) => card.controller === "player-one" && card.zone === "hand",
    ),
  ).toHaveLength(hand);
  expect(engine.state.pendingChoices).toHaveLength(0);
  if (label === "Draw one card.") {
    const drawnId = before.deckOrder["player-one"][0]!;
    expect(engine.getViewerState({ role: "player", actorId: "human" })).toEqual(
      expect.objectContaining({
        cards: expect.arrayContaining([
          expect.objectContaining({
            instanceId: drawnId,
            zone: "hand",
            definitionId: before.cards[drawnId].definitionId,
          }),
        ]),
      }),
    );
    for (const viewer of [{ role: "player", actorId: "bot" }, { role: "spectator" }] as const) {
      expect(engine.getViewerState(viewer)).toEqual(
        expect.objectContaining({
          cards: expect.arrayContaining([
            expect.objectContaining({
              instanceId: drawnId,
              zone: "hand",
              definitionId: null,
              name: null,
            }),
          ]),
        }),
      );
    }
  }
  const completed = structuredClone(engine.state);
  expect(engine.submitInteraction(actor, submission, context).success).toBe(false);
  expect(engine.state).toEqual(completed);
});

test("Denver decline and accept use native optional and discard choices", () => {
  const declined = createAlphaClashPromptFixture("prompt-optional");
  expect(playFromHand(declined, "ac-ac1-001").success).toBe(true);
  passWindows(declined);
  const deckSize = declined.state.deckOrder["player-one"].length;
  expect(answer(declined, { confirm: false }).success).toBe(true);
  expect(declined.state.deckOrder["player-one"]).toHaveLength(deckSize);
  const accepted = createAlphaClashPromptFixture("prompt-optional");
  expect(playFromHand(accepted, "ac-ac1-001").success).toBe(true);
  passWindows(accepted);
  expect(answer(accepted, { confirm: true }).success).toBe(true);
  expect(accepted.state.deckOrder["player-one"]).toHaveLength(deckSize - 2);
  const discard = accepted.state.pendingChoices[0];
  expect(discard.kind).toBe("target");
  if (discard.kind !== "target") throw new Error("Expected discard");
  const card = discard.candidates[0];
  expect(answer(accepted, { selection: card }).success).toBe(true);
  expect(accepted.state.cards[card].zone).toBe("oblivion");
});

test("alternative cost play pays normal or sends the eligible clash to oblivion", () => {
  const readyResources = (engine: Engine) =>
    Object.values(engine.state.cards).filter(
      (c) => c.controller === "player-one" && c.zone === "resource" && c.ready,
    ).length;
  const handCaoLing = (engine: Engine) =>
    Object.values(engine.state.cards).find(
      (c) => c.controller === "player-one" && c.zone === "hand" && c.definitionId === "ac-ac3-063",
    )!;

  const fixture = createAlphaClashPromptFixture("prompt-alternate-cost");
  const caoLing = handCaoLing(fixture);
  expect(fixture.state.pendingChoices).toHaveLength(0);
  const view = fixture.getInteractionView("human");
  const play = view.actions.find((action) => action.id === `playCard:${caoLing.instanceId}`);
  expect(play).toBeDefined();
  const costInput = play!.inputs.find(
    (input) => input.kind === "entity-selection" && input.role === "cost",
  );
  if (!costInput || costInput.kind !== "entity-selection")
    throw new Error("Expected an optional alternative-cost input");
  expect(costInput.required).toBe(false);
  expect(costInput.candidates.length).toBe(1);

  expect(submitAction(fixture, play!.id, playCard(fixture, "ac-ac3-063").values).success).toBe(
    true,
  );
  const fixtureZone = (engine: Engine, instanceId: string) =>
    Object.values(engine.state.cards).find((card) => card.instanceId === instanceId)?.zone;
  expect(fixtureZone(fixture, caoLing.instanceId)).toBe("clash");
  expect(readyResources(fixture)).toBe(1);
  passWindows(fixture);
  expect(fixtureZone(fixture, caoLing.instanceId)).toBe("clash");

  const alternate = createAlphaClashPromptFixture("prompt-alternate-cost");
  const altCaoLing = handCaoLing(alternate);
  const altPlay = alternate
    .getInteractionView("human")
    .actions.find((action) => action.id === `playCard:${altCaoLing.instanceId}`)!;
  const costSelection = altPlay.inputs.find(
    (input) => input.kind === "entity-selection" && input.role === "cost",
  );
  if (!costSelection || costSelection.kind !== "entity-selection")
    throw new Error("Expected an optional alternative-cost input");
  const payment = costSelection.candidates[0].entity.instanceId;
  expect(payment).toBeTruthy();
  expect(
    submitAction(alternate, altPlay.id, {
      costRoute: ["alternative"],
      [costSelection.id]: [payment],
    }).success,
  ).toBe(true);
  expect(alternate.state.responseWindow).toBeNull();
  expect(
    Object.values(alternate.state.cards).find((card) => card.instanceId === altCaoLing.instanceId)
      ?.zone,
  ).toBe("clash");
  expect(readyResources(alternate)).toBe(6);
  expect(
    Object.values(alternate.state.cards).find((card) => card.instanceId === payment)?.zone,
  ).toBe("oblivion");
  passWindows(alternate);
  expect(
    Object.values(alternate.state.cards).find((card) => card.instanceId === altCaoLing.instanceId)
      ?.zone,
  ).toBe("clash");
});

test("old mockup URLs route to native fixtures, unsupported cases to the index", () => {
  expect(alphaClashNativeFixturePath("board-number")).toBe(
    "/alpha-clash/simulator/tests/prompt-number",
  );
  expect(alphaClashNativeFixturePath("board-costs")).toBe(
    "/alpha-clash/simulator/tests/prompt-cost-routes",
  );
});

test("counter prompt identifies its ability and transfer; cancel resolves zero without undoing activation", () => {
  const engine = createAlphaClashPromptFixture("prompt-number");
  expect(
    Object.values(engine.state.cards).every((card) => Object.keys(card.counters).length === 0),
  ).toBe(true);
  playFixtureCardFromHand(engine, "ac-ac1-077");
  expect(
    submit(
      engine,
      action(engine, (a) => a.id.startsWith("activateAbility:")),
      {},
    ).success,
  ).toBe(true);
  for (const label of ["Mean-Streak, Newfound Powers", "Magnate, Cunning Planner"]) {
    const choice = engine.state.pendingChoices[0];
    if (choice.kind !== "modal") throw new Error("Expected card selection");
    const option = choice.options.find((entry) => entry.label === label);
    if (!option) throw new Error(`Missing selection for ${label}`);
    expect(resolveChoice(engine, { selection: [option.id] }).success).toBe(true);
  }
  const view = engine.getInteractionView("human");
  const countAction = view.actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  expect(engine.state.cards[countAction.source!.instanceId].definitionId).toBe("ac-ac1-071");
  const input = countAction.inputs[0];
  expect(input.kind).toBe("number");
  if (input.kind !== "number") throw new Error("Expected amount prompt");
  expect(input.presentation?.contextText?.key).toBe(
    "From Mean-Streak, Newfound Powers to Magnate, Cunning Planner",
  );
  expect(input.presentation?.cancel?.value).toBe(0);
  expect(answer(engine, { count: 0 }).success).toBe(true);
  const source = Object.values(engine.state.cards).find(
    (c) => c.controller === "player-one" && c.zone === "clash" && c.definitionId === "ac-ac1-077",
  )!;
  expect(source.counters.streak).toBe(2);
  expect(engine.state.pendingChoices).toHaveLength(0);
});

test("Barrage accepts a subset, enforces division limits, retries, and can decline", () => {
  const engine = createAlphaClashPromptFixture("prompt-barrage");
  beginBarrage(engine);
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "division") throw new Error("Expected Barrage");
  const [a, b, c] = choice.candidates;
  const state = structuredClone(engine.state);
  for (const allocation of [
    { [a]: choice.total - 1 },
    { [a]: choice.total + 1 },
    { [a]: 1.5, [b]: choice.total - 1.5 },
    { [a]: -1, [b]: choice.total + 1 },
    { hidden: choice.total },
    { [a]: 1, [b]: 1, [c]: choice.total - 2 },
  ]) {
    expect(answer(engine, { allocation }).success).toBe(false);
    expect(engine.state).toEqual(state);
  }
  const target = choice.candidates.find(
    (id) => engine.state.cards[id].controller === "player-two",
  )!;
  expect(answer(engine, { allocation: { [target]: choice.total } }).success).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(
    engine.state.cards[target].zone === "oblivion" || engine.state.cards[target].phaseDamage > 0,
  ).toBe(true);
  const split = createAlphaClashPromptFixture("prompt-barrage");
  beginBarrage(split);
  const division = split.state.pendingChoices[0];
  if (division.kind !== "division") throw new Error("Expected Barrage");
  expect(
    answer(split, {
      allocation: { [division.candidates[0]]: 1, [division.candidates[1]]: division.total - 1 },
    }).success,
  ).toBe(true);
  const declined = createAlphaClashPromptFixture("prompt-barrage");
  beginBarrage(declined);
  expect(answer(declined, { allocation: {} }).success).toBe(true);
  expect(declined.state.pendingChoices).toHaveLength(0);
});

test("Barrage exposes only public Clash targets and blocks the other viewer", () => {
  const engine = createAlphaClashPromptFixture("prompt-barrage");
  beginBarrage(engine);
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const input = action.inputs[0];
  if (input.kind !== "entity-allocation") throw new Error("Expected allocation");
  expect(input).toMatchObject({ allowEmpty: true, maxRecipients: 2 });
  for (const candidate of input.candidates)
    expect(engine.state.cards[candidate.entity.instanceId].zone).toBe("clash");
  expect(
    engine.submitInteraction(
      "bot",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: action.id,
        values: { allocation: {} },
      },
      { gameId: "allocation-test", sourceAuthority: "server" },
    ).success,
  ).toBe(false);
});

test("target change fixture rejects friendly and hidden cards, then resolves only the final target", () => {
  const engine = createAlphaClashPromptFixture("prompt-target-change");
  const view = engine.getInteractionView("human");
  const source = Object.values(engine.state.cards).find(
    (card) => card.definitionId === "ac-ac3-102" && card.zone === "hand",
  )!;
  // Trigger targets are declared after the card enters play (rule 603.3d), so
  // the play itself carries only the resource-payment input.
  const action = view.actions.find((action) => action.id === `playCard:${source.instanceId}`)!;
  const payment = action.inputs.find((input) => input.kind === "option-selection");
  if (!payment || payment.kind !== "option-selection") throw new Error("Expected resource payment");
  expect(payment.id).toBe("resourcePayment");
  expect(
    engine.submitInteraction(
      "human",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: action.id,
        values: { resourcePayment: [payment.options[0]!.id] },
      },
      { gameId: "target-change", sourceAuthority: "server" },
    ).success,
  ).toBe(true);
  for (
    let n = 0;
    n < 20 && engine.state.responseWindow && !engine.state.pendingChoices.length;
    n++
  ) {
    const actor = engine.getActivePlayerId()!;
    const next = engine.getInteractionView(actor);
    const pass = next.actions.find((entry) => entry.enabled && entry.intent === "pass")!;
    expect(
      engine.submitInteraction(
        actor,
        {
          protocolVersion: INTERACTION_PROTOCOL_VERSION,
          stateVersion: next.stateVersion,
          requestId: pass.requestId,
          actionId: pass.id,
          values: {},
        },
        { gameId: "target-change", sourceAuthority: "server" },
      ).success,
    ).toBe(true);
  }
  // The enterPlay trigger stages its chosen target as a native prompt; only the
  // declared candidate receives the Bounty Counter.
  const declaration = engine.state.pendingChoices[0];
  expect(declaration?.kind).toBe("target");
  if (declaration?.kind !== "target") throw new Error("Expected target declaration");
  const ids = declaration.candidates;
  expect(ids).toHaveLength(2);
  expect(ids.every((id) => engine.state.cards[id]?.controller === "player-two")).toBe(true);
  const declare = (id: string) => {
    const actor = engine.getActivePlayerId()!;
    const next = engine.getInteractionView(actor);
    const resolve = next.actions.find((entry) => entry.id === `resolveChoice:${declaration.id}`)!;
    return engine.submitInteraction(
      actor,
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: next.stateVersion,
        requestId: resolve.requestId,
        actionId: resolve.id,
        values: { selection: [id] },
      },
      { gameId: "target-change", sourceAuthority: "server" },
    );
  };
  const friendly = Object.values(engine.state.cards).find(
    (card) => card.controller === "player-one" && card.zone === "clash",
  )!;
  const hidden = Object.values(engine.state.cards).find((card) => card.zone === "deck")!;
  const versionBeforeDeclaring = engine.getInteractionView("human").stateVersion;
  expect(declare(friendly.instanceId).success).toBe(false);
  expect(declare(hidden.instanceId).success).toBe(false);
  expect(engine.getInteractionView("human").stateVersion).toBe(versionBeforeDeclaring);
  expect(declare(ids[1]).success).toBe(true);
  for (let n = 0; n < 20 && engine.state.responseWindow; n++) {
    const actor = engine.getActivePlayerId()!;
    const next = engine.getInteractionView(actor);
    const pass = next.actions.find((entry) => entry.enabled && entry.intent === "pass")!;
    expect(
      engine.submitInteraction(
        actor,
        {
          protocolVersion: INTERACTION_PROTOCOL_VERSION,
          stateVersion: next.stateVersion,
          requestId: pass.requestId,
          actionId: pass.id,
          values: {},
        },
        { gameId: "target-change", sourceAuthority: "server" },
      ).success,
    ).toBe(true);
  }
  expect(engine.state.cards[ids[1]].counters.bounty).toBe(1);
  expect(engine.state.cards[ids[0]].counters.bounty ?? 0).toBe(0);
});

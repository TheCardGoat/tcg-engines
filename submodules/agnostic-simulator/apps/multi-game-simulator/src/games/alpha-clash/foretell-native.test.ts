import { fixtureSubmit, fixturePassResponses } from "./native-fixture-test-actions";
import { expect, test } from "vite-plus/test";
import { applyCommand, projectState, deckOrderOptions } from "@tcg/alpha-clash-engine";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { createAlphaClashPromptFixture } from "./prompt-fixtures";

function fixture(id = "prompt-foretell-draw-step") {
  const engine = createAlphaClashPromptFixture(id);
  if (id === "prompt-foretell-draw-step") {
    fixtureSubmit(engine, "endTurn");
    fixturePassResponses(engine);
  }
  const send = (
    action: { requestId: string; id: string },
    values: InteractionSubmission["values"],
  ) => {
    const view = engine.getInteractionView("human");
    const result = engine.submitInteraction(
      "human",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: action.id,
        values,
      },
      { gameId: "foretell-test", sourceAuthority: "server" },
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
  };
  const setup = engine.getInteractionView("human").actions;
  if (id === "prompt-foretell-draw-step") {
    // Accept the optional draw-step trigger through the production protocol.
    send(setup.find((action) => action.id.startsWith("resolveChoice:"))!, { confirm: true });
  } else {
    // Clarity's printed ordering ability: activate it through the production protocol.
    send(setup.find((action) => action.id.startsWith("activateAbility:"))!, {});
  }
  const view = engine.getInteractionView("human");
  const action = view.actions.find((action) => action.id.startsWith("resolveChoice:"))!;
  const ids = engine.state.deckOrder["player-one"].slice(0, id === "prompt-foretell" ? 3 : 2);
  const submit = (groups: Record<string, string[]>, actor = "human") =>
    engine.submitInteraction(
      actor,
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: action.id,
        values: { deckOrder: groups },
      },
      { gameId: "foretell-test", sourceAuthority: "server" },
    );
  return { engine, action, ids, submit };
}

test.each(["split", "all-top", "all-bottom"])(
  "Foretell %s follows native first-to-last draw order",
  (mode) => {
    const {
      engine,
      action,
      ids: [a, b],
      submit,
    } = fixture();
    expect(action.inputs[0].kind).toBe("entity-partition");
    const rest = engine.state.deckOrder["player-one"].slice(2);
    const groups =
      mode === "split"
        ? { top: [b], bottom: [a] }
        : mode === "all-top"
          ? { top: [b, a], bottom: [] }
          : { top: [], bottom: [b, a] };
    const expected = [...groups.top, ...rest, ...groups.bottom];
    const result = submit(groups);
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(engine.state.cards[expected[0]].zone).toBe("hand");
    expect(engine.state.deckOrder["player-one"]).toEqual(expected.slice(1));
    expect(engine.state.pendingChoices).toHaveLength(0);
    expect(submit(groups).success).toBe(false); // stale repeat never draws again
  },
);

test("invalid groups fail atomically at both protocol and native boundaries; retry succeeds", () => {
  const {
    engine,
    ids: [a, b],
    submit,
  } = fixture();
  const original = structuredClone(engine.state);
  const invalid: Record<string, string[]>[] = [
    { top: [a], bottom: [] },
    { top: [a], bottom: [a] },
    { top: [a], bottom: ["not-looked-at"] },
    { top: [a], sideways: [b] },
  ];
  for (const groups of invalid) {
    expect(submit(groups).success).toBe(false);
    const result = applyCommand(engine.state, {
      type: "resolveChoice",
      playerId: "player-one",
      choiceId: engine.state.pendingChoices[0].id,
      deckOrder: groups,
    });
    expect(result.success).toBe(false);
    expect(engine.state).toEqual(original);
  }
  expect(submit({ top: [a, b], bottom: [] }, "bot").success).toBe(false);
  expect(engine.state).toEqual(original);
  expect(submit({ top: [b], bottom: [a] }).success).toBe(true);
});

test("only the choosing player sees the permitted artwork; identity is hidden again after resolution", () => {
  const { engine, ids, submit } = fixture();
  for (const viewer of ["player-one", "player-two", "spectator"] as const) {
    const projected = projectState(engine.state, viewer);
    expect(
      projected.cards
        .filter((card) => card.zone === "deck" && card.definitionId)
        .map((card) => card.instanceId)
        .sort(),
    ).toEqual(viewer === "player-one" ? [...ids].sort() : []);
    if (viewer !== "player-one") expect(projected.pendingChoices).toEqual([]);
  }
  expect(submit({ top: [ids[1]], bottom: [ids[0]] }).success).toBe(true);
  expect(
    projectState(engine.state, "player-one").cards.filter(
      (card) => card.zone === "deck" && card.definitionId,
    ),
  ).toEqual([]);
});

test("group resolution matches the original native choices and continuations exactly", () => {
  const { engine, ids, submit } = fixture();
  let native = structuredClone(engine.state);
  const groups = { top: [ids[1]], bottom: [ids[0]] };
  for (const destination of ["top", "bottom"] as const)
    for (const cardId of groups[destination]) {
      const choice = native.pendingChoices[0];
      const option = deckOrderOptions(choice).find(
        (option) => option.cardId === cardId && option.destination === destination,
      )!;
      const result = applyCommand(native, {
        type: "resolveChoice",
        playerId: "player-one",
        choiceId: choice.id,
        optionId: option.optionId,
      });
      expect(result.success, JSON.stringify(result)).toBe(true);
      native = result.state;
    }
  expect(submit(groups).success).toBe(true);
  expect(engine.state.deckOrder).toEqual(native.deckOrder);
  expect(engine.state.cards).toEqual(native.cards);
  expect(engine.state.moveLog).toEqual(native.moveLog);
});

test("top-only printed ability rejects Bottom at both boundaries", () => {
  const { engine, action, ids, submit } = fixture("prompt-foretell");
  const input = action.inputs[0];
  if (input.kind !== "entity-partition") throw new Error("Expected ordered groups");
  expect(input.routes.map((route) => route.id)).toEqual(["top"]);
  const before = structuredClone(engine.state);
  expect(submit({ top: ids.slice(1), bottom: [ids[0]] }).success).toBe(false);
  expect(
    applyCommand(engine.state, {
      type: "resolveChoice",
      playerId: "player-one",
      choiceId: engine.state.pendingChoices[0].id,
      deckOrder: { bottom: ids },
    }).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
  expect(submit({ top: [...ids].reverse() }).success).toBe(true);
  expect(engine.state.cards[ids[2]].zone).toBe("hand");
});

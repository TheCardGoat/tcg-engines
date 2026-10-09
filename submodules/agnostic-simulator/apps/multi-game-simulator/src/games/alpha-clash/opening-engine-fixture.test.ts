import { expect, test } from "vite-plus/test";
import { projectState } from "@tcg/alpha-clash-engine";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { createAlphaClashVisualFixture } from "./visual-fixtures";
import { arenaLayout } from "./components/Arena3D/layout";

type Engine = ReturnType<typeof createAlphaClashVisualFixture>;
function submit(
  engine: Engine,
  actor: string,
  id: string,
  values: InteractionSubmission["values"] = {},
) {
  const view = engine.getInteractionView(actor);
  const action = view.actions.find((a) => a.id === id);
  if (!action) throw new Error(`Missing ${id}`);
  return engine.submitInteraction(
    actor,
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    },
    { gameId: "visual-opening-preview", sourceAuthority: "server" },
  );
}

test("opening fixture starts from a seeded native deal, with full opening hands and empty play zones", () => {
  const engine = createAlphaClashVisualFixture("opening-preview");
  const state = projectState(engine.state, "player-one");
  expect(state.phase.name).toBe("setup");
  expect(state.turnNumber).toBe(0);
  for (const seat of ["player-one", "player-two"] as const) {
    expect(state.players[seat].handSize).toBe(8);
    expect(state.players[seat].deckSize).toBe(42);
  }
  expect(
    state.cards.filter((c) =>
      ["resource", "clash", "accessory", "clashground", "oblivion"].includes(c.zone),
    ),
  ).toHaveLength(0);
  expect(
    state.cards
      .filter((c) => c.zone === "hand" && c.controller === "player-two")
      .every((c) => c.definitionId === null),
  ).toBe(true);
  const layout = arenaLayout(
    { ...state, phaseName: state.phase.name, standbyCount: state.standby.length },
    "player-one",
    false,
    0,
    1120,
  );
  expect(layout.filter((p) => p.hand)).toHaveLength(8);
  const reset = projectState(createAlphaClashVisualFixture("opening-preview").state, "player-one");
  expect(reset.cards).toEqual(state.cards);
});

test("both seats can mulligan once, then start and deploy through the same interaction protocol as the board", () => {
  const engine = createAlphaClashVisualFixture("opening-preview");
  for (const actor of ["human", "bot"]) {
    const action = engine.getInteractionView(actor).actions.find((a) => a.id === "mulligan")!;
    const input = action.inputs[0];
    if (input.kind !== "entity-selection") throw new Error("Missing mulligan selection");
    const cardIds = input.candidates.slice(0, 2).map((c) => c.entity.instanceId!);
    const kept = input.candidates.slice(2).map((c) => c.entity.instanceId!);
    expect(submit(engine, actor, "mulligan", { cardIds }).success).toBe(true);
    for (const id of kept) expect(engine.state.cards[id].zone).toBe("hand");
    expect(engine.getInteractionView(actor).actions.some((a) => a.id === "mulligan")).toBe(false);
    expect(engine.state.phase.name).toBe("setup");
  }
  expect(submit(engine, "bot", "startGame").success).toBe(true);
  expect(engine.getActivePlayerId()).toBe("human");
  expect(engine.state.turnNumber).toBe(1);
  expect(engine.getInteractionView("human").actions.some((a) => a.id === "startGame")).toBe(false);
  const deploy = engine.getInteractionView("human").actions.find((a) => a.id === "deployResource");
  const input = deploy?.inputs.find((i) => i.kind === "entity-selection");
  if (!input || input.kind !== "entity-selection") throw new Error("Missing resource selection");
  const cardId = input.candidates[0]?.entity.instanceId;
  if (!cardId) throw new Error("Missing deploy candidate");
  expect(submit(engine, "human", "deployResource", { cardId: [cardId] }).success).toBe(true);
  const visible = projectState(engine.state, "player-one");
  expect(visible.cards.find((c) => c.instanceId === cardId)?.zone).toBe("resource");
  expect(visible.phase.name).toBe("primary");
});

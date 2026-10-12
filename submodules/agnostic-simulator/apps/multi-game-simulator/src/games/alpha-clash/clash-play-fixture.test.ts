import { expect, test } from "vitest";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import { availableInteractionCardIds } from "@tcg/simulator-presentation/selection";
import { createClashPlayFixture } from "./clash-play-fixture";
import { resourceBoard } from "./resource-step-fixture";
import { arenaLayout } from "./components/Arena3D/layout";

function submit(engine: ReturnType<typeof createClashPlayFixture>, actionId: string) {
  const actor = engine.getActivePlayerId()!;
  const view = engine.getInteractionView(actor);
  const action = view.actions.find((a) => a.id === actionId)!;
  return engine.submitInteraction(
    actor,
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId,
      values: Object.fromEntries(
        action.inputs.flatMap((input) =>
          input.kind === "option-selection" && input.presentation?.kind === "cost-slots"
            ? [[input.id, [input.options[0]!.id]]]
            : [],
        ),
      ),
    },
    { gameId: "clash-play-qa", sourceAuthority: "server" },
  );
}

test("native play previews expose affordable sources without changing state", () => {
  const engine = createClashPlayFixture();
  const before = structuredClone(engine.state);
  const view = engine.getInteractionView("human");
  const available = availableInteractionCardIds(view);
  for (const name of ["Sonoro", "Magnate, Cunning Planner"]) {
    const card = resourceBoard(engine).cards.find((c) => c.zone === "hand" && c.name === name)!;
    expect(available.has(card.instanceId)).toBe(true);
  }
  const conquest = resourceBoard(engine).cards.find(
    (c) => c.zone === "hand" && c.name?.startsWith("Conquest"),
  )!;
  expect(view.actions.find((a) => a.id === `playCard:${conquest.instanceId}`)?.enabled).toBe(false);
  expect(available.has(conquest.instanceId)).toBe(false);
  expect(engine.state).toEqual(before);
});

test("play pays resources and resolves ready when neither player has a response", () => {
  const engine = createClashPlayFixture();
  const card = resourceBoard(engine).cards.find((c) => c.zone === "hand" && c.name === "Sonoro")!;
  expect(submit(engine, `playCard:${card.instanceId}`).success).toBe(true);
  const board = resourceBoard(engine);
  expect(board.cards.find((c) => c.instanceId === card.instanceId)).toMatchObject({
    zone: "clash",
    ready: true,
  });
  expect(
    board.cards.filter((c) => c.controller === "player-one" && c.zone === "resource" && c.ready),
  ).toHaveLength(1);
  expect(
    arenaLayout(board, "player-one", false, 0, 1050).find(
      (p) => p.card.instanceId === card.instanceId,
    ),
  ).toMatchObject({ hand: false });
  expect(engine.state.responseWindow).toBeNull();
  expect(board.standbyCount).toBe(0);
  expect(board.players["player-one"].handSize).toBe(3);
});

test("an unaffordable play is rejected without paying or moving the card", () => {
  const engine = createClashPlayFixture();
  const card = resourceBoard(engine).cards.find(
    (c) => c.zone === "hand" && c.name?.startsWith("Conquest"),
  )!;
  const before = structuredClone(engine.state);
  expect(submit(engine, `playCard:${card.instanceId}`).success).toBe(false);
  expect(engine.state).toEqual(before);
});

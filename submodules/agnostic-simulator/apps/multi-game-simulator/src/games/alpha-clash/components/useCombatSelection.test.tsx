// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import {
  InteractionWorkspace,
  useInteractionDraft,
  useInteractionSurface,
} from "@tcg/simulator-ui";
import { createAlphaClashPromptFixture } from "../prompt-fixtures";
import { fixtureAttack, fixturePassResponses } from "../native-fixture-test-actions";
import { useCombatSelection } from "./useCombatSelection";

afterEach(cleanup);

function Controls({ view, disabled = false }: { view: EngineInteractionView; disabled?: boolean }) {
  useCombatSelection(view, disabled);
  const draft = useInteractionDraft();
  const surface = useInteractionSurface(view);
  return (
    <>
      <output>{draft.active ? "Ready to select" : "Waiting"}</output>
      {[...surface.candidateIds].map((id) => (
        <button key={id} onClick={() => surface.select(id)}>
          {id}
        </button>
      ))}
      <button onClick={() => draft.clear()}>Clear</button>
      <button onClick={() => surface.confirm()}>Confirm</button>
      <output>{[...surface.selectedIds].join(",")}</output>
    </>
  );
}

function fixture() {
  const engine = createAlphaClashPromptFixture("prompt-foretell-draw-step");
  fixtureAttack(engine);
  fixturePassResponses(engine);
  const view = engine.getInteractionView("human");
  const input = view.actions.find((action) => action.id === "declareObstructors")!.inputs[0];
  if (input.kind !== "entity-selection") throw new Error("Expected native obstructors");
  return { engine, view, ids: input.candidates.map((candidate) => candidate.entity.instanceId) };
}

test("opens native obstruction selection without passing; multiple picks commit only on confirmation", () => {
  const { engine, view, ids } = fixture();
  const submit = vi.fn(
    (submission: InteractionSubmission) =>
      engine.submitInteraction("human", submission, {
        gameId: engine.state.id,
        sourceAuthority: "server",
      }).success,
  );
  render(
    <InteractionWorkspace view={view} viewerId="human" onSubmit={submit}>
      <Controls view={view} />
    </InteractionWorkspace>,
  );
  expect(screen.getByText("Ready to select")).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: ids[0] }));
  fireEvent.click(screen.getByRole("button", { name: ids[1] }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(submit.mock.calls[0][0].values.obstructorIds).toEqual(ids.slice(0, 2));
  expect(submit.mock.results[0].value).toBe(true);
});

test("clearing picks does not pass; explicit empty confirmation advances without obstructors", () => {
  const { engine, view, ids } = fixture();
  const submit = vi.fn(
    (submission: InteractionSubmission) =>
      engine.submitInteraction("human", submission, {
        gameId: engine.state.id,
        sourceAuthority: "server",
      }).success,
  );
  render(
    <InteractionWorkspace view={view} viewerId="human" onSubmit={submit}>
      <Controls view={view} />
    </InteractionWorkspace>,
  );
  fireEvent.click(screen.getByRole("button", { name: ids[0] }));
  fireEvent.click(screen.getByRole("button", { name: "Clear" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(submit.mock.calls[0][0].values.obstructorIds).toEqual([]);
  expect(submit.mock.results[0].value).toBe(true);
});

test("disabled views do not open a combat draft", () => {
  const { view } = fixture();
  const submit = vi.fn();
  render(
    <InteractionWorkspace view={view} viewerId="human" onSubmit={submit}>
      <Controls view={view} disabled />
    </InteractionWorkspace>,
  );
  expect(screen.getByText("Waiting")).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
});

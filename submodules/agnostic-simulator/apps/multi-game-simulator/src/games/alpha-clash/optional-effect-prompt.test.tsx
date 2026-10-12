import { fixtureAnswer } from "./native-fixture-test-actions";
import { fixtureAtOptionalChoice } from "./optional-effect-test-helpers";
// @vitest-environment jsdom
import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test, vi } from "vite-plus/test";
import { InteractionWorkspace, useInteractionSurface } from "@tcg/simulator-ui";
import type { EngineInteractionView } from "@tcg/protocol";
import { SharedInteractionPrompt } from "../../components/SharedInteractionPrompt";

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(cleanup);
function Prompt({ view }: { view: EngineInteractionView }) {
  const surface = useInteractionSurface(view);
  return (
    <SharedInteractionPrompt surface={surface} view={view} viewerId="human" cards={new Map()} />
  );
}
function mount(id: string, rejectOnce = false) {
  const engine = fixtureAtOptionalChoice(id);
  const submit = vi.fn();
  let reject = rejectOnce;
  function Fixture() {
    const [, refresh] = useState(0);
    const view = engine.getInteractionView("human");
    return (
      <MantineProvider>
        <InteractionWorkspace
          view={view}
          viewerId="human"
          onSubmit={(answer) => {
            submit(answer);
            if (reject) {
              reject = false;
              return false;
            }
            const result = engine.submitInteraction("human", answer, {
              gameId: "prompt-test",
              sourceAuthority: "server",
            });
            if (result.success) refresh((n) => n + 1);
            return result.success;
          }}
        >
          <Prompt view={view} />
        </InteractionWorkspace>
      </MantineProvider>
    );
  }
  render(<Fixture />);
  return { engine, submit };
}
test("Use opens Wrath's dependent selection under reduced motion; mandatory resolution cannot be cancelled", () => {
  const { engine } = mount("optional-wrath");
  expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Use" }));
  expect(engine.state.pendingChoices[0]?.kind).toBe("target");
  expect(screen.queryByRole("button", { name: "Decline" })).toBeNull();
});
test("Decline resolves Restore with no pile movement", () => {
  const { engine, submit } = mount("optional-restore");
  const deck = [...engine.state.deckOrder["player-one"]];
  fireEvent.click(screen.getByRole("button", { name: "Decline" }));
  expect(submit.mock.calls[0][0].values).toEqual({ confirm: false });
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.state.deckOrder["player-one"]).toEqual(deck);
});
test("rejected Use remains retryable without changing native state", () => {
  const { engine, submit } = mount("optional-temper", true);
  const before = structuredClone(engine.state);
  fireEvent.click(screen.getByRole("button", { name: "Use" }));
  expect(engine.state).toEqual(before);
  fireEvent.click(screen.getByRole("button", { name: "Retry choice" }));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(engine.state.pendingChoices).toHaveLength(0);
});

test("Wrath picker close preserves a real Dragon draft until explicit confirmation", () => {
  const engine = fixtureAtOptionalChoice("optional-wrath-two-dragons");
  fixtureAnswer(engine, { confirm: true });
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const input = action.inputs.find((i) => i.kind === "entity-selection");
  if (input?.kind !== "entity-selection") throw new Error("Missing native Dragon choice");
  const ids = input.candidates.map((c) => c.entity.instanceId!);
  const submit = vi.fn(
    (answer) =>
      engine.submitInteraction("human", answer, {
        gameId: engine.state.id,
        sourceAuthority: "server",
      }).success,
  );
  function PickerSurface() {
    const [open, setOpen] = useState(false);
    const surface = useInteractionSurface(view, { visibleEntityIds: new Set(ids) });
    return (
      <>
        <button onClick={() => setOpen(true)}>Open picker</button>
        {open ? (
          <>
            <button onClick={() => surface.select(ids[0])}>First Dragon</button>
            <button onClick={() => surface.select(ids[1])}>Second Dragon</button>
            <button onClick={() => setOpen(false)}>Done</button>
          </>
        ) : (
          <SharedInteractionPrompt
            surface={surface}
            view={view}
            viewerId="human"
            cards={new Map()}
            autoSubmitSingleTarget
            confirmOnBoard
          />
        )}
        <button onClick={surface.confirm} disabled={!surface.canConfirm}>
          Confirm board choice
        </button>
      </>
    );
  }
  render(
    <MantineProvider>
      <InteractionWorkspace view={view} viewerId="human" onSubmit={submit}>
        <PickerSurface />
      </InteractionWorkspace>
    </MantineProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Open picker" }));
  fireEvent.click(screen.getByRole("button", { name: "Second Dragon" }));
  fireEvent.click(screen.getByRole("button", { name: "First Dragon" }));
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(submit).not.toHaveBeenCalled();
  expect(engine.state.cards[ids[0]].zone).toBe("hand");
  expect(engine.state.cards[ids[1]].zone).toBe("hand");
  fireEvent.click(screen.getByRole("button", { name: "Confirm board choice" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(engine.state.cards[ids[0]].zone).toBe("deck");
  expect(engine.state.cards[ids[1]].zone).toBe("hand");
  expect(engine.state.deckOrder["player-one"].at(-1)).toBe(ids[0]);
});

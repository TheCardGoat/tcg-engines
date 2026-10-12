import { MantineProvider } from "@mantine/core";
import { act, cleanup, fireEvent, render, screen, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { InteractionDraftProvider, useInteractionDraft } from "@tcg/simulator-ui";
import { createCostRouteFixture } from "../cost-route-fixture";
import { resourceBoard } from "../resource-step-fixture";
import { RetryErrorReset } from "./RetryErrorReset";
import { CostRouteControl } from "./CostRouteControl";
import { useCostRouteSound } from "./useCostRouteSound";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({ playSimulatorSound: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("changing route clears payment slots; cancel and retry do not alter native state", () => {
  const engine = createCostRouteFixture("prompt-cost-routes");
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.inputs.some((i) => i.id === "costRoute"))!;
  let draft: ReturnType<typeof useInteractionDraft>;
  function Probe() {
    draft = useInteractionDraft();
    return <CostRouteControl view={view} />;
  }
  const submit = vi.fn(() => false);
  const before = structuredClone(engine.state);
  render(
    <MantineProvider>
      <InteractionDraftProvider view={view} onSubmit={submit}>
        <Probe />
      </InteractionDraftProvider>
    </MantineProvider>,
  );
  act(() => draft.begin(action.id));
  act(() => draft.change("costRoute", ["alternative"]));
  act(() => draft.change("alternatePayment:0", ["payment-card"]));
  act(() => draft.change("costResources", ["resource-card|white"]));
  fireEvent.click(screen.getByRole("button", { name: /^Normal$/ }));
  expect(draft!.values).toEqual({ costRoute: ["normal"] });
  act(() => draft.cancel());
  expect(draft!.values).toEqual({});
  act(() => draft.begin(action.id));
  expect(draft!.values).toEqual({});
  expect(submit).not.toHaveBeenCalled();
  expect(engine.state).toEqual(before);
});

test("payment sound follows native commit and respects mute; selection and rejection are silent", () => {
  const engine = createCostRouteFixture("prompt-cost-routes");
  const board = resourceBoard(engine);
  const source = board.cards.find((c) => c.definitionId === "ac-ac2-014")!;
  const draft = {
    actionId: `playCard:${source.instanceId}`,
    values: { costRoute: ["normal"], costResources: ["r|white"] },
  };
  const { rerender } = renderHook(
    (props) => useCostRouteSound(props.draft, props.board, props.version, props.sound),
    {
      initialProps: { draft, board, version: 0, sound: true },
    },
  );
  expect(playSimulatorSound).not.toHaveBeenCalled();
  rerender({ draft, board, version: 0, sound: true });
  expect(playSimulatorSound).not.toHaveBeenCalled();
  const committed = {
    ...board,
    cards: board.cards.map((c) =>
      c.instanceId === source.instanceId ? { ...c, zone: "standby" as const } : c,
    ),
  };
  rerender({ draft, board: committed, version: 1, sound: true });
  expect(playSimulatorSound).toHaveBeenCalledExactlyOnceWith("resource.spend");
  rerender({ draft, board: committed, version: 2, sound: false });
  expect(playSimulatorSound).toHaveBeenCalledTimes(1);
});

test("rejection messages clear after payment changes and cancellation", () => {
  const engine = createCostRouteFixture("prompt-cost-routes");
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.inputs.some((i) => i.id === "costRoute"))!;
  const slotInput = action.inputs.find(
    (i) => i.id === "costResources" && i.kind === "option-selection",
  );
  if (slotInput?.kind !== "option-selection") throw new Error("Missing cost slots");
  const full = slotInput.options.slice(0, slotInput.min).map((option) => option.id);
  let draft: ReturnType<typeof useInteractionDraft>;
  const clear = vi.fn();
  function Probe() {
    draft = useInteractionDraft();
    return <RetryErrorReset onClear={clear} />;
  }
  render(
    <InteractionDraftProvider view={view} onSubmit={() => false}>
      <Probe />
    </InteractionDraftProvider>,
  );
  act(() => draft.begin(action.id));
  act(() => draft.change("costRoute", ["normal"]));
  act(() => draft.change("costResources", full));
  act(() => draft.confirmCurrent());
  expect(draft!.submissionRejected).toBe(true);
  expect(clear).not.toHaveBeenCalled();
  act(() => draft.change("costRoute", ["alternative"]));
  expect(clear).toHaveBeenCalledTimes(1);
  act(() => draft.change("costRoute", ["normal"]));
  act(() => draft.change("costResources", full));
  act(() => draft.confirmCurrent());
  expect(draft!.submissionRejected).toBe(true);
  act(() => draft.cancel());
  expect(clear).toHaveBeenCalledTimes(2);
});

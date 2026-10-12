import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import {
  BoardTargetHandles,
  replaceBoardTarget,
  InteractionWorkspace,
  useInteractionDraft,
  useInteractionSurface,
} from "@tcg/simulator-ui";
import { createAlphaClashPromptFixture } from "./prompt-fixtures";
import { labelAlphaClashInteractions } from "./components/AlphaClashInteractions";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";

afterEach(cleanup);
const anchors = ["a", "b", "c"].map((id, index) => ({
  id,
  left: index * 100,
  top: 50,
  width: 80,
  height: 100,
}));
test("ordered marker keeps its DOM identity and slot when moved; duplicate and illegal targets are rejected", () => {
  const legal = new Set(["a", "b", "c"]);
  expect(replaceBoardTarget(["a", "b"], 0, "b", legal)).toBeUndefined();
  expect(replaceBoardTarget(["a", "b"], 0, "hidden", legal)).toBeUndefined();
  expect(replaceBoardTarget(["a", "b"], 0, "c", legal)).toEqual(["c", "b"]);
  const props = {
    anchors,
    ordered: true,
    reducedMotion: true,
    activeSlot: null,
    onActivate: vi.fn(),
    onRetarget: vi.fn(),
  };
  const view = render(<BoardTargetHandles {...props} selectedIds={["a", "b"]} />);
  const first = screen.getByRole("button", { name: "Change target 1" });
  expect(first.textContent).toBe("1");
  view.rerender(<BoardTargetHandles {...props} selectedIds={["c", "b"]} />);
  expect(screen.getByRole("button", { name: "Change target 1" })).toBe(first);
  expect(first.style.left).toBe("218px");
  expect(first.parentElement?.dataset.reducedMotion).toBe("true");
  fireEvent.keyDown(first, { key: "Escape" });
  expect(props.onActivate).toHaveBeenCalledWith(null);
});

function Controls({
  view,
  actionId,
  ids,
}: {
  view: EngineInteractionView;
  actionId: string;
  ids: string[];
}) {
  const draft = useInteractionDraft();
  const surface = useInteractionSurface(view, { visibleEntityIds: new Set(ids) });
  return (
    <>
      <button onClick={() => draft.begin(actionId)}>Start</button>
      {ids.map((id) => (
        <button key={id} onClick={() => surface.select(id)}>
          {id}
        </button>
      ))}
      <button onClick={surface.cancel}>Cancel</button>
      <button onClick={surface.confirm}>Confirm</button>
      <button onClick={surface.retry}>Retry</button>
      <output>{[...surface.selectedIds].join(",")}</output>
    </>
  );
}
test("native single-target declaration submits on selection and accepts a re-pick after a rejection", () => {
  const engine = createAlphaClashPromptFixture("prompt-target-change");
  const played = engine
    .getInteractionView("human")
    .actions.find((action) => action.id.startsWith("playCard:"))!;
  // The play carries the explicit resource-payment input; auto-pay the first
  // legal option so the card enters Standby and the trigger prompt appears.
  const paymentOption = played.inputs.flatMap((input) =>
    input.kind === "option-selection" && input.id === "resourcePayment"
      ? input.options.map((option) => option.id)
      : [],
  )[0]!;
  engine.submitInteraction(
    "human",
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: engine.getInteractionView("human").stateVersion,
      requestId: played.requestId,
      actionId: played.id,
      values: { resourcePayment: [paymentOption] },
    },
    { gameId: "target-handles", sourceAuthority: "server" },
  );
  for (
    let n = 0;
    n < 20 && engine.state.responseWindow && !engine.state.pendingChoices.length;
    n++
  ) {
    const actor = engine.getActivePlayerId()!;
    const next = engine.getInteractionView(actor);
    const pass = next.actions.find((entry) => entry.enabled && entry.intent === "pass")!;
    engine.submitInteraction(
      actor,
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: next.stateVersion,
        requestId: pass.requestId,
        actionId: pass.id,
        values: {},
      },
      { gameId: "target-handles", sourceAuthority: "server" },
    );
  }
  const view = labelAlphaClashInteractions(engine.getInteractionView("human"), (id) => id);
  const action = view.actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
  const input = action.inputs[0]!;
  if (input.kind !== "entity-selection") throw new Error("Expected targets");
  const ids = input.candidates.map((candidate) => candidate.entity.instanceId);
  const submit = vi.fn().mockReturnValueOnce(false).mockReturnValue(true);
  render(
    <InteractionWorkspace view={view} viewerId="human" onSubmit={submit}>
      <Controls view={view} actionId={action.id} ids={ids} />
    </InteractionWorkspace>,
  );
  // A single required target submits the moment it is selected.
  fireEvent.click(screen.getByText("Start"));
  fireEvent.click(screen.getByText(ids[0], { selector: "button" }));
  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit.mock.calls[0][0].values.selection).toEqual([ids[0]]);
  // A rejection leaves the declaration open: picking the other candidate
  // resubmits with the new target instead of locking the draft.
  fireEvent.click(screen.getByText(ids[1], { selector: "button" }));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(submit.mock.calls[1][0].values.selection).toEqual([ids[1]]);
});

test("pointer retarget does not activate a second change; Escape cancels a held drag", () => {
  const retarget = vi.fn().mockReturnValue(true);
  const activate = vi.fn();
  render(
    <BoardTargetHandles
      anchors={anchors}
      selectedIds={["a"]}
      ordered={false}
      reducedMotion={false}
      activeSlot={null}
      onActivate={activate}
      onRetarget={retarget}
    />,
  );
  const handle = screen.getByRole("button", { name: "Change target 1" });
  const target = document.createElement("button");
  target.dataset.boardTargetId = "c";
  Object.defineProperty(handle, "setPointerCapture", { value: vi.fn() });
  Object.defineProperty(document, "elementsFromPoint", {
    configurable: true,
    value: () => [target],
  });
  fireEvent.pointerDown(handle, { pointerId: 1 });
  fireEvent.pointerUp(handle, { pointerId: 1 });
  fireEvent.click(handle);
  expect(retarget).toHaveBeenCalledWith(0, "c");
  expect(activate).not.toHaveBeenCalled();
  retarget.mockClear();
  fireEvent.pointerDown(handle, { pointerId: 2 });
  fireEvent.keyDown(handle, { key: "Escape" });
  fireEvent.pointerUp(handle, { pointerId: 2 });
  expect(retarget).not.toHaveBeenCalled();
});

// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { cleanup, fireEvent, render } from "@testing-library/react";

import type { ProtocolTargetSelection } from "../../game/index.ts";
import { usePendingEffectSelectionModel } from "./pending-effect-selection-context.tsx";

const groupedSelection: ProtocolTargetSelection = {
  actionId: "resolveEffect",
  pendingEffectId: "effect-grouped",
  targetGroups: [
    {
      inputId: "targetGroups.0",
      targetIds: ["superpower-1", "superpower-2"],
      minTargets: 1,
      maxTargets: 1,
    },
    {
      inputId: "targetGroups.1",
      targetIds: ["un-1"],
      minTargets: 1,
      maxTargets: 1,
    },
  ],
  targetIds: ["superpower-1", "superpower-2", "un-1"],
  minTargets: 2,
  maxTargets: 2,
};

const overlappingSelection: ProtocolTargetSelection = {
  ...groupedSelection,
  targetGroups: [
    {
      inputId: "targetGroups.0",
      targetIds: ["dual-1", "dual-2", "superpower-only"],
      minTargets: 1,
      maxTargets: 1,
    },
    {
      inputId: "targetGroups.1",
      targetIds: ["dual-1", "dual-2"],
      minTargets: 1,
      maxTargets: 1,
    },
  ],
  targetIds: ["dual-1", "dual-2", "superpower-only"],
};

afterEach(cleanup);

describe("pending effect grouped target selection", () => {
  it("blocks a second target from the same full group and remains incomplete", () => {
    const view = render(<SelectionProbe selection={groupedSelection} />);

    fireEvent.click(view.getByRole("button", { name: "Select superpower-1" }));
    fireEvent.click(view.getByRole("button", { name: "Select superpower-2" }));

    expect(view.getByTestId("selected-targets").textContent).toBe("superpower-1");
    expect(view.getByTestId("selection-complete").textContent).toBe("false");
  });

  it("becomes complete after selecting one candidate from each ordered group", () => {
    const view = render(<SelectionProbe selection={groupedSelection} />);

    fireEvent.click(view.getByRole("button", { name: "Select superpower-2" }));
    fireEvent.click(view.getByRole("button", { name: "Select un-1" }));

    expect(view.getByTestId("selected-targets").textContent).toBe("superpower-2,un-1");
    expect(view.getByTestId("selection-complete").textContent).toBe("true");
  });

  it("lets two overlapping candidates satisfy different printed groups", () => {
    const view = render(<SelectionProbe selection={overlappingSelection} />);

    fireEvent.click(view.getByRole("button", { name: "Select dual-1" }));
    fireEvent.click(view.getByRole("button", { name: "Select dual-2" }));

    expect(view.getByTestId("selected-targets").textContent).toBe("dual-1,dual-2");
    expect(view.getByTestId("selection-complete").textContent).toBe("true");
  });

  it("keeps a flexible candidate available for the group a single-trait card cannot satisfy", () => {
    const view = render(<SelectionProbe selection={overlappingSelection} />);

    fireEvent.click(view.getByRole("button", { name: "Select dual-1" }));
    fireEvent.click(view.getByRole("button", { name: "Select superpower-only" }));

    expect(view.getByTestId("selected-targets").textContent).toBe("dual-1,superpower-only");
    expect(view.getByTestId("selection-complete").textContent).toBe("true");
  });
});

function SelectionProbe({ selection }: { readonly selection: ProtocolTargetSelection }) {
  const model = usePendingEffectSelectionModel(selection);
  return (
    <>
      <output data-testid="selected-targets">{model.selectedTargetIds.join(",")}</output>
      <output data-testid="selection-complete">{String(model.isComplete)}</output>
      {selection.targetIds.map((cardId) => (
        <button key={cardId} type="button" onClick={() => model.selectTarget(cardId)}>
          Select {cardId}
        </button>
      ))}
    </>
  );
}

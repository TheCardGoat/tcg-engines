// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { DefaultSimulatorEntityVisual, SimulatorEntityVisualProvider } from "@tcg/simulator-ui";

import { DiscardSlot } from "../../components/ui/playerSeat/DiscardSlot.tsx";
import type { GameCardData } from "../../components/ui/types.ts";

afterEach(() => cleanup());

describe("DiscardSlot", () => {
  it("renders the top card face-up when topCard is provided", () => {
    const card: GameCardData = {
      id: "trash-1",
      name: "Discarded Unit",
      set: "ST01",
      cardNumber: "ST01-001",
    };

    renderWithEntityVisual(<DiscardSlot count={1} topCard={card} isTop={false} />);

    // GameCard's CardFace renders <img alt={card.name}> when set+cardNumber
    // are present — presence of the alt text proves the face-up path ran.
    expect(screen.getByAltText("Discarded Unit")).not.toBeNull();
    // Count badge appears with the zero-padded count.
    expect(screen.getByText("01")).not.toBeNull();
    expect(screen.getByLabelText("TRASH, 1 card").dataset.zoneLayout).toBe("discard-pile");
  });

  it("keeps the shared pile footprint when topCard is null", () => {
    renderWithEntityVisual(<DiscardSlot count={0} topCard={null} isTop={false} />);

    const emptyPile = screen.getByLabelText("TRASH, 0 cards");
    expect(emptyPile.dataset.zoneLayout).toBe("discard-pile");
    expect(emptyPile.className).toContain("min-h-[118px]");
    expect(emptyPile.className).toContain("w-[78px]");
    // No count badge when count is 0.
    expect(screen.queryByText("00")).toBeNull();
  });

  it("opens a Trash dialog with every public card in the pile", () => {
    const olderCard: GameCardData = {
      id: "trash-older",
      name: "Older Card",
      set: "ST01",
      cardNumber: "ST01-002",
    };
    const topCard: GameCardData = {
      id: "trash-top",
      name: "Top Card",
      set: "ST01",
      cardNumber: "ST01-003",
    };

    renderWithEntityVisual(
      <DiscardSlot count={2} topCard={topCard} cards={[olderCard, topCard]} isTop={false} />,
    );

    fireEvent.click(screen.getByAltText("Top Card").closest("button")!);

    expect(screen.getByRole("dialog", { name: "TRASH · 2" })).not.toBeNull();
    expect(screen.getByText("TRASH · 2")).not.toBeNull();
    expect(screen.getByAltText("Older Card")).not.toBeNull();
  });

  it("shows the count badge over the empty placeholder when count > 0 but no topCard", () => {
    // Defensive: if the trash has cards but the top card data didn't plumb
    // through, the slot should still surface the count so the UI isn't silent.
    renderWithEntityVisual(<DiscardSlot count={3} topCard={null} isTop={true} />);

    expect(screen.getByLabelText("TRASH, 3 cards").dataset.zoneLayout).toBe("discard-pile");
    expect(screen.getByText("03")).not.toBeNull();
  });
});

function renderWithEntityVisual(node: ReactNode) {
  return render(
    <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
      {node}
    </SimulatorEntityVisualProvider>,
  );
}

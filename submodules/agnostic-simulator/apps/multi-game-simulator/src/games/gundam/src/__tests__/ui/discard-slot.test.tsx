// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { cleanup, render, screen } from "@testing-library/react";

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

    render(<DiscardSlot count={1} topCard={card} isTop={false} />);

    // GameCard's CardFace renders <img alt={card.name}> when set+cardNumber
    // are present — presence of the alt text proves the face-up path ran.
    expect(screen.getByAltText("Discarded Unit")).not.toBeNull();
    // Count badge appears with the zero-padded count.
    expect(screen.getByText("01")).not.toBeNull();
    // Empty-state placeholder must NOT be rendered alongside the card.
    expect(screen.queryByText("✕")).toBeNull();
  });

  it("renders the empty placeholder when topCard is null", () => {
    render(<DiscardSlot count={0} topCard={null} isTop={false} />);

    expect(screen.getByText("✕")).not.toBeNull();
    // No count badge when count is 0.
    expect(screen.queryByText("00")).toBeNull();
  });

  it("shows the count badge over the empty placeholder when count > 0 but no topCard", () => {
    // Defensive: if the trash has cards but the top card data didn't plumb
    // through, the slot should still surface the count so the UI isn't silent.
    render(<DiscardSlot count={3} topCard={null} isTop={true} />);

    expect(screen.getByText("✕")).not.toBeNull();
    expect(screen.getByText("03")).not.toBeNull();
  });
});

// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { ZoneCardModal } from "./ZoneCardModal.tsx";

afterEach(cleanup);

describe("public zone card inspection", () => {
  it("distinguishes ready and rested resources in the gallery", () => {
    render(
      <ZoneCardModal
        open
        onOpenChange={() => undefined}
        label="Resource area"
        emptyLabel="No cards"
        cards={[
          { id: "ready-resource", name: "Resource", cardType: "resource", exerted: false },
          { id: "rested-resource", name: "Resource", cardType: "resource", exerted: true },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Inspect Resource · READY" }).textContent).toContain(
      "READY",
    );
    expect(screen.getByRole("button", { name: "Inspect Resource · RESTED" }).textContent).toContain(
      "RESTED",
    );
  });

  it("reads a card, returns focus to its gallery button, and closes the zone", async () => {
    function Gallery() {
      const [open, setOpen] = useState(true);
      return (
        <ZoneCardModal
          open={open}
          onOpenChange={setOpen}
          label="Trash"
          emptyLabel="No cards"
          cards={[
            {
              id: "public-card",
              name: "Test Unit",
              cardType: "unit",
              cost: 2,
              level: 3,
              effect: "When this Unit enters the battle area, draw 1 card.",
            },
          ]}
        />
      );
    }
    render(<Gallery />);
    const card = screen.getByRole("button", { name: "Inspect Test Unit" });
    fireEvent.click(card);
    expect(screen.getByText("When this Unit enters the battle area, draw 1 card.")).toBeTruthy();
    const back = screen.getByRole("button", { name: /Back to Trash/ });
    expect(document.activeElement).toBe(back);
    fireEvent.click(back);
    await waitFor(() => expect(document.activeElement).toBe(card));
    expect(screen.queryByText("When this Unit enters the battle area, draw 1 card.")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog", { name: "Trash" })).toBeNull();
  });
});

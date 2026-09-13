import { testFabArt } from "./presentation-test-provider";
const { resolveFabCardArt } = testFabArt;
import { FabPresentationTestProvider } from "./presentation-test-provider";
// @vitest-environment jsdom
import { cleanup, fireEvent, render as renderRaw, screen, within } from "@testing-library/react";
import type { OrderingInput } from "@tcg/protocol";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FabPitchStackOrderingPanel } from "./FabPitchStackOrderingPanel";

afterEach(cleanup);

function orderingInput(labels: readonly string[]): OrderingInput {
  return {
    id: "answer",
    text: { key: "Order pitched cards" },
    kind: "ordering",
    entityKind: "card",
    min: labels.length,
    max: labels.length,
    candidates: labels.map((label, index) => ({
      entity: { kind: "card", instanceId: `pitch-${index + 1}` },
      text: { key: label },
      enabled: true,
    })),
  };
}

describe("FabPitchStackOrderingPanel", () => {
  it("builds future draw order one click at a time and auto-places the forced last card", () => {
    const onComplete = vi.fn();
    render(
      <FabPitchStackOrderingPanel
        input={orderingInput(["Alpha", "Bravo", "Charlie", "Delta"])}
        onComplete={onComplete}
      />,
    );

    const panel = screen.getByTestId("fab-pitch-order-panel");
    expect(within(panel).queryByRole("button", { name: /confirm/i })).toBeNull();

    fireEvent.click(
      within(panel).getByRole("button", {
        name: "Choose Bravo as the first pitched card drawn",
      }),
    );
    expect(within(panel).getByText("Draw first")).not.toBeNull();
    expect(within(panel).getByRole("status").textContent).toContain("Bravo will be the first");

    fireEvent.click(
      within(panel).getByRole("button", {
        name: "Choose Delta as the second pitched card drawn",
      }),
    );
    fireEvent.click(
      within(panel).getByRole("button", {
        name: "Choose Alpha as the third pitched card drawn",
      }),
    );

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith(["pitch-2", "pitch-4", "pitch-1", "pitch-3"]);
  });

  it("completes a two-card pitch stack with one click", () => {
    const onComplete = vi.fn();
    render(
      <FabPitchStackOrderingPanel
        input={orderingInput(["Alpha", "Bravo"])}
        onComplete={onComplete}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Choose Bravo as the first pitched card drawn" }),
    );
    expect(onComplete).toHaveBeenCalledWith(["pitch-2", "pitch-1"]);
  });

  it("auto-sorts the pitch stack in the harness's as-pitched order", () => {
    const onComplete = vi.fn();
    render(
      <FabPitchStackOrderingPanel
        input={orderingInput(["Alpha", "Bravo", "Charlie", "Delta"])}
        onComplete={onComplete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Auto-sort pitch stack in pitched order" }));

    // The panel presents future draw order, the reverse of the engine's
    // deepest-first pitch-order decision candidates.
    expect(onComplete).toHaveBeenCalledWith(["pitch-4", "pitch-3", "pitch-2", "pitch-1"]);
    expect(screen.getByRole("status").textContent).toContain("sorted in the order");
  });

  it("opens the ordering explanation from a real button for touch and keyboard users", () => {
    render(
      <FabPitchStackOrderingPanel
        input={orderingInput(["Alpha", "Bravo"])}
        onComplete={() => {}}
      />,
    );

    const help = screen.getByRole("button", { name: "Explain pitch-stack draw order" });
    expect(help.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(help);
    expect(help.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(/First picked draws first/).textContent).toContain(
      "The final card is placed automatically",
    );
  });

  it("lets the player undo a partial draw order before it is complete", () => {
    const onComplete = vi.fn();
    render(
      <FabPitchStackOrderingPanel
        input={orderingInput(["Alpha", "Bravo", "Charlie", "Delta"])}
        onComplete={onComplete}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Choose Charlie as the first pitched card drawn" }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Remove Charlie from position 1 in the pitch-stack draw order",
      }),
    );

    expect(
      screen.getByRole("button", { name: "Choose Charlie as the first pitched card drawn" }),
    ).not.toBeNull();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("resolves each card's art through its chosen printing identity", async () => {
    const buckwildIdentity = {
      canonicalId: "tCkMg9kPCkhTDTbJkdHjB",
      printingId: "pzMPggLDLGfBLcqPzbH6R",
    } as const;
    const expectedBoardImage = resolveFabCardArt(buckwildIdentity).boardImageUrl;
    expect(expectedBoardImage).toBeDefined();

    render(
      <FabPitchStackOrderingPanel
        input={orderingInput(["Buckwild", "Unknown candidate"])}
        identityForCard={(instanceId) =>
          instanceId === "pitch-1" ? buckwildIdentity : { canonicalId: "canon-bravo" }
        }
        onComplete={() => {}}
      />,
    );

    const images = document.querySelectorAll(".fab-pitch-order-art img");
    expect(images).toHaveLength(1);
    expect(images[0]!.getAttribute("src")).toBe(expectedBoardImage);
    // Without a chosen printing the panel falls back to the letter label.
    expect(document.querySelectorAll(".fab-pitch-order-art span")).toHaveLength(1);
    expect(document.querySelector(".fab-pitch-order-art span")?.textContent).toBe("Un");
  });
});

function render(ui: Parameters<typeof renderRaw>[0]) {
  return renderRaw(ui, { wrapper: FabPresentationTestProvider });
}

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactNode } from "react";
import { DefaultSimulatorEntityVisual, SimulatorEntityVisualProvider } from "@tcg/simulator-ui";

import { ResourceAreaRow } from "../../components/ui/playerSeat/ResourceAreaRow.tsx";
import type { GameCardData, PlayerInfo } from "../../components/ui/types.ts";

/**
 * `useLayoutMode` reads `window.innerWidth`. jsdom defaults to 1024 (=
 * "desktop") which would route past the new MobileZoneStrip code path.
 * Force a phone viewport before each test, then dispatch the resize so
 * the hook's listener flips state to "mobile".
 */
function setMobileViewport(width = 360) {
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
  Object.defineProperty(window, "innerHeight", { value: 740, configurable: true, writable: true });
  window.dispatchEvent(new Event("resize"));
}

afterEach(() => cleanup());

describe("ResourceAreaRow · mobile zone strip", () => {
  beforeEach(() => {
    setMobileViewport();
  });

  function renderStrip(
    opts: {
      discard?: readonly GameCardData[];
      removalArea?: readonly GameCardData[];
      trashCount?: number;
    } = {},
  ) {
    const player: PlayerInfo = {
      name: "player_one",
      deck: 30,
      resourceDeck: 9,
      discard: opts.trashCount ?? opts.discard?.length ?? 0,
      shields: 6,
    };
    return renderWithEntityVisual(
      <ResourceAreaRow
        side="bottom"
        player={player}
        resourceArea={[]}
        discard={opts.discard ?? []}
        removalArea={opts.removalArea}
        availableResources={2}
        utilityColumn={<div data-testid="utility-column">EX base</div>}
      />,
    );
  }

  it("exposes legal Resource targets as touch-sized buttons", async () => {
    const user = userEvent.setup();
    const onResourceCardClick = vi.fn();
    const restedResource: GameCardData = {
      id: "resource-rested",
      name: "Resource",
      cardType: "resource",
      exerted: true,
    };
    const readyResource: GameCardData = {
      id: "resource-ready",
      name: "Resource",
      cardType: "resource",
      exerted: false,
    };

    renderWithEntityVisual(
      <ResourceAreaRow
        side="bottom"
        player={{ name: "player_one", deck: 30, discard: 0, shields: 6 }}
        resourceArea={[restedResource, readyResource]}
        discard={[]}
        availableResources={1}
        highlightCardIds={[restedResource.id!]}
        onResourceCardClick={onResourceCardClick}
        utilityColumn={<div>EX base</div>}
      />,
    );

    await act(async () => {
      await Promise.resolve();
    });

    const target = screen.getByRole("button", { name: "Resource 1, rested" });
    expect(target.className).toContain("min-h-[44px]");
    expect(target.dataset.targetingState).toBe("candidate");
    expect(screen.queryByRole("button", { name: "Resource 2, active" })).toBeNull();

    await user.click(target);
    expect(onResourceCardClick).toHaveBeenCalledOnce();
    expect(onResourceCardClick).toHaveBeenCalledWith(restedResource.id);
  });

  it("renders the official area names and no trash sheet by default", async () => {
    renderStrip({ discard: [{ id: "d1", name: "Junked", set: "ST01", cardNumber: "ST01-001" }] });

    // Wait for the layout-mode effect to flip to "mobile" post-mount.
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText("DECK")).not.toBeNull();
    expect(screen.getByLabelText("RESOURCE DECK AREA, 9 cards remaining")).not.toBeNull();
    expect(screen.getByText("TRASH")).not.toBeNull();
    expect(screen.getByRole("button", { name: /READY \/ LEVEL/ })).not.toBeNull();
    const core = screen.getByText("DECK").closest("[data-seat-row='resources']");
    expect(core).not.toBeNull();
    expect(core?.className).toContain(
      "grid-cols-[minmax(148px,1.4fr)_minmax(80px,.9fr)_minmax(76px,.8fr)]",
    );
    expect(
      core?.querySelectorAll("[data-zone-group='base-and-shields'], [data-zone-group='piles']"),
    ).toHaveLength(2);
    expect(screen.getByTestId("utility-column").closest("[data-zone-group]")).not.toBeNull();
    // The trash sheet shouldn't be in the DOM until the chip is clicked.
    expect(screen.queryByText(/TRASH\s+·\s+\d+/)).toBeNull();
  });

  it("opens the trash sheet when the TRASH chip is clicked, then closes via the ✕ button", async () => {
    const user = userEvent.setup();
    const card: GameCardData = {
      id: "d1",
      name: "Junked Unit",
      set: "ST01",
      cardNumber: "ST01-001",
    };
    renderStrip({ discard: [card] });

    await act(async () => {
      await Promise.resolve();
    });

    // The TRASH chip is the second chip in the strip; it's the only one
    // that's enabled when discard.length > 0.
    const trashChip = screen.getByText("TRASH").closest("button");
    expect(trashChip).not.toBeNull();
    await user.click(trashChip!);

    // Sheet header surfaces the discard label + card count.
    expect(screen.getByText(/TRASH\s+·\s+1/)).not.toBeNull();
    // The card itself renders inside the sheet.
    expect(within(screen.getByRole("dialog")).getByAltText("Junked Unit")).not.toBeNull();

    // ✕ close button (DialogPrimitive.Close) dismisses the sheet.
    await user.click(screen.getByLabelText("Close"));
    expect(screen.queryByText(/TRASH\s+·\s+1/)).toBeNull();
  });

  it("does not open the sheet when the discard pile is empty", async () => {
    const user = userEvent.setup();
    renderStrip({ discard: [], trashCount: 0 });

    await act(async () => {
      await Promise.resolve();
    });

    const trashChip = screen.getByText("TRASH").closest("button");
    expect(trashChip).not.toBeNull();
    expect((trashChip as HTMLButtonElement).disabled).toBe(true);

    // Click is a no-op when disabled — sheet must not appear.
    await user.click(trashChip!);
    expect(screen.queryByText(/TRASH\s+·\s+\d+/)).toBeNull();
  });

  it("adds an inspectable removal area only when cards were exiled", async () => {
    const user = userEvent.setup();
    renderStrip({
      removalArea: [
        { id: "exiled-1", name: "Exiled Command", set: "GD05", cardNumber: "GD05-130" },
      ],
    });

    await act(async () => {
      await Promise.resolve();
    });

    const removalArea = screen.getByRole("button", { name: "REMOVAL AREA, 1 cards" });
    expect(removalArea.dataset.simZoneId).toBe("removalArea:player_one");
    expect(removalArea.closest("[data-zone-group='piles']")?.className).toContain("grid-rows-2");
    await user.click(removalArea);
    expect(within(screen.getByRole("dialog")).getByAltText("Exiled Command")).not.toBeNull();
  });
});

function renderWithEntityVisual(node: ReactNode) {
  return render(
    <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
      {node}
    </SimulatorEntityVisualProvider>,
  );
}

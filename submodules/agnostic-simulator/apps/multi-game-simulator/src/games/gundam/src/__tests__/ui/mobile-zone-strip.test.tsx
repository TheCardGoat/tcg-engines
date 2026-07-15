// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vite-plus/test";
import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

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

  function renderStrip(opts: { discard?: readonly GameCardData[]; trashCount?: number } = {}) {
    const player: PlayerInfo = {
      name: "player_one",
      deck: 30,
      discard: opts.trashCount ?? opts.discard?.length ?? 0,
      shields: 6,
    };
    return render(
      <ResourceAreaRow
        side="bottom"
        player={player}
        resourceArea={[]}
        discard={opts.discard ?? []}
        availableResources={2}
      />,
    );
  }

  it("renders the deck / scrap / res chips and no sheet by default", async () => {
    renderStrip({ discard: [{ id: "d1", name: "Junked", set: "ST01", cardNumber: "ST01-001" }] });

    // Wait for the layout-mode effect to flip to "mobile" post-mount.
    await act(async () => {
      await Promise.resolve();
    });

    // Three chip labels — DEPLOY (deck), SCRAP (discard), RES (resources).
    expect(screen.getByText("DEPLOY")).not.toBeNull();
    expect(screen.getByText("SCRAP")).not.toBeNull();
    expect(screen.getByText("RES")).not.toBeNull();
    // The trash sheet shouldn't be in the DOM until the chip is clicked.
    expect(screen.queryByText(/SCRAP\s+·\s+\d+/)).toBeNull();
  });

  it("opens the discard sheet when the SCRAP chip is clicked, then closes via the ✕ button", async () => {
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

    // The SCRAP chip is the second chip in the strip; it's the only one
    // that's enabled when discard.length > 0.
    const scrapChip = screen.getByText("SCRAP").closest("button");
    expect(scrapChip).not.toBeNull();
    await user.click(scrapChip!);

    // Sheet header surfaces the discard label + card count.
    expect(screen.getByText(/SCRAP\s+·\s+1/)).not.toBeNull();
    // The card itself renders inside the sheet.
    expect(screen.getByAltText("Junked Unit")).not.toBeNull();

    // ✕ close button (DialogPrimitive.Close) dismisses the sheet.
    await user.click(screen.getByLabelText("Close"));
    expect(screen.queryByText(/SCRAP\s+·\s+1/)).toBeNull();
  });

  it("does not open the sheet when the discard pile is empty", async () => {
    const user = userEvent.setup();
    renderStrip({ discard: [], trashCount: 0 });

    await act(async () => {
      await Promise.resolve();
    });

    const scrapChip = screen.getByText("SCRAP").closest("button");
    expect(scrapChip).not.toBeNull();
    expect((scrapChip as HTMLButtonElement).disabled).toBe(true);

    // Click is a no-op when disabled — sheet must not appear.
    await user.click(scrapChip!);
    expect(screen.queryByText(/SCRAP\s+·\s+\d+/)).toBeNull();
  });
});

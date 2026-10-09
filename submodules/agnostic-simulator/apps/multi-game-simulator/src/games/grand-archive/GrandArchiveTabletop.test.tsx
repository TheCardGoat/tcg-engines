// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GrandArchiveSimulatorProviders } from "./App";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import {
  grandArchiveNowState,
  projectGrandArchiveMatchHistory,
} from "./GrandArchiveSidebarActivity";
import { grandArchiveBoardProjection } from "./GrandArchiveBoard";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";

afterEach(cleanup);

describe("Grand Archive tabletop", () => {
  it("shows the exact full printing in card inspection", async () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "art-only")!;
    const entity = fixture.entities.find(
      (entry) => entry.dataAttributes?.["data-ga-art-only"] === true,
    )!;
    expect(entity.imageAspectRatio).toBeGreaterThan(0);
    const fullArt = fixture.entities.find(
      (entry) =>
        entry.dataAttributes?.["data-zone-id"] === "p2:field" &&
        entry.imageUrl?.includes("/assets/full/"),
    )!;
    expect(fullArt).toBeTruthy();
    expect(fullArt.imageAspectRatio).toBeLessThan(1);
    expect(fullArt.dataAttributes?.["data-ga-art-only"]).toBeUndefined();

    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} />
      </GrandArchiveSimulatorProviders>,
    );
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${entity.title},`) }));
    const inspection = await screen.findByRole("dialog", { name: entity.title });
    expect(inspection.querySelector("img")?.getAttribute("src")).toBe(
      entity.dataAttributes?.["data-ga-printed-image-url"],
    );
    expect(inspection.querySelector("img")?.getAttribute("src")).toContain("/assets/full/");
  });

  it("projects viewer-authorized field art", () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "art-only")!;
    const field = fixture.table.zones
      .filter((zone) => zone.id.endsWith(":field"))
      .flatMap((zone) => zone.entityIds);
    const entity = fixture.entities.find(
      (entry) => field.includes(entry.id) && entry.dataAttributes?.["data-ga-art-only"] === true,
    )!;
    expect(
      grandArchiveBoardProjection(fixture).cards.find((card) => card.id === entity.id),
    ).toMatchObject({ faceUrl: entity.imageUrl, faceDown: false });
  });
  it.each([false, true])("gates Undo with canUndo=%s when a handler exists", (canUndo) => {
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop
          fixture={GRAND_ARCHIVE_VISUAL_FIXTURES[0]!}
          canUndo={canUndo}
          onUndo={() => {}}
        />
      </GrandArchiveSimulatorProviders>,
    );
    const undo = screen.getByRole("button", {
      name: canUndo ? "Undo" : "Undo unavailable. No undoable move available.",
    });
    expect(undo.hasAttribute("disabled")).toBe(!canUndo);
  });

  it("keeps cards accessible on the board alongside match history", async () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES[0]!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} />
      </GrandArchiveSimulatorProviders>,
    );

    expect(screen.getByLabelText("Your hand")).toBeTruthy();
    expect(screen.getByLabelText("Opponent hand")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Cards & actions" })).toBeNull();
    expect(screen.getByTestId("grand-archive-sidebar")).toBeTruthy();
    expect(screen.getByRole("region", { name: "Opponent match status" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Your match status" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "History", selected: true })).toBeTruthy();
  });

  it("exposes the platform-standard sidebar action dock", () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "opportunity",
    )!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} />
      </GrandArchiveSimulatorProviders>,
    );

    const dock = screen.getAllByRole("region", { name: "Match actions" })[0]!;
    expect(dock.textContent).not.toContain("Undo");
    expect(dock.textContent).not.toContain("Pass");
    expect(dock.textContent).toContain("Concede");
  });

  it("omits Undo when no handler is available", () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "opportunity")!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} canUndo />
      </GrandArchiveSimulatorProviders>,
    );

    expect(screen.queryByRole("button", { name: /Undo/ })).toBeNull();
  });

  it("reveals each unavailable action explanation on keyboard focus", async () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "resolving")!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} canConcede={false} />
      </GrandArchiveSimulatorProviders>,
    );
    for (const [label, reason] of [["Concede", "Concede is unavailable in this match."]]) {
      const trigger = screen.getByRole("group", { name: `${label} unavailable` });
      expect(trigger.tabIndex).toBe(0);
      fireEvent.focus(trigger);
      expect((await screen.findByRole("tooltip")).textContent).toBe(reason);
      fireEvent.blur(trigger);
      await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
    }
  });

  it("submits the engine's legal Opportunity pass from the dock", () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "opportunity")!;
    const onSubmit = vi.fn(() => true);
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} onSubmitProtocolInteraction={onSubmit} />
      </GrandArchiveSimulatorProviders>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Pass Opportunity" }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: fixture.interactions.find((entry) => entry.movePreview.command === "pass")!.id,
      }),
    );
  });

  it("groups player history by turn alongside the hand surface", async () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "opportunity",
    )!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} />
      </GrandArchiveSimulatorProviders>,
    );

    expect(screen.getAllByRole("heading", { name: /Turn 1/ }).length).toBeGreaterThan(0);
    expect(screen.getByText("Match started.")).toBeTruthy();
    expect(screen.queryByText(/^p[12] moved a card/)).toBeNull();
    expect(screen.getByLabelText("Your hand")).toBeTruthy();
    expect(screen.getByLabelText("Opponent hand")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Cards & actions" })).toBeNull();
  });

  it("uses the shared card preview for history hover and focus", async () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "opportunity",
    )!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} />
      </GrandArchiveSimulatorProviders>,
    );

    const preview = screen.getAllByRole("button", {
      name: "Preview Morrigan, Lost Spirit",
    })[0]!;
    fireEvent.mouseEnter(preview);
    expect(screen.getByTestId("ga-card-preview")).toBeTruthy();
    expect(screen.getByTestId("ga-card-preview").querySelector("img")).toBeTruthy();
    fireEvent.mouseLeave(preview);
    expect(screen.queryByTestId("ga-card-preview")).toBeNull();
    fireEvent.click(preview);
    expect(preview.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog", { name: /Card preview: Morrigan/ })).toBeTruthy();
    fireEvent.keyDown(preview, { key: "Escape" });
    expect(screen.queryByTestId("ga-card-preview")).toBeNull();
  });

  it("separates the current match state and contextual legal actions into Now", () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "opportunity",
    )!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} />
      </GrandArchiveSimulatorProviders>,
    );

    fireEvent.click(screen.getAllByRole("tab", { name: "Now" })[0]!);

    expect(screen.getAllByTestId("ga-sidebar-now")[0]!.dataset.tone).toBe("ready");
    expect(screen.getAllByText(/\d+ legal actions?/).length).toBeGreaterThan(0);
    expect(
      screen.getByText("Only actions currently accepted by the game engine are available."),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Activate Woodland Squirrels, Woodland Squirrels · copy 1 of 2",
      }),
    ).toBeTruthy();
  });

  it("derives distinct ready, resolving, and completed Now states", () => {
    const stateFor = (fixtureId: string) => {
      const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
        (candidate) => candidate.id === fixtureId,
      )!;
      const selfSeat = fixture.table.seats.find((seat) => seat.perspective === "bottom")!;
      return grandArchiveNowState(fixture, selfSeat, "Local fixture");
    };

    expect(stateFor("opportunity").tone).toBe("ready");
    expect(stateFor("resolving")).toMatchObject({
      tone: "thinking",
      title: "Resolving effects",
    });
    expect(stateFor("game-over")).toMatchObject({
      tone: "complete",
      title: "Match complete",
    });
  });

  it("does not label a seat as holding Opportunity while resolving", () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "resolving",
    )!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={fixture} />
      </GrandArchiveSimulatorProviders>,
    );

    expect(screen.queryByText("Opportunity")).toBeNull();
    expect(screen.getAllByText(/^Resolving$/).length).toBeGreaterThan(0);
  });

  it("classifies terminal engine events by their stable event key", () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "game-over",
    )!;
    const rows = projectGrandArchiveMatchHistory({
      ...fixture,
      eventLog: [
        {
          id: "finished",
          turn: 1,
          phase: "main",
          timestamp: "T0001",
          message: "The match ended. Winner(s): p2.",
          sourceKey: "grand-archive.match.finished",
          tags: ["system"],
        },
      ],
    });

    expect(rows.find((row) => row.id === "finished")?.kind).toBe("outcome");
  });

  it("keeps simulator diagnostics in a structured Lab tab", () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((candidate) => candidate.id === "decision")!;
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop
          fixture={fixture}
          fixtures={GRAND_ARCHIVE_VISUAL_FIXTURES}
          onSelectFixture={() => undefined}
        />
      </GrandArchiveSimulatorProviders>,
    );

    fireEvent.click(screen.getAllByRole("tab", { name: "Lab" })[0]!);

    expect(screen.getByTestId("ga-sidebar-lab")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Detailed trace" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Session" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Current decisions" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Debug snapshots" })).toBeTruthy();
    expect(screen.getByText("Viewer projection")).toBeTruthy();
    expect(screen.getByText("Interaction projection")).toBeTruthy();
  });

  it("wires the shared Undo action to the practice session", () => {
    const onUndo = vi.fn();
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop
          fixture={GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "opportunity")!}
          canUndo
          onUndo={onUndo}
        />
      </GrandArchiveSimulatorProviders>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalledOnce();
  });
});

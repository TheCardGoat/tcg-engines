import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import {
  isBottomControlRevealed,
  revealBottomControl,
  sortBottomSeatMoveSummaries,
} from "@/features/simulator/panels/mobile-player-menubar.js";
import type { MoveCategorySummary } from "@/features/simulator/model/contracts.js";

describe("MobilePlayerMenubar helpers", () => {
  it("sorts bottom-seat move summaries into a stable UI order", () => {
    const sorted = sortBottomSeatMoveSummaries([
      {
        categoryId: "undo",
        categoryLabel: "Undo",
        sourceCardIds: [],
        isDirect: true,
      },
      {
        categoryId: "challenge",
        categoryLabel: "Challenge",
        sourceCardIds: ["challenger-1"],
        isDirect: false,
      },
      {
        categoryId: "play-card",
        categoryLabel: "Play card",
        sourceCardIds: ["card-1"],
        isDirect: false,
      },
    ] satisfies MoveCategorySummary[]);

    expect(sorted.map((summary) => summary.categoryId)).toEqual(["play-card", "challenge", "undo"]);
  });

  it("keeps unknown categories after known ones without disturbing their relative order", () => {
    const sorted = sortBottomSeatMoveSummaries([
      {
        categoryId: "unknown",
        categoryLabel: "Mystery action",
        sourceCardIds: [],
        isDirect: true,
      },
      {
        categoryId: "activate-ability",
        categoryLabel: "Activate ability",
        sourceCardIds: ["ability-1"],
        isDirect: false,
      },
      {
        categoryId: "unknown",
        categoryLabel: "Another mystery action",
        sourceCardIds: [],
        isDirect: true,
      },
    ] satisfies MoveCategorySummary[]);

    expect(sorted.map((summary) => summary.categoryLabel)).toEqual([
      "Activate ability",
      "Mystery action",
      "Another mystery action",
    ]);
  });

  it("keeps only the most recently revealed bottom control expanded", () => {
    const onceRevealed = revealBottomControl(null, "play-card");
    const twiceRevealed = revealBottomControl(onceRevealed, "pending-effects");

    expect(isBottomControlRevealed(onceRevealed, "play-card")).toBe(true);
    expect(isBottomControlRevealed(onceRevealed, "pending-effects")).toBe(false);
    expect(isBottomControlRevealed(twiceRevealed, "play-card")).toBe(false);
    expect(isBottomControlRevealed(twiceRevealed, "pending-effects")).toBe(true);
  });
});

describe("MobilePlayerMenubar rendering", () => {
  const player = {
    label: "You",
    side: "playerOne" as const,
    summary: {
      lore: 7,
      handCount: 4,
      deckCount: 40,
      discardCount: 3,
      availableInk: 2,
      inkwellCount: 5,
    },
    isActive: true,
    isTurnPlayer: true,
    hasPriority: true,
  };

  const moveSummaries: MoveCategorySummary[] = [
    {
      categoryId: "play-card",
      categoryLabel: "Play card",
      sourceCardIds: ["card-1"],
      isDirect: false,
    },
    {
      categoryId: "pass-turn",
      categoryLabel: "Pass turn",
      sourceCardIds: [],
      isDirect: true,
    },
  ];

  it("renders the lore icon before the lore value in the mobile lore chip", async () => {
    const { default: MobilePlayerMenubar } =
      await import("@/features/simulator/panels/MobilePlayerMenubar.svelte");
    const { body } = render(MobilePlayerMenubar, {
      props: {
        seat: "bottom",
        player,
        moveSummaries,
      },
    });

    expect(body.indexOf("lore-chip__icon")).toBeLessThan(body.indexOf(">7<"));
  });

  it("renders top-bar settings and event log controls together", async () => {
    const { default: MobilePlayerMenubar } =
      await import("@/features/simulator/panels/MobilePlayerMenubar.svelte");
    const { body } = render(MobilePlayerMenubar, {
      props: {
        seat: "top",
        player,
        logCount: 3,
        onOpenSupport: () => {},
        onOpenSettings: () => {},
      },
    });

    expect(body).toContain("Open bug report and feedback options");
    expect(body).toContain("Open player settings");
    expect(body).toContain("Open event log");
  });

  it("renders the top-bar support control when a support callback is provided", async () => {
    const { default: MobilePlayerMenubar } =
      await import("@/features/simulator/panels/MobilePlayerMenubar.svelte");
    const { body } = render(MobilePlayerMenubar, {
      props: {
        seat: "top",
        player,
        onOpenSupport: () => {},
      },
    });

    expect(body).toContain("Open bug report and feedback options");
  });

  it("does not render the bottom-bar event log control", async () => {
    const { default: MobilePlayerMenubar } =
      await import("@/features/simulator/panels/MobilePlayerMenubar.svelte");
    const { body } = render(MobilePlayerMenubar, {
      props: {
        seat: "bottom",
        player,
        moveSummaries,
        logCount: 4,
        hasPendingEffects: true,
        pendingCount: 2,
      },
    });

    expect(body).not.toContain("mobile-bottom-log");
    expect(body).not.toContain("Open event log");
  });

  it("renders bottom action buttons as icon-only before they are used", async () => {
    const { default: MobilePlayerMenubar } =
      await import("@/features/simulator/panels/MobilePlayerMenubar.svelte");
    const { body } = render(MobilePlayerMenubar, {
      props: {
        seat: "bottom",
        player,
        moveSummaries,
        hasPendingEffects: true,
        pendingCount: 2,
      },
    });

    expect(body).toContain("mobile-bottom-move-play-card");
    expect(body).toContain("quick-action--icon-only");
    expect(body).not.toContain('quick-action__label">Play card');
    expect(body).not.toContain('quick-action__badge">2<');
  });
});

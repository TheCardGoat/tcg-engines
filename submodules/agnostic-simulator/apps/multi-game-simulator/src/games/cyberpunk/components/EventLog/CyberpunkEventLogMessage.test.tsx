// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import { describe, expect, test, vi } from "vite-plus/test";

import {
  renderCyberpunkEventLogMessage,
  scrollCyberpunkEventLogToLatest,
} from "./CyberpunkEventLogMessage";

vi.mock("../CardDisplay/CardNameToken", () => ({
  CardNameToken: ({ fallbackName }: { fallbackName: string }) => (
    <button type="button">{fallbackName}</button>
  ),
}));

describe("renderCyberpunkEventLogMessage", () => {
  test("renders projected card references as interactive card-name tokens", () => {
    const entry: SimulatorEventLogEntry = {
      id: "combat-1",
      turn: 2,
      phase: "Main",
      seatId: "player",
      timestamp: "2026-09-21T07:14:00.000Z",
      message: "Caliber: Totentanz's Top Dog attacked Meredith Stout: Stone Cold Corpo.",
      tags: ["combat"],
      cardRefs: [
        { id: "attacker", name: "Caliber: Totentanz's Top Dog" },
        { id: "defender", name: "Meredith Stout: Stone Cold Corpo" },
      ],
    };

    render(<p>{renderCyberpunkEventLogMessage(entry)}</p>);

    expect(screen.getByRole("button", { name: "Caliber: Totentanz's Top Dog" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Meredith Stout: Stone Cold Corpo" })).toBeTruthy();
    expect(document.body.textContent).toContain("attacked");
  });

  test("scrolls the activity feed to the newest entry after the mobile drawer opens", () => {
    const activityFeed = document.createElement("div");
    const scroller = document.createElement("div");
    scroller.setAttribute("role", "log");
    Object.defineProperties(scroller, {
      scrollHeight: { configurable: true, value: 720 },
      scrollTop: { configurable: true, value: 0, writable: true },
    });
    activityFeed.append(scroller);

    scrollCyberpunkEventLogToLatest(activityFeed);

    expect(scroller.scrollTop).toBe(720);
  });
});

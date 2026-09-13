// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  calculateFabCombatValue,
  FAB_ANALYTICS_METHODOLOGY_URL,
  type FabCombatStats,
} from "./FabCombatValue";
import { FabCombatValuePanel, FabCombatValueHighlights } from "./FabCombatValuePanel";
import FabAnalyticsMethodology from "../../routes/fab-analytics-methodology";

afterEach(cleanup);
const stats: FabCombatStats = {
  attackPowerThreatened: 6,
  attackDamageDealt: 2,
  totalDamageDealt: 4,
  damagePrevented: 2,
  effectiveDefense: 4,
};
it("counts attack pressure once and does not credit resources or overblock", () => {
  expect(calculateFabCombatValue(stats)).toEqual({
    attack: 6,
    otherDamage: 2,
    defense: 4,
    prevention: 2,
    total: 14,
  });
  expect(
    calculateFabCombatValue({
      ...stats,
    })?.total,
  ).toBe(14);
  expect(
    calculateFabCombatValue({ ...stats, totalDamageDealt: 0, attackDamageDealt: 0 })?.attack,
  ).toBe(6);
});
it("rejects invalid inputs and displays unavailable instead of a fabricated zero", () => {
  expect(calculateFabCombatValue({ ...stats, totalDamageDealt: 1 })).toBeNull();
  expect(calculateFabCombatValue({ ...stats, damagePrevented: NaN })).toBeNull();
  render(<FabCombatValuePanel />);
  expect(screen.getByText("Combat value").closest("details")?.hasAttribute("open")).toBe(false);
  fireEvent.click(screen.getByText("Combat value"));
  expect(screen.getByText("Combat value").closest("details")?.hasAttribute("open")).toBe(true);
  expect(screen.getByRole("status").textContent).toContain("Unavailable");
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.getByRole("link", { name: /Analytics methodology/ }).getAttribute("href")).toBe(
    FAB_ANALYTICS_METHODOLOGY_URL,
  );
});
it("provides a standalone methodology with the formula and known limitations", () => {
  render(<FabAnalyticsMethodology />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("How we calculate");
  expect(screen.getByRole("link", { name: "Limits" }).getAttribute("href")).toBe("#limits");
  expect(screen.getByRole("heading", { name: "Why there is no per-card grade" })).toBeTruthy();
  expect(screen.getByText(/damage to yourself/)).toBeTruthy();
});

it("shows each player's average and top turn, including ties, partial turns and missing records", () => {
  const value = (total: number) => ({
    attack: total,
    otherDamage: 0,
    defense: 0,
    prevention: 0,
    total,
  });
  const { rerender } = render(
    <FabCombatValueHighlights
      report={{
        source: "backend",
        viewer: value(18),
        opponent: value(20),
        turns: [
          { turn: 1, completed: true, viewer: value(9), opponent: value(6) },
          { turn: 2, completed: false, viewer: value(9), opponent: value(14) },
        ],
      }}
    />,
  );
  expect(screen.getByText("9.0")).toBeTruthy();
  expect(screen.getByText("10.0")).toBeTruthy();
  expect(screen.getByText("9 · T1")).toBeTruthy();
  expect(screen.getByText("14 · T2*")).toBeTruthy();
  expect(
    screen.getByRole("link", { name: "Avg. combat value / turn" }).getAttribute("href"),
  ).toContain("#turn-highlights");
  rerender(<FabCombatValueHighlights />);
  expect(screen.getAllByText("—")).toHaveLength(4);
});

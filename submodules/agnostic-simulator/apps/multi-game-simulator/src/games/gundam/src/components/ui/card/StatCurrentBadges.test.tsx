// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vite-plus/test";
import { render, cleanup } from "@testing-library/react";

import { StatCurrentBadges } from "./StatCurrentBadges.tsx";

describe("StatCurrentBadges", () => {
  afterEach(cleanup);

  it("renders nothing when no deltas are present", () => {
    const { container } = render(
      <StatCurrentBadges ap={3} baseAp={3} hp={5} baseHp={5} scale={1} />,
    );
    expect(container.querySelector("[data-testid='stat-current-badges']")).toBeNull();
  });

  it("shows the current AP with a positive tone when buffed", () => {
    const { getByTestId } = render(
      <StatCurrentBadges ap={5} baseAp={3} hp={4} baseHp={4} scale={1} />,
    );
    const pill = getByTestId("stat-current-badge-ap");
    expect(pill.textContent).toContain("AP");
    expect(pill.textContent).toContain("5");
    expect(pill.getAttribute("title")).toBe("AP 5 (+2)");
  });

  it("shows the current HP with a negative tone when debuffed", () => {
    const { getByTestId } = render(
      <StatCurrentBadges ap={3} baseAp={3} hp={1} baseHp={4} scale={1} />,
    );
    const pill = getByTestId("stat-current-badge-hp");
    expect(pill.textContent).toContain("1");
    expect(pill.getAttribute("title")).toBe("HP 1 (-3)");
  });

  it("skips stats with null values even when a sibling delta exists", () => {
    const { queryByTestId, getByTestId } = render(
      <StatCurrentBadges ap={null} baseAp={null} hp={5} baseHp={3} scale={1} />,
    );
    expect(queryByTestId("stat-current-badge-ap")).toBeNull();
    expect(getByTestId("stat-current-badge-hp")).not.toBeNull();
  });
});

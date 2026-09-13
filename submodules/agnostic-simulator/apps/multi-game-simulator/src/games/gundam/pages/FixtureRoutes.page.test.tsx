// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { MemoryRouter, Route, Routes } from "react-router";

import { GundamFixtureIndexPage } from "./FixtureRoutes.page.tsx";

describe("GundamFixtureIndexPage", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllEnvs();
  });

  it("renders the fixture catalog on its dedicated route", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/gundam/simulator/tests"]}>
        <Routes>
          <Route path="/:gameSlug/simulator/tests" element={<GundamFixtureIndexPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Deterministic fixture catalog" })).toBeDefined();
    expect(container.firstElementChild?.className).toContain("overflow-y-auto");
    expect(container.firstElementChild?.className).toContain("h-dvh");
  });

  it("keeps the hidden fixture route available outside development", () => {
    vi.stubEnv("DEV", false);

    render(
      <MemoryRouter initialEntries={["/gundam/simulator/tests"]}>
        <Routes>
          <Route path="/:gameSlug/simulator/tests" element={<GundamFixtureIndexPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Deterministic fixture catalog" })).toBeDefined();
  });
});

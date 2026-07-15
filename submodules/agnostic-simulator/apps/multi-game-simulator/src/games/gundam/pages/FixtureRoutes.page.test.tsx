// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { GundamFixtureIndexPage, GundamHomePage } from "./FixtureRoutes.page.tsx";

describe("GundamFixtureIndexPage", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllEnvs();
  });

  it("consolidates simulator tasks on the mounted Gundam home route", () => {
    render(
      <MemoryRouter initialEntries={["/gundam/simulator"]}>
        <Routes>
          <Route path="/:gameSlug/simulator" element={<GundamHomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    const hub = screen.getByTestId("gundam-fixture-index");

    expect(hub.querySelector('a[href="/gundam/simulator/vs-ai"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/gundam/simulator/practice"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/gundam/simulator/bot-vs-bot"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/gundam/simulator/bot-bench-ui"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/gundam/simulator/tests"]')).not.toBeNull();
    expect(
      hub.querySelector('a[href="/gundam/simulator/vs-ai?fixture=setup-default"]'),
    ).not.toBeNull();
  });

  it("links visual fixtures through the mounted Gundam simulator route", () => {
    render(
      <MemoryRouter initialEntries={["/gundam/simulator/tests"]}>
        <Routes>
          <Route path="/:gameSlug/simulator/tests" element={<GundamFixtureIndexPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const fixtureIndex = screen.getByTestId("gundam-fixture-index");
    const setupDefault = fixtureIndex.querySelector(
      'a[href="/gundam/simulator/vs-ai?fixture=setup-default"]',
    );

    expect(setupDefault).not.toBeNull();
  });

  it("uses basename-relative links when rendered by the standalone router", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<GundamHomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    const hub = screen.getByTestId("gundam-fixture-index");

    expect(hub.querySelector('a[href="/vs-ai"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/practice"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/tests"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/vs-ai?fixture=setup-default"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/gundam/simulator/vs-ai"]')).toBeNull();
  });

  it("hides dev-only fixtures from the production home hub", () => {
    vi.stubEnv("DEV", false);

    render(
      <MemoryRouter initialEntries={["/gundam/simulator"]}>
        <Routes>
          <Route path="/:gameSlug/simulator" element={<GundamHomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    const hub = screen.getByTestId("gundam-fixture-index");

    expect(hub.querySelector('a[href="/gundam/simulator/vs-ai"]')).not.toBeNull();
    expect(hub.querySelector('a[href="/gundam/simulator/tests"]')).toBeNull();
    expect(hub.querySelector('a[href="/gundam/simulator/vs-ai?fixture=setup-default"]')).toBeNull();
    expect(screen.queryByText("Deterministic states")).toBeNull();
  });
});

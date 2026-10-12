// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { useCyberpunkUiVersion } from "./version";
import { CYBERPUNK_UI_VERSION_STORAGE_KEY, useCyberpunkUiV2 } from "./uiVersion";

function Observer() {
  return <output data-testid="observer">{useCyberpunkUiV2() ? "v2" : "v1"}</output>;
}

function Controls() {
  const { isV2, setVersion } = useCyberpunkUiVersion();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output data-testid="version">{isV2 ? "v2" : "v1"}</output>
      <output data-testid="location">
        {location.pathname}
        {location.search}
        {location.hash}
      </output>
      <button onClick={() => setVersion("v2")}>Use V2</button>
      <button onClick={() => setVersion("v1")}>Use V1</button>
      <button onClick={() => navigate("/next-game?ai=off#board")}>Next game</button>
      <Observer />
    </>
  );
}

function mount(route = "/first-game?ai=off#board") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Controls />
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("version switches persist across games and a fresh mount", () => {
  const first = mount();
  expect(screen.getByTestId("version").textContent).toBe("v1");
  fireEvent.click(screen.getByText("Use V2"));
  expect(localStorage.getItem(CYBERPUNK_UI_VERSION_STORAGE_KEY)).toBe("v2");
  expect(screen.getByTestId("location").textContent).toBe("/first-game?ai=off&ui=v2#board");
  fireEvent.click(screen.getByText("Next game"));
  expect(screen.getByTestId("version").textContent).toBe("v2");
  expect(screen.getByTestId("observer").textContent).toBe("v2");
  first.unmount();
  mount("/another-game");
  expect(screen.getByTestId("version").textContent).toBe("v2");
  fireEvent.click(screen.getByText("Use V1"));
  expect(localStorage.getItem(CYBERPUNK_UI_VERSION_STORAGE_KEY)).toBe("v1");
  fireEvent.click(screen.getByText("Next game"));
  expect(screen.getByTestId("version").textContent).toBe("v1");
});

test.each(["v1", "v2"] as const)(
  "explicit %s URL overrides the saved preference without changing it",
  (version) => {
    const saved = version === "v1" ? "v2" : "v1";
    localStorage.setItem(CYBERPUNK_UI_VERSION_STORAGE_KEY, saved);
    mount(`/first-game?ui=${version}`);
    expect(screen.getByTestId("version").textContent).toBe(version);
    expect(localStorage.getItem(CYBERPUNK_UI_VERSION_STORAGE_KEY)).toBe(saved);
    fireEvent.click(screen.getByText("Next game"));
    expect(screen.getByTestId("version").textContent).toBe(saved);
  },
);

test("unknown saved values fall back to V1", () => {
  localStorage.setItem(CYBERPUNK_UI_VERSION_STORAGE_KEY, "invalid");
  mount();
  expect(screen.getByTestId("version").textContent).toBe("v1");
});

test("storage updates keep all version consumers in sync", () => {
  mount();
  act(() => {
    localStorage.setItem(CYBERPUNK_UI_VERSION_STORAGE_KEY, "v2");
    window.dispatchEvent(new StorageEvent("storage", { key: CYBERPUNK_UI_VERSION_STORAGE_KEY }));
  });
  expect(screen.getByTestId("version").textContent).toBe("v2");
  expect(screen.getByTestId("observer").textContent).toBe("v2");
});

test("blocked storage still permits switching and preserves route options", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  mount();
  fireEvent.click(screen.getByText("Use V2"));
  expect(screen.getByTestId("version").textContent).toBe("v2");
  fireEvent.click(screen.getByText("Use V1"));
  expect(screen.getByTestId("version").textContent).toBe("v1");
  expect(screen.getByTestId("location").textContent).toBe("/first-game?ai=off#board");
});

test("Return to V1 works when a saved V2 preference cannot be overwritten", () => {
  localStorage.setItem(CYBERPUNK_UI_VERSION_STORAGE_KEY, "v2");
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  mount();
  fireEvent.click(screen.getByText("Use V1"));
  expect(screen.getByTestId("version").textContent).toBe("v1");
  expect(screen.getByTestId("location").textContent).toBe("/first-game?ai=off&ui=v1#board");
});

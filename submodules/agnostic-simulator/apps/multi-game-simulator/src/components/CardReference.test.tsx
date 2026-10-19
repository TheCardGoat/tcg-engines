// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, expect, test, vi } from "vite-plus/test";
import { CardReference } from "@tcg/simulator-presentation/card-reference";
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(cleanup);
const card = {
  id: "visible-1",
  label: "Sonoro",
  imageUrl: "/sonoro.png",
  identity: [{ label: "green", color: "#72cf9c" }],
};

test("card references support focus, pinned click, and Escape without choosing a target", async () => {
  render(
    <MantineProvider
      theme={{
        components: {
          Popover: { defaultProps: { hideDetached: false, transitionProps: { duration: 0 } } },
        },
      }}
    >
      <CardReference card={card} />
    </MantineProvider>,
  );
  const reference = screen.getByRole("button", { name: "Preview Sonoro" });
  expect(screen.getByLabelText("green")).toBeTruthy();
  fireEvent.focus(reference);
  await waitFor(() => expect(screen.getByRole("img", { name: "Sonoro" })).toBeTruthy());
  fireEvent.click(reference);
  fireEvent.mouseLeave(reference);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Close preview of Sonoro" })).toBeTruthy(),
  );
  fireEvent.keyDown(reference, { key: "Escape" });
  await waitFor(() => expect(reference.getAttribute("aria-expanded")).toBe("false"));
});

test("external game preview handlers remain the owner", () => {
  const preview = vi.fn();
  render(
    <MantineProvider
      theme={{
        components: {
          Popover: { defaultProps: { hideDetached: false, transitionProps: { duration: 0 } } },
        },
      }}
    >
      <CardReference card={card} previewMode="external" onClick={preview} />
    </MantineProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Preview Sonoro" }));
  expect(preview).toHaveBeenCalledOnce();
  expect(screen.queryByRole("img")).toBeNull();
});

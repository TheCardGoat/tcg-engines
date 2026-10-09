// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test, vi } from "vite-plus/test";
import { TargetModal } from "@tcg/simulator-presentation/target-modal";

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(cleanup);
const cards = [
  { id: "legal", label: "Legal ally" },
  { id: "illegal", label: "Other card" },
];
test("renders only supplied legal targets and reports the selected card without closing", () => {
  const onCard = vi.fn(),
    onClose = vi.fn();
  render(
    <MantineProvider>
      <TargetModal
        opened
        title="Choose an ally"
        cards={cards}
        mode="select"
        filter={(card) => card.id === "legal"}
        selectedIds={new Set(["legal"])}
        onCard={onCard}
        onClose={onClose}
      />
    </MantineProvider>,
  );
  const target = screen.getByRole("button", { name: "Select Legal ally" });
  expect(target.getAttribute("aria-pressed")).toBe("true");
  expect(screen.queryByRole("button", { name: "Select Other card" })).toBeNull();
  fireEvent.click(target);
  expect(onCard).toHaveBeenCalledWith(cards[0]);
  expect(onClose).not.toHaveBeenCalled();
});
test("shows the game's hidden-zone explanation without exposing cards", () => {
  render(
    <MantineProvider>
      <TargetModal
        opened
        title="Deck"
        cards={[]}
        emptyMessage="Deck identities are hidden."
        onCard={vi.fn()}
        onClose={vi.fn()}
      />
    </MantineProvider>,
  );
  expect(screen.getByRole("status").textContent).toContain("Deck identities are hidden.");
});
test("search narrows only the already-filtered cards", () => {
  const many = Array.from({ length: 10 }, (_, i) => ({ id: String(i), label: `Ally ${i}` }));
  render(
    <MantineProvider>
      <TargetModal
        opened
        title="Cards"
        cards={many}
        filter={(card) => card.id !== "9"}
        onCard={vi.fn()}
        onClose={vi.fn()}
      />
    </MantineProvider>,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "Find a card" }), {
    target: { value: "Ally 9" },
  });
  expect(screen.getByRole("status").textContent).toContain("No cards match your search.");
});

test("unavailable candidates explain why and remain inspectable without selecting", () => {
  const onCard = vi.fn(),
    onInspect = vi.fn();
  const card = {
    id: "shielded",
    imageUrl: "/ally.png",
    label: "Shielded ally",
    group: "Opponent",
    enabled: false,
    disabledReason: "Cannot target this card",
  };
  render(
    <MantineProvider>
      <TargetModal
        opened
        title="Choose a target"
        cards={[card]}
        mode="select"
        onCard={onCard}
        onInspect={onInspect}
        onClose={vi.fn()}
      />
    </MantineProvider>,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Select Shielded ally. Cannot target this card" }),
  );
  expect(onCard).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Inspect details for Shielded ally" }));
  expect(onInspect).toHaveBeenCalledWith(card);
});

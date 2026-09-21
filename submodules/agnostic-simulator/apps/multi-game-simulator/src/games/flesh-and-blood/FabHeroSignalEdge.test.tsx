// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { FabHeroSignalEdge } from "./FabHeroSignalEdge";

afterEach(cleanup);

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterAll(() => vi.unstubAllGlobals());

describe("FabHeroSignalEdge", () => {
  it("renders flag and count signals with an accessible, active-only summary", () => {
    render(
      <FabHeroSignalEdge
        heroName="Rhinar"
        side="bottom"
        signals={[
          { kind: "flag", id: "booed" },
          { kind: "count", id: "intimidate", value: 2 },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Rhinar hero signals: Booed, Intimidate 2. This turn.",
    });
    expect(trigger).not.toBeNull();
    expect(trigger.querySelector('[data-signal="intimidate"]')?.textContent).toContain("2");
  });

  it("shows first two pips plus overflow and lists every signal in the popover", () => {
    render(
      <FabHeroSignalEdge
        heroName="Tuffnut"
        side="top"
        signals={[
          { kind: "flag", id: "cheered" },
          { kind: "flag", id: "booed" },
          { kind: "count", id: "intimidate", value: 1 },
          { kind: "flag", id: "charged" },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: /Tuffnut hero signals/ });
    expect(trigger.textContent).toContain("+2");
    fireEvent.click(trigger);
    const popover = screen.getByLabelText("Tuffnut hero signals", { selector: "div" });
    expect(within(popover).getAllByRole("listitem")).toHaveLength(4);
    expect(within(popover).getByText("This turn")).not.toBeNull();
  });

  it("makes Boltyn's combo progress legible from the edge and popover", () => {
    render(
      <FabHeroSignalEdge
        heroName="Ser Boltyn"
        side="bottom"
        signals={[
          { kind: "flag", id: "charged" },
          { kind: "count", id: "weapon-attacks", value: 8 },
          { kind: "count", id: "soul-added", value: 26 },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Ser Boltyn hero signals: Charged, Weapon attacks 8, Added to soul 26. This turn.",
    });
    expect(trigger.querySelector('[data-signal="weapon-attacks"]')?.textContent).toContain("8");
    expect(trigger.querySelector('[data-signal="soul-added"]')?.textContent).toContain("26");

    fireEvent.click(trigger);
    const popover = screen.getByLabelText("Ser Boltyn hero signals", { selector: "div" });
    expect(within(popover).getByText("Weapon attacks")).not.toBeNull();
    expect(within(popover).getByText("Cards put into this hero's soul this turn.")).not.toBeNull();
  });

  it("opens from focus or touch activation, closes with Escape, and returns focus", async () => {
    render(
      <FabHeroSignalEdge
        heroName="Boltyn"
        side="bottom"
        signals={[{ kind: "flag", id: "charged" }]}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Boltyn hero signals/ });

    trigger.focus();
    fireEvent.focus(trigger);
    expect(screen.getByText("This hero has charged a card to their soul.")).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("This hero has charged a card to their soul.")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));

    fireEvent.pointerDown(trigger, { pointerType: "touch" });
    fireEvent.click(trigger);
    expect(screen.getByText("This hero has charged a card to their soul.")).not.toBeNull();
  });

  it("does not steal focus when an outside control dismisses the popover", async () => {
    render(
      <>
        <FabHeroSignalEdge
          heroName="Boltyn"
          side="bottom"
          signals={[{ kind: "flag", id: "charged" }]}
        />
        <button type="button">Pass</button>
      </>,
    );
    const trigger = screen.getByRole("button", { name: /Boltyn hero signals/ });
    const outside = screen.getByRole("button", { name: "Pass" });

    fireEvent.click(trigger);
    expect(screen.getByText("This hero has charged a card to their soul.")).not.toBeNull();
    fireEvent.pointerDown(outside);
    outside.focus();
    fireEvent.click(outside);

    await waitFor(() =>
      expect(screen.queryByText("This hero has charged a card to their soul.")).toBeNull(),
    );
    expect(document.activeElement).toBe(outside);
  });

  it("labels a marked hero as a persistent status instead of a turn signal", () => {
    render(
      <FabHeroSignalEdge
        heroName="Dash"
        side="top"
        signals={[
          { kind: "flag", id: "marked", duration: "until-hit" },
          { kind: "count", id: "intimidate", value: 1 },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Dash hero signals: Marked, Intimidate 1. Status.",
    });
    expect(trigger.querySelector('[data-signal="marked"]')).not.toBeNull();

    fireEvent.click(trigger);
    const popover = screen.getByLabelText("Dash hero signals", { selector: "div" });
    expect(within(popover).getByText("Status")).not.toBeNull();
    expect(within(popover).getByText("Until hit")).not.toBeNull();
    expect(
      within(popover).getByText(
        "CR 9.3 — the next time an opponent's attack hits this hero, Marked is removed.",
      ),
    ).not.toBeNull();
  });

  it("remounts only a changed count pip so activation feedback runs once per value", () => {
    const view = render(
      <FabHeroSignalEdge
        heroName="Rhinar"
        side="bottom"
        signals={[
          { kind: "flag", id: "booed" },
          { kind: "count", id: "intimidate", value: 1 },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Rhinar hero signals/ });
    const flagBefore = trigger.querySelector('[data-signal="booed"]');
    const countBefore = trigger.querySelector('[data-signal="intimidate"]');

    view.rerender(
      <FabHeroSignalEdge
        heroName="Rhinar"
        side="bottom"
        signals={[
          { kind: "flag", id: "booed" },
          { kind: "count", id: "intimidate", value: 2 },
        ]}
      />,
    );

    expect(trigger.querySelector('[data-signal="booed"]')).toBe(flagBefore);
    expect(trigger.querySelector('[data-signal="intimidate"]')).not.toBe(countBefore);
  });
});

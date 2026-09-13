import { FabPresentationTestProvider } from "./presentation-test-provider";
// @vitest-environment jsdom
import { cleanup, fireEvent, render as renderRaw, screen } from "@testing-library/react";
import type { OrderingInput } from "@tcg/protocol";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FabTriggerOrderingPanel } from "./FabTriggerOrderingPanel";

afterEach(cleanup);

function orderingInput(): OrderingInput {
  return {
    id: "answer",
    text: { key: "Order triggered abilities" },
    kind: "ordering",
    entityKind: "card",
    min: 1,
    max: 1,
    candidates: [
      {
        entity: { kind: "card", instanceId: "trigger-1" },
        text: { key: "Rune Gate: banish a card" },
        enabled: true,
      },
    ],
  };
}

describe("FabTriggerOrderingPanel art resolution", () => {
  it("uses the canonical source for a multi-pitch card instead of parsing its label", async () => {
    const plunderThePoorRed = "6QdjhDLqHJ9DB8GHD6fmf";

    const input = orderingInput();
    render(
      <FabTriggerOrderingPanel
        input={{
          ...input,
          candidates: [
            {
              ...input.candidates[0]!,
              entity: {
                kind: "effect",
                instanceId: "trigger-1",
                definitionId: plunderThePoorRed,
              },
              text: { key: "Plunder The Poor: DYN124-a2" },
            },
          ],
        }}
        onConfirm={() => {}}
      />,
    );

    expect(document.querySelector(".fab-trigger-order-art img")?.getAttribute("src")).toMatch(
      /\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
    );
  });

  it("uses published board artwork for an authored source", async () => {
    const silver = "TNJz9fCgqmhhLz9rP9tkt";

    const input = orderingInput();
    render(
      <FabTriggerOrderingPanel
        input={{
          ...input,
          candidates: [
            {
              ...input.candidates[0]!,
              entity: { kind: "effect", instanceId: "trigger-1", definitionId: silver },
              text: { key: "Silver: EVR195-a1" },
            },
          ],
        }}
        onConfirm={() => {}}
      />,
    );

    const image = document.querySelector<HTMLImageElement>(".fab-trigger-order-art img");
    expect(image).not.toBeNull();
    expect(image!.src).toMatch(/\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
    fireEvent.error(image!);
    expect(document.querySelector(".fab-trigger-order-art img")).toBeNull();
    expect(screen.getByText("Silver")).not.toBeNull();
  });

  it("does not substitute another printing when the injected printing is unavailable", () => {
    render(
      <FabTriggerOrderingPanel
        input={orderingInput()}
        identityForCard={(instanceId) =>
          instanceId === "trigger-1"
            ? { canonicalId: "canon-rune-gate", printingId: "printing-rune-gate" }
            : { canonicalId: "canon-other" }
        }
        onConfirm={() => {}}
      />,
    );

    expect(document.querySelector(".fab-trigger-order-art img")).toBeNull();
    expect(screen.getByText("Rune Gate")).not.toBeNull();
  });

  it("falls back to the full source label when nothing resolves", () => {
    const onConfirm = vi.fn();
    render(<FabTriggerOrderingPanel input={orderingInput()} onConfirm={onConfirm} />);

    expect(document.querySelector(".fab-trigger-order-art img")).toBeNull();
    expect(screen.getByText("Rune Gate")).not.toBeNull();
  });

  it("leaves touch pointers available for horizontal scrolling", () => {
    render(<FabTriggerOrderingPanel input={orderingInput()} onConfirm={() => {}} />);
    const card = screen.getByRole("button", { name: /Resolves first: Rune Gate/ });
    const setPointerCapture = vi.fn();
    card.setPointerCapture = setPointerCapture;
    const pointerDown = (pointerType: string, pointerId: number) => {
      const event = new Event("pointerdown", { bubbles: true });
      Object.defineProperties(event, {
        button: { value: 0 },
        pointerId: { value: pointerId },
        pointerType: { value: pointerType },
      });
      fireEvent(card, event);
    };

    pointerDown("touch", 1);
    expect(setPointerCapture).not.toHaveBeenCalled();

    pointerDown("mouse", 2);
    expect(setPointerCapture).toHaveBeenCalledWith(2);
  });

  it("explains the persistent automatic ordering preference before enabling it", () => {
    const onEnableAutoOrder = vi.fn();
    render(
      <FabTriggerOrderingPanel
        input={orderingInput()}
        onConfirm={() => {}}
        onEnableAutoOrder={onEnableAutoOrder}
      />,
    );

    const control = screen.getByRole("button", {
      name: "Configure automatic simultaneous trigger ordering",
    });
    fireEvent.click(control);
    expect(
      screen.getByText(
        "Use this listed order now and for future simultaneous triggers you control.",
      ),
    ).not.toBeNull();
    expect(screen.getByText("Turn it off in Game settings.")).not.toBeNull();
    expect(onEnableAutoOrder).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Enable auto-order" }));
    expect(onEnableAutoOrder).toHaveBeenCalledTimes(1);
  });
});

function render(ui: Parameters<typeof renderRaw>[0]) {
  return renderRaw(ui, { wrapper: FabPresentationTestProvider });
}

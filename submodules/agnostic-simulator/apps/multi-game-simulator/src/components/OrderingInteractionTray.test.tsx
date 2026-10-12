// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test, vi } from "vitest";
import { InteractionWorkspace, useInteractionSurface } from "@tcg/simulator-ui";
import type { EngineInteractionView } from "@tcg/protocol";
import { SharedInteractionPrompt } from "./SharedInteractionPrompt";

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
const view: EngineInteractionView = {
  protocolVersion: 2,
  gameSlug: "alpha-clash",
  actorId: "human",
  stateVersion: 3,
  status: "choosing",
  actions: [
    {
      id: "resolveChoice:batch",
      requestId: "batch:3",
      intent: "choose-option",
      text: { key: "Order effects" },
      enabled: true,
      inputs: [
        {
          kind: "ordering",
          id: "order",
          text: { key: "First to resolve first" },
          entityKind: "card",
          min: 3,
          max: 3,
          required: true,
          candidates: ["effect-a", "effect-b", "effect-c"].map((id) => ({
            entity: { kind: "card", instanceId: id },
            text: { key: "Same card, separate effect" },
            enabled: true,
          })),
        },
      ],
    },
  ],
};
function Surface({ onMove }: { onMove: () => void }) {
  const surface = useInteractionSurface(view);
  return (
    <SharedInteractionPrompt
      surface={surface}
      view={view}
      viewerId="human"
      cards={new Map()}
      numberedOrdering
      reducedMotion
      onOrderMove={onMove}
    />
  );
}
function Fixture({
  onSubmit,
  onMove = vi.fn(),
}: {
  onSubmit: (submission: unknown) => boolean;
  onMove?: () => void;
}) {
  return (
    <MantineProvider>
      <InteractionWorkspace view={view} viewerId="human" onSubmit={onSubmit}>
        <Surface onMove={onMove} />
      </InteractionWorkspace>
    </MantineProvider>
  );
}
const ids = () =>
  Array.from(document.querySelectorAll("[data-order-id]")).map((item) =>
    item.getAttribute("data-order-id"),
  );
test("reorders stable effect IDs, cancels only the draft, and submits once", () => {
  const submit = vi.fn(() => true);
  const cue = vi.fn();
  render(<Fixture onSubmit={submit} onMove={cue} />);
  expect(ids()).toEqual(["effect-a", "effect-b", "effect-c"]);
  fireEvent.click(screen.getByRole("button", { name: "Move item 3 earlier" }));
  expect(ids()).toEqual(["effect-a", "effect-c", "effect-b"]);
  expect(cue).toHaveBeenCalledOnce();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel changes" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Show choices" }));
  expect(ids()).toEqual(["effect-a", "effect-b", "effect-c"]);
  fireEvent.click(screen.getByRole("button", { name: "Move item 1 later" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { order: ["effect-b", "effect-a", "effect-c"] } }),
  );
});
test("rejected submit retains the order for retry; reduced motion is explicit", () => {
  const submit = vi.fn().mockReturnValueOnce(false).mockReturnValue(true);
  render(<Fixture onSubmit={submit} />);
  expect(document.querySelector(".tcg-order-tray")?.getAttribute("data-reduced-motion")).toBe(
    "true",
  );
  fireEvent.click(screen.getByRole("button", { name: "Move item 3 earlier" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));
  fireEvent.click(screen.getByRole("button", { name: "Retry order" }));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(submit.mock.calls[1][0]).toEqual(submit.mock.calls[0][0]);
});

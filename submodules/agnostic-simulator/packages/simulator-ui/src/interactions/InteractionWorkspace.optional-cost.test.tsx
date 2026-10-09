// @vitest-environment jsdom
import { HeadlessMantineProvider } from "@mantine/core";
import type { EngineInteractionView, InteractionInput } from "@tcg/protocol";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import {
  InteractionWorkspace,
  InteractionActionMenu,
  InteractionDraftPrompt,
} from "./InteractionWorkspace";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

const cost: InteractionInput = {
  kind: "entity-selection",
  id: "alternateCostCardIds",
  text: { key: "Return a card" },
  required: false,
  role: "cost",
  entityKinds: ["card"],
  min: 1,
  max: 1,
  ordered: false,
  candidates: [
    {
      entity: { kind: "card", instanceId: "payment" },
      text: { key: "Payment card" },
      enabled: true,
    },
  ],
};
function render(inputs: InteractionInput[] = [cost]) {
  const submit = vi.fn(() => true);
  const view: EngineInteractionView = {
    protocolVersion: 2,
    gameSlug: "alpha-clash",
    stateVersion: 1,
    actorId: "p1",
    status: "ready",
    actions: [
      {
        id: "playCard:card",
        requestId: "play:1",
        intent: "play-card",
        text: { key: "Play card" },
        enabled: true,
        inputs,
      },
    ],
  };
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root.render(
      <HeadlessMantineProvider>
        <InteractionWorkspace view={view} viewerId="p1" onSubmit={submit}>
          <InteractionActionMenu view={view} viewerId="p1" />
          <InteractionDraftPrompt view={view} viewerId="p1" onSubmit={submit} embedded />
        </InteractionWorkspace>
      </HeadlessMantineProvider>,
    ),
  );
  click("Play card");
  return submit;
}
function click(label: string) {
  const button = [...document.querySelectorAll("button")].find(
    (node) => node.textContent?.trim() === label,
  );
  if (!button) throw new Error(`Missing button: ${label}`);
  act(() => button.click());
}

test("normal payment explicitly omits the alternate cost", () => {
  const submit = render();
  expect(submit).not.toHaveBeenCalled();
  click("Use normal cost");
  expect(submit).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ values: {} }));
});

test("alternate payment still submits the selected card", () => {
  const submit = render();
  click("Choose card");
  click("Payment card");
  // Drawer selections require confirmation.
  const confirm = [...document.querySelectorAll("button")].find(
    (node) => node.textContent?.trim() === "Confirm",
  );
  if (confirm) act(() => confirm.click());
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { alternateCostCardIds: ["payment"] } }),
  );
});

test("skipping a cost preserves the following required decision", () => {
  const submit = render([
    cost,
    {
      kind: "boolean",
      id: "choice",
      required: true,
      text: { key: "Confirm choice" },
      trueText: { key: "Yes" },
      falseText: { key: "No" },
    },
  ]);
  click("Use normal cost");
  expect(submit).not.toHaveBeenCalled();
  click("Yes");
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { choice: true } }),
  );
});

test("a conditionally required cost cannot be skipped", () => {
  const submit = render([
    {
      kind: "option-selection",
      id: "mode",
      required: true,
      implicit: true,
      min: 1,
      max: 1,
      text: { key: "Mode" },
      options: [{ id: "alternate", text: { key: "Alternate" }, enabled: true }],
    },
    { ...cost, requiredWhen: [{ all: [{ inputId: "mode", value: "alternate" }] }] },
  ]);
  expect(document.body.textContent).not.toContain("Use normal cost");
  expect(submit).not.toHaveBeenCalled();
});

test("normal payment retains a later implicit choice", () => {
  const submit = render([
    cost,
    {
      kind: "option-selection",
      id: "source",
      required: true,
      implicit: true,
      min: 1,
      max: 1,
      text: { key: "Source" },
      options: [{ id: "payment", text: { key: "Payment" }, enabled: true }],
    },
  ]);
  click("Use normal cost");
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { source: ["payment"] } }),
  );
});

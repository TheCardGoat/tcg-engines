// @vitest-environment jsdom
import { HeadlessMantineProvider } from "@mantine/core";
import type { EngineInteractionView } from "@tcg/protocol";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vite-plus/test";
import {
  InteractionWorkspace,
  InteractionActionMenu,
  InteractionDraftPrompt,
} from "./InteractionWorkspace";
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

test("slots retain a draft, prevent duplicate use, cancel without submitting, and retry rejection", () => {
  const submit = vi.fn((_submission: unknown) => false);
  const view: EngineInteractionView = {
    protocolVersion: 2,
    gameSlug: "alpha-clash",
    actorId: "p1",
    stateVersion: 1,
    status: "ready",
    actions: [
      {
        id: "play",
        requestId: "play:1",
        intent: "play-card",
        enabled: true,
        text: { key: "Play" },
        inputs: [
          {
            kind: "option-selection",
            id: "pay",
            text: { key: "Pay" },
            required: true,
            min: 2,
            max: 2,
            options: [
              {
                id: "a-blue",
                entity: { kind: "card", instanceId: "a" },
                text: { key: "A blue" },
                enabled: true,
              },
              {
                id: "a-green",
                entity: { kind: "card", instanceId: "a" },
                text: { key: "A green" },
                enabled: true,
              },
              {
                id: "b-green",
                entity: { kind: "card", instanceId: "b" },
                text: { key: "B green" },
                enabled: true,
              },
            ],
            presentation: {
              kind: "cost-slots",
              slots: [
                { text: { key: "Blue" }, optionIds: ["a-blue"] },
                { text: { key: "Green" }, optionIds: ["a-green", "b-green"] },
              ],
            },
          },
        ],
      },
    ],
  };
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const click = (label: string) =>
    act(() =>
      [...container.querySelectorAll("button")].find((b) => b.textContent === label)!.click(),
    );
  const select = (index: number, value: string) =>
    act(() => {
      const node = container.querySelectorAll("select")[index]!;
      node.value = value;
      node.dispatchEvent(new Event("change", { bubbles: true }));
    });
  try {
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
    click("Play");
    select(0, "a-blue");
    expect(container.querySelector<HTMLOptionElement>('option[value="a-green"]')!.disabled).toBe(
      true,
    );
    expect(submit).not.toHaveBeenCalled();
    click("Cancel payment");
    expect(submit).not.toHaveBeenCalled();
    click("Play");
    select(0, "a-blue");
    select(1, "b-green");
    expect(submit).not.toHaveBeenCalled();
    click("Pay cost");
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit.mock.calls[0]?.[0]).toMatchObject({ values: { pay: ["a-blue", "b-green"] } });
    click("Play");
    select(0, "a-blue");
    select(1, "b-green");
    click("Pay cost");
    expect(submit).toHaveBeenCalledTimes(2);
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});

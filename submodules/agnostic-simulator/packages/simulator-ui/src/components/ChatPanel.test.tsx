// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { ChatPanel, type ChatPanelProps } from "./ChatPanel";

let activeRoot: Root | null = null;
let activeContainer: HTMLDivElement | null = null;

afterEach(() => {
  if (activeRoot) {
    act(() => activeRoot?.unmount());
  }
  activeContainer?.remove();
  activeRoot = null;
  activeContainer = null;
});

function renderPanel(props: Partial<ChatPanelProps> = {}): HTMLDivElement {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  act(() =>
    activeRoot?.render(
      <ChatPanel
        messages={[]}
        presets={[
          { id: "good_luck", label: "Good luck!" },
          { id: "thanks", label: "Thanks!" },
        ]}
        {...props}
      />,
    ),
  );
  return activeContainer;
}

function inputText(input: HTMLInputElement, value: string): void {
  act(() => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    if (descriptor?.set) {
      // oxlint-disable-next-line typescript/unbound-method
      Reflect.apply(descriptor.set, input, [value]);
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("ChatPanel", () => {
  test("renders preset messages and sends selected presets", () => {
    const onSendPreset = vi.fn();

    renderPanel({ onSendPreset });

    const presetButtons = document.body.querySelectorAll('[data-testid="chat-quick"]');
    expect(presetButtons).toHaveLength(2);

    act(() => {
      presetButtons[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onSendPreset).toHaveBeenCalledWith("good_luck");
  });

  test("hides free text input while free text is disabled", () => {
    renderPanel({ freeTextEnabled: false });

    expect(document.body.querySelector('[data-testid="chat-input"]')).toBeNull();
    expect(document.body.querySelector('[data-testid="chat-send"]')).toBeNull();
    expect(document.body.textContent).toContain("Preset messages only in this match.");
  });

  test("requests free text and shows pending state", () => {
    const onRequestFreeText = vi.fn();

    renderPanel({
      canRequestFreeText: true,
      onRequestFreeText,
    });

    const requestButton = document.body.querySelector('[data-testid="chat-request-free-text"]');
    expect(requestButton).toBeInstanceOf(HTMLButtonElement);
    expect(requestButton?.textContent).toContain("Request free text");

    act(() => {
      requestButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onRequestFreeText).toHaveBeenCalledTimes(1);

    act(() => {
      activeRoot?.render(
        <ChatPanel
          messages={[]}
          presets={[{ id: "good_luck", label: "Good luck!" }]}
          canRequestFreeText
          freeTextProposalPending
          onRequestFreeText={onRequestFreeText}
        />,
      );
    });

    const pendingButton = document.body.querySelector(
      '[data-testid="chat-request-free-text"]',
    ) as HTMLButtonElement | null;
    expect(pendingButton?.disabled).toBe(true);
    expect(pendingButton?.textContent).toContain("Waiting for opponent");
  });

  test("sends free text only when enabled", () => {
    const onSendText = vi.fn();

    renderPanel({ freeTextEnabled: true, onSendText });

    const input = document.body.querySelector('[data-testid="chat-input"]') as HTMLInputElement;
    const sendButton = document.body.querySelector('[data-testid="chat-send"]');

    inputText(input, "  Nice play.  ");
    act(() => {
      sendButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onSendText).toHaveBeenCalledWith("Nice play.");
    expect(input.value).toBe("");
  });
});

// @vitest-environment jsdom

import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import { HeadlessMantineProvider } from "@mantine/core";
import { act, useEffect, useState, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup as renderReactToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import {
  InteractionDraftProvider,
  useInteractionDraft,
} from "../interactions/InteractionDraftContext";
import {
  interactionBoundsCopy,
  interactionCommitMode,
  interactionTargetPresentation,
} from "../interactions/interaction-presentation";
import { InteractionResolutionPrompt } from "./InteractionResolutionPrompt";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

let activeRoot: Root | null = null;
let activeContainer: HTMLDivElement | null = null;

afterEach(() => {
  vi.useRealTimers();
  if (activeRoot) act(() => activeRoot?.unmount());
  activeContainer?.remove();
  activeRoot = null;
  activeContainer = null;
});

describe("InteractionResolutionPrompt", () => {
  test("drags only from its handle, stays visible, and does not submit the interaction", () => {
    const submit = vi.fn();
    const container = renderClient(
      <InteractionResolutionPrompt
        view={targetView({ min: 1, max: 1 })}
        viewerId="p1"
        mobileDraggable
        onSubmit={submit}
      />,
    );
    const prompt = container.querySelector<HTMLElement>("[data-mobile-draggable='true']")!;
    const handle = container.querySelector<HTMLButtonElement>(
      '[aria-label="Move prompt vertically"]',
    )!;
    handle.setPointerCapture = vi.fn();
    handle.hasPointerCapture = () => true;
    handle.releasePointerCapture = vi.fn();
    prompt.getBoundingClientRect = () =>
      new DOMRect(
        8,
        600 + (Number.parseFloat(prompt.style.getPropertyValue("--prompt-drag-offset")) || 0),
        374,
        160,
      );
    const pointer = (type: string, y: number) => {
      const event = new MouseEvent(type, { bubbles: true, clientY: y, button: 0 });
      Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: true } });
      act(() => handle.dispatchEvent(event));
    };
    pointer("pointerdown", 620);
    pointer("pointermove", 300);
    expect(prompt.style.getPropertyValue("--prompt-drag-offset")).toBe("-320px");
    pointer("pointermove", -1000);
    expect(prompt.getBoundingClientRect().top).toBe(8);
    pointer("pointerup", -1000);
    pointer("pointermove", 620);
    expect(prompt.getBoundingClientRect().top).toBe(8);
    expect(prompt.hasAttribute("data-dragging")).toBe(false);
    act(() =>
      handle.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" })),
    );
    expect(prompt.getBoundingClientRect().top).toBe(40);
    act(() => handle.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Home" })));
    expect(prompt.style.getPropertyValue("--prompt-drag-offset")).toBe("0px");
    expect(submit).not.toHaveBeenCalled();
  });

  test("can remain as an instruction rail while game-owned controls resolve the decision", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={boundedNumberView(0, 3)} viewerId="p1" instructionOnly />,
    );

    expect(markup).toContain("Choose the new die value");
    expect(markup).not.toContain('aria-label="Amount"');
    expect(markup).not.toContain("Confirm amount");
  });

  test("humanizes untranslated protocol keys instead of exposing localization identifiers", () => {
    const view = targetView({ min: 1, max: 1 });
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={view} viewerId="p1" visibleEntityIds={new Set()} />,
    );

    expect(markup).toContain(">Kamille Bidan<");
    expect(markup).toContain(">— When Linked<");
    expect(markup).not.toContain("Resolving:");
    expect(markup).not.toContain("gundam.move.resolveEffect");
  });

  test("keeps registered exact-one candidates spatial without a confirm action", () => {
    const view = targetView({ min: 1, max: 1 });
    const input = view.actions[0]!.inputs[1]!;

    expect(interactionTargetPresentation(input, new Set(["unit-a", "unit-b"]))).toBe("spatial");
    expect(interactionCommitMode(input)).toBe("immediate");
    expect(interactionBoundsCopy({ required: true, min: 1, max: 1 })).toBe(
      "Required · Choose exactly 1 target",
    );

    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        visibleEntityIds={new Set(["unit-a", "unit-b"])}
      />,
    );
    expect(markup).toContain('data-presentation="spatial"');
    expect(markup).toContain("Step");
    expect(markup).toContain('aria-label="Required — choose exactly 1 target."');
    expect(markup).toContain(">Kamille Bidan<");
    expect(markup).toContain(">— When Linked<");
    expect(markup).not.toContain(">Confirm<");
    expect(markup).not.toContain('aria-label="Available choices"');
    expect(markup).toContain('aria-label="Prompt controls"');
  });

  test("labels cost-card selections as cards instead of targets", () => {
    const view = targetView({ min: 1, max: 3 });
    const action = view.actions[0]!;
    const targetInput = action.inputs[1]!;
    if (targetInput.kind !== "entity-selection") throw new Error("Expected entity-selection input");
    const costInput = { ...targetInput, role: "cost" as const };
    const costView: EngineInteractionView = {
      ...view,
      actions: [
        {
          ...action,
          intent: "resource-card",
          inputs: [action.inputs[0]!, costInput],
        },
      ],
    };

    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={costView} viewerId="p1" visibleEntityIds={new Set()} />,
    );

    expect(markup).toContain("Choose card");
    expect(markup).not.toContain("Choose target");
  });

  test("uses the caller's top placement for targets that need the lower board unobscured", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={targetView({ min: 1, max: 1 })}
        viewerId="p1"
        preferredPlacement="top"
      />,
    );

    expect(markup).toContain('data-placement="top"');
  });

  test("submits a secondary no-input undo action during an active resolution", () => {
    const base = targetView({ min: 1, max: 1 });
    const undo = {
      id: "cancel-play",
      requestId: base.actions[0]!.requestId,
      intent: "undo" as const,
      text: { key: "Cancel play" },
      enabled: true,
      inputs: [],
    };
    const view: EngineInteractionView = {
      ...base,
      actions: [...base.actions, undo],
    };
    const onSubmit = vi.fn();
    const container = renderClient(
      <InteractionResolutionPrompt view={view} viewerId="p1" onSubmit={onSubmit} />,
    );

    act(() => button(container, "Cancel play").click());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "cancel-play", values: {} }),
    );
  });

  test("presents and submits a ready inputless action with caller-owned prompt copy", () => {
    const view: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "p1",
      stateVersion: 7,
      status: "ready",
      actions: [
        {
          id: "pass-priority",
          requestId: "pass:7",
          intent: "pass",
          text: { key: "Pass priority" },
          enabled: true,
          inputs: [],
        },
      ],
    };
    const onSubmit = vi.fn();
    const container = renderClient(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        actionId="pass-priority"
        actionPresentation={{
          title: "Priority: You",
          body: "Your next attack this turn has dominate.",
          footerInstruction: "Respond to the top layer or pass priority.",
          submitLabel: "Pass priority",
        }}
        onSubmit={onSubmit}
      />,
    );

    expect(container.textContent).toContain("Priority: You");
    expect(container.textContent).toContain("Your next attack this turn has dominate");
    expect(container.textContent).not.toContain("Respond to the top layer or pass priority");
    openPromptControls(container);
    const showDetails = utilityAction("Show details");
    const detailsId = showDetails.getAttribute("aria-controls");
    act(() => showDetails.click());
    expect(container.textContent).toContain("Respond to the top layer or pass priority");
    expect(detailsId).toBeTruthy();
    expect(container.querySelector(`#${detailsId}`)?.textContent).not.toContain(
      "Your next attack this turn has dominate.",
    );
    const prompt = container.querySelector<HTMLElement>('[role="region"]');
    if (!prompt) throw new Error("Expected compact interaction prompt region.");
    void act(() =>
      prompt.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" })),
    );
    expect(container.textContent).not.toContain("Respond to the top layer or pass priority");
    expect(prompt.dataset.minimized).toBe("false");
    expect(container.textContent).not.toContain("Cancel");
    act(() => button(container, "Pass priority").click());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "pass-priority", values: {} }),
    );
  });

  test("lets a game render native inline tokens throughout prompt copy", () => {
    const view: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "p1",
      stateVersion: 8,
      status: "ready",
      actions: [
        {
          id: "activate",
          requestId: "activate:8",
          intent: "activate",
          text: { key: "Spend {r} to activate" },
          enabled: true,
          inputs: [],
        },
      ],
    };
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        actionId="activate"
        actionPresentation={{
          title: "Activate for {r}",
          body: "Spend {r} to continue.",
        }}
        renderText={(text) => <span data-native-text>{text.replaceAll("{r}", "RESOURCE")}</span>}
      />,
    );

    expect(markup).toContain("Activate for RESOURCE");
    expect(markup).toContain("Spend RESOURCE to continue.");
    expect(markup).toContain("Spend RESOURCE to activate");
    expect(markup).not.toContain("{r}");
  });

  test("makes the transformed action body a keyboard-accessible tooltip trigger", async () => {
    vi.useFakeTimers();
    const view: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "p1",
      stateVersion: 8,
      status: "ready",
      actions: [
        {
          id: "pass-priority",
          requestId: "pass-priority:8",
          intent: "pass",
          text: { key: "Pass priority" },
          enabled: true,
          inputs: [],
        },
      ],
    };
    const container = renderClient(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        actionId="pass-priority"
        actionPresentation={{
          body: "Prevent {r} damage, then continue resolving the effect.",
        }}
        renderInstruction={(text) => (
          <span data-native-card-text>{text.replaceAll("{r}", "RESOURCE")}</span>
        )}
      />,
    );
    const cardText = container.querySelector<HTMLElement>(
      '[data-testid="interaction-action-body"]',
    )!;

    expect(cardText.tabIndex).toBe(0);
    expect(cardText.textContent).toBe(
      "Prevent RESOURCE damage, then continue resolving the effect.",
    );
    expect(cardText.querySelector("[data-native-card-text]")).not.toBeNull();
    expect(cardText.textContent).not.toContain("{r}");

    act(() => cardText.focus());
    await act(async () => {
      vi.advanceTimersByTime(251);
      await Promise.resolve();
    });
    const tooltip = document.body.querySelector<HTMLElement>('[role="tooltip"]');
    expect(tooltip?.textContent).toContain(
      "Prevent RESOURCE damage, then continue resolving the effect.",
    );
    expect(tooltip?.closest('[data-testid="interaction-resolution-prompt"]')).toBeNull();
  });

  test("requires an explicit numeric value, including zero, and submits the selected amount", () => {
    const view: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "p1",
      stateVersion: 9,
      status: "choosing",
      resolution: {
        actingPlayerId: "p1",
        pendingCount: 1,
        currentEffect: {
          id: "payment-amount",
          text: { key: "Choose how much to pay" },
        },
        currentStep: {
          index: 1,
          count: 1,
          text: { key: "Choose how much to pay" },
          requirement: {
            kind: "number",
            text: { key: "Choose how much to pay" },
            required: true,
            min: 0,
            max: 3,
          },
        },
      },
      actions: [
        {
          id: "choose-payment-amount",
          requestId: "payment-amount:9",
          intent: "choose-option",
          text: { key: "Choose how much to pay" },
          enabled: true,
          inputs: [
            {
              kind: "number",
              id: "answer",
              text: { key: "Choose how much to pay" },
              required: true,
              min: 0,
              max: 3,
              step: 1,
            },
          ],
        },
      ],
    };
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({});
      return (
        <InteractionResolutionPrompt
          view={view}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) => setValues((current) => ({ ...current, [inputId]: value }))}
          onClearInput={(inputId) =>
            setValues((current) =>
              Object.fromEntries(Object.entries(current).filter(([key]) => key !== inputId)),
            )
          }
          onSubmit={submit}
        />
      );
    }

    const container = renderClient(<Harness />);
    const amount = container.querySelector<HTMLInputElement>('input[type="number"]');
    if (!amount) throw new Error("Expected amount input.");
    const confirm = button(container, "Confirm amount");

    expect(amount.value).toBe("3");
    expect(confirm.disabled).toBe(false);
    expect(container.querySelector('[aria-label="Choose an amount from 0 to 3."]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Decrease amount"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Increase amount"]')).not.toBeNull();
    expect(container.textContent).not.toContain("target");
    expect(container.textContent).not.toContain("Choose none");

    act(() =>
      container.querySelector<HTMLButtonElement>('[aria-label="Decrease amount"]')!.click(),
    );
    expect(amount.value).toBe("2");
    act(() =>
      container.querySelector<HTMLButtonElement>('[aria-label="Increase amount"]')!.click(),
    );
    expect(amount.value).toBe("3");

    act(() => confirm.click());
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ values: { answer: 3 } }));

    act(() => {
      const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      if (!valueDescriptor?.set) throw new Error("Expected native input value setter.");
      valueDescriptor.set.call(amount, "");
      amount.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(amount.value).toBe("");
    expect(confirm.disabled).toBe(true);

    act(() => {
      const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      if (!valueDescriptor?.set) throw new Error("Expected native input value setter.");
      valueDescriptor.set.call(amount, "0");
      amount.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => confirm.click());
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ values: { answer: 0 } }));
  });

  test("combines an optional effect with its dependent amount decision", () => {
    const baseView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "p1",
      stateVersion: 10,
      status: "choosing",
      resolution: {
        actingPlayerId: "p1",
        pendingCount: 1,
        currentEffect: {
          id: "dig-in",
          text: { key: "Choose how much to pay for Dig In" },
        },
        currentStep: {
          index: 1,
          count: 1,
          text: { key: "Choose how much to pay for Dig In" },
          requirement: {
            kind: "number",
            text: { key: "Choose how much to pay for Dig In" },
            required: true,
            min: 0,
            max: 3,
          },
        },
      },
      actions: [
        {
          id: "resolve-dig-in",
          requestId: "dig-in:10",
          intent: "choose-option",
          text: { key: "Choose how much to pay for Dig In" },
          enabled: true,
          inputs: [
            {
              kind: "boolean",
              id: "optional",
              text: { key: "Use the optional effect of Dig In?" },
              required: true,
              trueText: { key: "Use effect" },
              falseText: { key: "Decline" },
            },
            {
              kind: "number",
              id: "answer",
              text: { key: "Choose how much to pay for Dig In" },
              required: false,
              requiredWhen: [{ all: [{ inputId: "optional", value: true }] }],
              min: 0,
              max: 3,
              step: 1,
            },
          ],
        },
      ],
    };
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({});
      return (
        <InteractionResolutionPrompt
          view={baseView}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) => setValues((current) => ({ ...current, [inputId]: value }))}
          onClearInput={(inputId) =>
            setValues((current) =>
              Object.fromEntries(Object.entries(current).filter(([key]) => key !== inputId)),
            )
          }
          onSubmit={submit}
        />
      );
    }

    const container = renderClient(<Harness />);
    const amount = container.querySelector<HTMLInputElement>('input[type="number"]');
    if (!amount) throw new Error("Expected combined amount input.");

    expect(container.textContent).toContain("Skip effect");
    expect(container.textContent).toContain("Confirm amount");
    expect(container.textContent).not.toContain("Use effect");
    expect(container.textContent).not.toContain("Decline");
    expect(amount.value).toBe("3");
    expect(button(container, "Confirm amount").disabled).toBe(false);

    act(() => button(container, "Skip effect").click());
    expect(submit).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: { optional: false } }),
    );

    act(() => button(container, "Confirm amount").click());
    expect(submit).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: { optional: true, answer: 3 } }),
    );

    act(() => {
      const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      if (!valueDescriptor?.set) throw new Error("Expected native input value setter.");
      valueDescriptor.set.call(amount, "0");
      amount.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => button(container, "Confirm amount").click());
    expect(submit).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: { optional: true, answer: 0 } }),
    );
  });

  test("preserves typed multi-digit amounts until confirmation validation", () => {
    function Harness() {
      const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({});
      return (
        <InteractionResolutionPrompt
          view={boundedNumberView(6, 12)}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) => setValues((current) => ({ ...current, [inputId]: value }))}
        />
      );
    }

    const container = renderClient(<Harness />);
    const amount = container.querySelector<HTMLInputElement>('input[type="number"]')!;
    const confirm = button(container, "Confirm amount");
    const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    const setNativeValue = (value: string) => {
      if (!valueDescriptor?.set) throw new Error("Expected native input value setter.");
      valueDescriptor.set.call(amount, value);
    };

    act(() => {
      setNativeValue("1");
      amount.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(amount.value).toBe("1");
    expect(confirm.disabled).toBe(true);

    act(() => {
      setNativeValue("10");
      amount.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(amount.value).toBe("10");
    expect(confirm.disabled).toBe(false);
  });

  test("stages optional singleton spatial targets behind Confirm by default", () => {
    const view = targetView({ min: 0, max: 1 });
    const input = view.actions[0]!.inputs[1]!;

    expect(interactionCommitMode(input)).toBe("confirm");

    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        visibleEntityIds={new Set(["unit-a", "unit-b"])}
      />,
    );

    expect(markup).toContain('data-presentation="spatial"');
    expect(markup).toContain(">Choose none<");
    expect(markup).toContain(">Confirm<");
  });

  test("resolves optional singleton spatial targets on click when a surface opts in", () => {
    const view = targetView({ min: 0, max: 1 });
    const input = view.actions[0]!.inputs[1]!;

    expect(interactionCommitMode(input, { immediateOptionalSingletons: true })).toBe("immediate");

    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        visibleEntityIds={new Set(["unit-a", "unit-b"])}
        immediateOptionalSingletons
      />,
    );

    expect(markup).toContain('data-presentation="spatial"');
    expect(markup).toContain(">Choose none<");
    expect(markup).not.toContain(">Confirm<");
  });

  test("keeps Confirm available for two spatial target groups", () => {
    const view = groupedTargetView();
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        values={{ "targetGroups.0": ["unit-a"], "targetGroups.1": ["unit-c"] }}
        visibleEntityIds={new Set(["unit-a", "unit-b", "unit-c", "unit-d"])}
        selectionSummary={{ selected: 2, max: 2, canConfirm: true }}
      />,
    );

    expect(markup).toContain('data-presentation="spatial"');
    expect(markup).toContain("2 of 2");
    expect(markup).toContain(">Confirm<");
    expect(markup).not.toContain('disabled=""');
  });

  test("shows live progress for an exact multi-card selection", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={targetView({ min: 2, max: 2 })}
        viewerId="p1"
        values={{ targets: ["unit-a"] }}
        visibleEntityIds={new Set(["unit-a", "unit-b"])}
      />,
    );

    expect(markup).toContain('data-selection-progress="true"');
    expect(markup).toContain('aria-label="Selection progress — 1 of 2 selected."');
    expect(markup).toContain(">1/2<");
    expect(markup).not.toContain(">Change selection<");
    expect(markup).not.toContain('aria-label="Current selections"');
    expect(markup).not.toContain('aria-label="Remove unit-a"');
  });

  test("uses a drawer, selection meter, clear, and confirm for non-spatial multi-targets", () => {
    const view = targetView({ min: 1, max: 2 });
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        values={{ targets: ["unit-a"] }}
        visibleEntityIds={new Set()}
      />,
    );

    expect(markup).toContain('data-presentation="drawer"');
    expect(markup).toContain('aria-label="Current selections"');
    expect(markup).toContain("Selected");
    expect(markup).toContain('aria-label="Selection progress — 1 of 2 selected."');
    expect(markup).toContain(">Change selection<");
    expect(markup).toContain(">Confirm<");
    expect(markup).toContain('aria-label="Prompt controls"');
  });

  test("offers a labeled footer action to reopen an empty card chooser", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={targetView({ min: 0, max: 1 })}
        viewerId="p1"
        visibleEntityIds={new Set()}
        choiceModal={{
          title: "Search your deck",
          filter: { kind: "entity", entityKind: "card", zoneRole: "deck" },
          table: {
            status: {
              activeSeatId: "p1",
              phase: "Main",
              stateVersion: 1,
              turn: 1,
            },
            seats: [],
            zones: [],
          },
          entities: [],
        }}
      />,
    );

    expect(markup).toContain(">Choose card<");
    expect(markup).toContain(">Choose none<");
  });

  test("toggles multiple inline options and confirms the complete selection", () => {
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({});
      return (
        <InteractionResolutionPrompt
          view={multiOptionView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) => setValues((current) => ({ ...current, [inputId]: value }))}
          onSubmit={submit}
        />
      );
    }

    const container = renderClient(<Harness />);
    const instant = button(container, "Banish target instant");
    const yellow = button(container, "Banish target yellow card");
    const confirm = button(container, "Confirm selections");

    expect(instant.getAttribute("aria-pressed")).toBe("false");
    expect(yellow.getAttribute("aria-pressed")).toBe("false");
    expect(confirm.disabled).toBe(true);
    expect(
      container.querySelector('[aria-label="Selection progress — 0 of 2 selected."]'),
    ).not.toBeNull();

    act(() => instant.click());
    act(() => yellow.click());
    expect(instant.getAttribute("aria-pressed")).toBe("true");
    expect(yellow.getAttribute("aria-pressed")).toBe("true");
    expect(confirm.disabled).toBe(false);
    expect(
      container.querySelector('[aria-label="Selection progress — 2 of 2 selected."]'),
    ).not.toBeNull();
    expect(container.textContent).not.toContain("Change selection");

    act(() => yellow.click());
    expect(instant.getAttribute("aria-pressed")).toBe("true");
    expect(yellow.getAttribute("aria-pressed")).toBe("false");
    expect(
      container.querySelector('[aria-label="Selection progress — 1 of 2 selected."]'),
    ).not.toBeNull();
    act(() => yellow.click());

    act(() => confirm.click());
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ values: { modes: ["instant", "yellow"] } }),
    );
  });

  test("submits direct option outcomes immediately without a redundant confirmation", () => {
    const submit = vi.fn();
    const container = renderClient(
      <InteractionResolutionPrompt view={directOptionView()} viewerId="p1" onSubmit={submit} />,
    );

    expect(container.textContent).toContain("Prevent incoming arcane damage?");
    expect(container.textContent).toContain("Voltic Bolt would deal 5 arcane damage.");
    expect(container.textContent).not.toContain("Choose none");
    expect(container.textContent).not.toContain("Confirm");
    expect(container.textContent).not.toContain("0/1");
    expect(container.textContent).not.toContain("Show details");
    expect(container.querySelector('[data-option-presentation="direct"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Current selections"]')).toBeNull();
    expect(container.querySelectorAll('[data-choice-emphasis="neutral"]')).toHaveLength(2);

    act(() => button(container, "Take 5 arcane damage").click());
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ values: { answer: [] } }));

    act(() => button(container, "Nullrune Robe · Pay 1 resource · Prevent 1 · Take 4").click());
    expect(submit).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: { answer: ["robe:arcane-barrier"] } }),
    );
  });

  test("searches large option sets instead of rendering every choice over the board", () => {
    const submit = vi.fn();
    function Harness() {
      const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({});
      return (
        <InteractionResolutionPrompt
          view={largeCardNameView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) => setValues((current) => ({ ...current, [inputId]: value }))}
          onSubmit={submit}
        />
      );
    }
    const container = renderClient(<Harness />);

    const search = container.querySelector<HTMLInputElement>('input[type="search"]');
    if (!search) throw new Error("Expected the large-choice search input.");
    expect(search.getAttribute("placeholder")).toBe("Type a card name");
    expect(container.textContent).toContain("Search the full catalog");
    expect(container.textContent).toContain("In your hand");
    expect(container.textContent).toContain("Snatch");
    expect(
      container.querySelector('[aria-label="Required — choose exactly 1 card name."]'),
    ).not.toBeNull();

    const searchFor = (value: string) =>
      act(() => {
        const valueDescriptor = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        );
        valueDescriptor?.set?.call(search, value);
        search.dispatchEvent(new Event("input", { bubbles: true }));
      });

    searchFor("eclair");
    expect(container.textContent).toContain("Éclair");
    searchFor("snat");

    expect(container.textContent).toContain("1 match.");
    act(() => button(container, "Snatch").click());
    expect(submit).not.toHaveBeenCalled();
    const confirm = button(container, "Use this name");
    expect(confirm.disabled).toBe(false);
    act(() => confirm.click());
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({ answer: ["fab-card-name:Snatch"] }),
      }),
    );
  });

  test("portals available choices above the isolated tabletop and sidebar", () => {
    const container = renderClient(
      <InteractionResolutionPrompt view={targetView({ min: 1, max: 2 })} viewerId="p1" />,
    );

    openChoices(container);

    expect(container.querySelector('[aria-label="Available choices"]')).toBeNull();
    expect(document.body.querySelector('[aria-label="Available choices"]')).not.toBeNull();
  });

  test("keeps available choices open when responsive placement changes", () => {
    const view = targetView({ min: 1, max: 2 });
    const container = renderClient(
      <InteractionResolutionPrompt view={view} viewerId="p1" preferredPlacement="bottom" />,
    );
    openChoices(container);

    act(() =>
      activeRoot?.render(
        <HeadlessMantineProvider>
          <InteractionResolutionPrompt view={view} viewerId="p1" preferredPlacement="top" />
        </HeadlessMantineProvider>,
      ),
    );

    expect(container.querySelector<HTMLElement>("[data-placement='top']")).not.toBeNull();
    expect(document.body.querySelector('[aria-label="Available choices"]')).not.toBeNull();
  });

  test("confirms a completed multi-card selection from the fallback choice browser", () => {
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({});
      return (
        <InteractionResolutionPrompt
          view={targetView({ min: 2, max: 2 })}
          viewerId="p1"
          values={values}
          visibleEntityIds={new Set()}
          onChange={(inputId, value) => setValues((current) => ({ ...current, [inputId]: value }))}
          onSubmit={submit}
        />
      );
    }

    const container = renderClient(<Harness />);
    openChoices(container);
    const dialog = document.body.querySelector<HTMLElement>('[aria-label="Available choices"]')!;
    const confirm = button(dialog, "Confirm");
    expect(confirm.disabled).toBe(true);

    act(() => button(dialog, "unit-a").click());
    act(() => button(dialog, "unit-b").click());
    expect(confirm.disabled).toBe(false);
    act(() => confirm.click());

    expect(document.body.querySelector('[aria-label="Available choices"]')).toBeNull();
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({ targets: ["unit-a", "unit-b"] }),
      }),
    );
  });

  test("moves focus into the fallback choice browser, traps it, and restores the trigger", () => {
    const container = renderClient(
      <InteractionResolutionPrompt view={targetView({ min: 1, max: 2 })} viewerId="p1" />,
    );
    const trigger = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Prompt controls"]',
    )!;
    trigger.focus();
    openChoices(container);

    const dialog = document.body.querySelector<HTMLElement>('[aria-label="Available choices"]')!;
    const close = dialog.querySelector<HTMLButtonElement>(
      'button[aria-label="Close available choices"]',
    )!;
    const candidates = [...dialog.querySelectorAll<HTMLButtonElement>("button")];
    expect(document.activeElement).toBe(close);

    const last = candidates[candidates.length - 1]!;
    last.focus();
    act(() => {
      last.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }));
    });
    expect(document.activeElement).toBe(close);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(document.activeElement).toBe(trigger);
  });

  test("keeps a required singleton entity choice visible and confirmable", () => {
    const view = targetView({ min: 1, max: 1 });
    const target = view.actions[0]!.inputs[1]!;
    if (target.kind !== "entity-selection") throw new Error("Expected target input");
    const singletonView: EngineInteractionView = {
      ...view,
      actions: [
        {
          ...view.actions[0]!,
          inputs: [view.actions[0]!.inputs[0]!, { ...target, candidates: [target.candidates[0]!] }],
        },
      ],
    };

    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={singletonView}
        viewerId="p1"
        visibleEntityIds={new Set()}
      />,
    );

    expect(markup).toContain('data-presentation="drawer"');
    expect(markup).toContain('aria-label="Prompt controls"');
    expect(markup).toContain(">Confirm<");
  });

  test("allows a requested singleton drawer choice to resolve with its card click", () => {
    const view = targetView({ min: 1, max: 1 });
    const target = view.actions[0]!.inputs[1]!;
    if (target.kind !== "entity-selection") throw new Error("Expected target input");
    const singletonView: EngineInteractionView = {
      ...view,
      actions: [
        {
          ...view.actions[0]!,
          inputs: [view.actions[0]!.inputs[0]!, { ...target, candidates: [target.candidates[0]!] }],
        },
      ],
    };

    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={singletonView}
        viewerId="p1"
        visibleEntityIds={new Set()}
        immediateDrawerSelection
      />,
    );

    expect(markup).toContain('aria-label="Prompt controls"');
    expect(markup).not.toContain(">Confirm<");
  });

  test("presents optional targets immediately with Skip instead of an accept step", () => {
    const view = optionalTargetView();
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={view} viewerId="p1" visibleEntityIds={new Set()} />,
    );

    expect(markup).toContain('data-presentation="drawer"');
    expect(markup).toContain('aria-label="Prompt controls"');
    expect(markup).toContain("Choose a card to continue, or skip this effect.");
    expect(markup).not.toContain("select a highlighted card");
    expect(markup).toContain(">Skip effect<");
    expect(markup).toContain(">Confirm<");
    expect(markup).not.toContain(">Resolve<");
  });

  test("describes optional entity costs as payments instead of highlighted targets", () => {
    const view = optionalTargetView({ min: 1, max: 1 });
    const action = view.actions[0]!;
    const target = action.inputs.at(-1)!;
    if (target.kind !== "entity-selection") throw new Error("Expected entity selection");
    const paymentView: EngineInteractionView = {
      ...view,
      actions: [
        {
          ...action,
          inputs: [
            ...action.inputs.slice(0, -1),
            {
              ...target,
              role: "cost",
              text: { key: "Pitch a card to pay for Phantasmal Footsteps." },
            },
          ],
        },
      ],
    };

    const paymentMarkup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={paymentView} viewerId="p1" visibleEntityIds={new Set()} />,
    );

    expect(paymentMarkup).toContain("Pitch a card to pay for Phantasmal Footsteps");
    expect(paymentMarkup).not.toContain("select a highlighted card");

    const inlineMarkup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={paymentView}
        viewerId="p1"
        visibleEntityIds={new Set()}
        actionPresentation={{
          body: "Whenever this defends, you may pay {r}. If you do, its {d} becomes 1 until end of turn.",
          inlineTitle: true,
        }}
      />,
    );

    expect(inlineMarkup).toContain('data-inline-title="true"');
    expect(inlineMarkup).toContain("Whenever this defends, you may pay {r}");
  });

  test("submits an optional target choice with the accepted decision", () => {
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({});
      return (
        <InteractionResolutionPrompt
          view={optionalTargetView({ min: 1, max: 1 })}
          viewerId="p1"
          values={values}
          visibleEntityIds={new Set()}
          onChange={(inputId, value) => setValues((current) => ({ ...current, [inputId]: value }))}
          onSubmit={submit}
        />
      );
    }

    const container = renderClient(<Harness />);
    openChoices(container);
    act(() => button(container, "unit-b").click());
    expect(button(container, "Confirm").disabled).toBe(false);
    act(() => button(container, "Confirm").click());

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          "optionalAnswers.0": true,
          targets: ["unit-b"],
        }),
      }),
    );
  });

  test("submits a controlled optional target draft with one Confirm click", () => {
    const view = { ...optionalTargetView(), resolution: undefined };
    const submit = vi.fn(() => true);

    const container = renderClient(
      <InteractionDraftProvider view={view} onSubmit={submit}>
        <DraftControlledPrompt view={view} />
      </InteractionDraftProvider>,
    );
    openChoices(container);
    act(() => button(container, "unit-a").click());
    act(() => button(container, "unit-b").click());
    expect(button(container, "Confirm").disabled).toBe(false);

    act(() => button(container, "Confirm").click());

    expect(submit).toHaveBeenCalledOnce();
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          pendingEffectId: ["effect-1"],
          targets: ["unit-a", "unit-b"],
          "optionalAnswers.0": true,
        },
      }),
    );
  });

  test("clears a selected optional target before a controlled draft skips the effect", () => {
    const view = optionalTargetView({ min: 1, max: 1 });

    function Harness() {
      const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({
        pendingEffectId: ["effect-1"],
        "optionalAnswers.0": true,
      });
      return (
        <>
          <InteractionResolutionPrompt
            view={{ ...view, resolution: undefined }}
            viewerId="p1"
            actionId="resolveEffect"
            values={values}
            visibleEntityIds={new Set()}
            onChange={(inputId, value) =>
              setValues((current) => ({ ...current, [inputId]: value }))
            }
            onClearInput={(inputId) =>
              setValues((current) => {
                const next = { ...current };
                delete next[inputId];
                return next;
              })
            }
          />
          <output data-testid="draft-values">{JSON.stringify(values)}</output>
        </>
      );
    }

    const container = renderClient(<Harness />);
    openChoices(container);
    act(() => button(container, "unit-b").click());
    expect(container.querySelector('[data-testid="draft-values"]')!.textContent).toContain(
      '"targets":["unit-b"]',
    );

    act(() => button(container, "Skip effect").click());
    expect(
      JSON.parse(container.querySelector('[data-testid="draft-values"]')!.textContent!),
    ).toEqual({
      pendingEffectId: ["effect-1"],
      "optionalAnswers.0": false,
    });
  });

  test("includes optional acceptance when a singleton drawer choice submits immediately", () => {
    const submit = vi.fn();

    const container = renderClient(
      <InteractionResolutionPrompt
        view={optionalTargetView({ min: 1, max: 1 })}
        viewerId="p1"
        visibleEntityIds={new Set()}
        immediateDrawerSelection
        onSubmit={submit}
      />,
    );

    openChoices(container);
    act(() => button(container, "unit-b").click());

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          "optionalAnswers.0": true,
          targets: ["unit-b"],
        }),
      }),
    );
  });

  test("leads optional decisions with their player instruction instead of only metadata", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={booleanView()} viewerId="p1" />,
    );

    expect(markup).toContain("Deploy this card.");
    expect(markup).toContain('aria-label="Optional — you can skip this effect."');
    expect(markup).toContain(">Resolve<");
    expect(markup).toContain(">Skip<");
  });

  test("lets a game separate a source heading from repeated instruction copy", () => {
    const view = booleanView();
    const prompt = "Use the optional effect of Fyendal's Spring Tunic?";
    const duplicatedView: EngineInteractionView = {
      ...view,
      resolution: {
        ...view.resolution!,
        currentEffect: {
          ...view.resolution!.currentEffect,
          text: { key: prompt },
        },
        currentStep: {
          ...view.resolution!.currentStep,
          text: { key: prompt },
          requirement: {
            ...view.resolution!.currentStep.requirement!,
            text: { key: prompt },
          },
        },
      },
    };
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={duplicatedView}
        viewerId="p1"
        renderEffectTitle={() => <span>Fyendal's Spring Tunic</span>}
        renderInstruction={() => <span>Use the optional effect?</span>}
      />,
    );

    expect(markup.match(/Use the optional effect/g)).toHaveLength(1);
    expect(markup.indexOf("Fyendal&#x27;s Spring Tunic")).toBeLessThan(
      markup.indexOf("Use the optional effect"),
    );
    expect(markup).toContain("aria-describedby=");
  });

  test("labels a required standalone boolean as a required response", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={requiredBooleanView()} viewerId="p1" />,
    );

    expect(markup).toContain('aria-label="Required — choose one response."');
    expect(markup).not.toContain("Optional — you can skip this effect.");
  });

  test("shows public queue progress to an observer without choices or selection count", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={targetView({ min: 1, max: 1 })} viewerId="p2" />,
    );

    expect(markup).toContain('aria-label="Effect 1 of 2"');
    expect(markup).toContain(">Kamille Bidan<");
    expect(markup).toContain(">— When Linked<");
    expect(markup).not.toContain(">Confirm<");
    expect(markup).not.toContain(">Clear<");
    expect(markup).not.toContain("0 of 1");
  });

  test("uses the focused shared prompt for a valid entity partition", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={partitionView()}
        viewerId="p1"
        values={{
          "deckLookAnswers.0": {
            tutorCardId: ["card-a"],
            toBottom: ["card-b"],
          },
        }}
        renderCandidate={(_input, entityId) => <span>{`preview:${entityId}`}</span>}
      />,
    );

    expect(markup).toContain('data-layout="focused"');
    expect(markup).toContain('role="dialog"');
    expect(markup).toContain("preview:card-a");
    expect(markup).toContain("preview:card-b");
    expect(markup).toContain("Add to Hand");
    expect(markup).toContain("Bottom of Deck");
    expect(markup).toMatch(/_primary_[^"]+">Confirm<\/button>/);
  });

  test("keeps a visible, single-destination partition on the board", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt
        view={optionalPartitionView()}
        viewerId="p1"
        visibleEntityIds={new Set(["card-a", "card-b"])}
      />,
    );

    expect(markup).toContain('data-presentation="spatial"');
    expect(markup).toContain('data-layout="compact"');
    expect(markup).toContain('role="region"');
    expect(markup).not.toContain("Card destinations");
    expect(markup).not.toContain("Your Hand");
    expect(markup).toContain(">Confirm<");
  });

  test("keeps a visible but ineligible partition candidate out of the drawer", () => {
    const view = optionalPartitionView();
    const partition = view.actions[0]!.inputs.find((input) => input.kind === "entity-partition");
    if (partition?.kind !== "entity-partition") {
      throw new Error("Expected partition input");
    }
    const input = {
      ...partition,
      candidates: [
        ...partition.candidates,
        {
          entity: { kind: "card" as const, instanceId: "card-ineligible" },
          enabled: true,
        },
      ],
    };

    expect(
      interactionTargetPresentation(input, new Set(["card-a", "card-b", "card-ineligible"])),
    ).toBe("spatial");
  });

  test("hides private partition candidates from observers", () => {
    const markup = renderToStaticMarkup(
      <InteractionResolutionPrompt view={partitionView()} viewerId="p2" />,
    );

    expect(markup).toContain('aria-label="Effect 1 of 2"');
    expect(markup).not.toContain("card-a");
    expect(markup).not.toContain("Card destinations");
  });

  test("routes each card once and enables Confirm only for a valid partition", () => {
    const submit = vi.fn();
    const renderedCandidates = vi.fn((_input: unknown, entityId: string) => (
      <span data-testid={`preview-${entityId}`}>{entityId}</span>
    ));

    function Harness() {
      const [values, setValues] = useState<Record<string, Record<string, string[]>>>({});
      return (
        <InteractionResolutionPrompt
          view={partitionView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) =>
            setValues((current) => ({
              ...current,
              [inputId]: value as Record<string, string[]>,
            }))
          }
          onSubmit={submit}
          renderCandidate={renderedCandidates}
        />
      );
    }

    const container = renderClient(<Harness />);
    const confirm = button(container, "Confirm");
    expect(confirm.disabled).toBe(true);
    const cards = [...container.querySelectorAll<HTMLElement>("article")];
    expect(cards).toHaveLength(2);

    act(() => cards[0]!.querySelectorAll("button")[1]!.click());
    expect(button(container, "Confirm").disabled).toBe(true);
    act(() => cards[1]!.querySelectorAll("button")[0]!.click());
    expect(button(container, "Confirm").disabled).toBe(false);
    expect(container.querySelectorAll('[data-testid="preview-card-a"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-testid="preview-card-b"]')).toHaveLength(1);

    act(() => button(container, "Confirm").click());
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          "deckLookAnswers.0": {
            tutorCardId: ["card-a"],
            toBottom: ["card-b"],
          },
        }),
      }),
    );
  });

  test("shows and changes the chosen sequence for an ordered destination", () => {
    function Harness() {
      const [values, setValues] = useState<Record<string, Record<string, string[]>>>({
        "deckLookAnswers.0": { toBottom: ["card-a", "card-b"] },
      });
      return (
        <InteractionResolutionPrompt
          view={partitionView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) =>
            setValues((current) => ({
              ...current,
              [inputId]: value as Record<string, string[]>,
            }))
          }
        />
      );
    }

    const container = renderClient(<Harness />);
    const chosenOrder = container.querySelector<HTMLOListElement>(
      'ol[aria-label="Bottom of Deck chosen order"]',
    )!;
    const labels = () =>
      [...chosenOrder.querySelectorAll("li")].map((item) => item.textContent?.replace(/\s/g, ""));

    expect(labels()).toEqual(["1card-a", "2card-b"]);
    expect(button(container, "Confirm").disabled).toBe(false);

    const moveEarlier = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Move card-b earlier in Bottom of Deck"]',
    )!;
    act(() => moveEarlier.click());

    expect(labels()).toEqual(["1card-b", "2card-a"]);
  });

  test("shows draw order directly while submitting a bottom-first deck order", () => {
    const submit = vi.fn();
    function Harness() {
      const [values, setValues] = useState<Record<string, Record<string, string[]>>>({});
      return (
        <InteractionResolutionPrompt
          view={directDeckOrderView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) =>
            setValues((current) => ({
              ...current,
              [inputId]: value as Record<string, string[]>,
            }))
          }
          onSubmit={submit}
          renderCandidate={(_input, entityId) => <span>{`art:${entityId}`}</span>}
        />
      );
    }
    const container = renderClient(<Harness />);
    const scroll = container.querySelector<HTMLElement>('[data-testid="ordered-row-top"]')!;
    expect(
      [...scroll.querySelectorAll("li")].map((card) => card.textContent?.replace(/\s/g, "")),
    ).toEqual(["art:card-a", "art:card-b"]);
    expect(container.textContent).toContain("Drawn first");
    expect(container.textContent).toContain("Deeper");
    const firstGrip = container.querySelector<HTMLButtonElement>(
      'button[aria-label^="card-a, position 1 of 2"]',
    )!;
    act(() => {
      firstGrip.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });
    act(() => button(container, "Confirm order").click());
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          "deckLookAnswers.0": { top: ["card-a", "card-b"] },
        }),
      }),
    );
  });

  test("notifies the game surface when an ordered card is hovered or keyboard-focused", () => {
    const onPreview = vi.fn();
    const onPreviewEnd = vi.fn();
    const container = renderClient(
      <InteractionResolutionPrompt
        view={directDeckOrderView()}
        viewerId="p1"
        onOrderedCandidatePreview={onPreview}
        onOrderedCandidatePreviewEnd={onPreviewEnd}
      />,
    );

    const art = container.querySelector<HTMLElement>("[class*='directOrderArt']")!;
    void act(() => art.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    expect(onPreview).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "entity-partition" }),
      "card-a",
    );

    void act(() => art.dispatchEvent(new MouseEvent("mouseout", { bubbles: true })));
    expect(onPreviewEnd).toHaveBeenCalledOnce();

    onPreview.mockClear();
    onPreviewEnd.mockClear();
    const grip = container.querySelector<HTMLButtonElement>(
      'button[aria-label^="card-a, position 1 of 2"]',
    )!;
    act(() => grip.focus());
    expect(onPreview).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "entity-partition" }),
      "card-a",
    );
    act(() => container.querySelector<HTMLElement>("[data-layout='focused']")!.focus());
    expect(onPreviewEnd).toHaveBeenCalledOnce();
  });

  test("uses the ordered-card rows to move and reorder Opt cards", () => {
    function Harness() {
      const [values, setValues] = useState<Record<string, Record<string, string[]>>>({});
      return (
        <InteractionResolutionPrompt
          view={optOrderView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) =>
            setValues((current) => ({
              ...current,
              [inputId]: value as Record<string, string[]>,
            }))
          }
          onSubmit={() => undefined}
          renderCandidate={(_input, entityId) => <span>{`art:${entityId}`}</span>}
        />
      );
    }
    const container = renderClient(<Harness />);
    const top = () => container.querySelector<HTMLElement>('[data-testid="ordered-row-top"]')!;
    const bottom = () =>
      container.querySelector<HTMLElement>('[data-testid="ordered-row-bottom"]')!;

    expect(top().querySelectorAll("li")).toHaveLength(2);
    expect(bottom().querySelectorAll("li")).toHaveLength(0);
    act(() =>
      container
        .querySelector<HTMLButtonElement>('button[aria-label="Move card-a to Put on bottom"]')!
        .click(),
    );
    expect(top().querySelectorAll("li")).toHaveLength(1);
    expect(bottom().querySelectorAll("li")).toHaveLength(1);
    const bottomGrip = bottom().querySelector<HTMLButtonElement>(
      'button[aria-label^="card-a, position 1 of 1"]',
    )!;
    void act(() =>
      bottomGrip.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })),
    );
    expect(top().querySelectorAll("li")).toHaveLength(2);
    expect(bottom().querySelectorAll("li")).toHaveLength(0);
  });

  test("keeps an untouched Opt order confirmable when the parent resets its draft", () => {
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, Record<string, string[]>>>({});
      useEffect(() => setValues({}), []);
      return (
        <InteractionResolutionPrompt
          view={optOrderView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) =>
            setValues((current) => ({
              ...current,
              [inputId]: value as Record<string, string[]>,
            }))
          }
          onSubmit={submit}
        />
      );
    }

    const container = renderClient(<Harness />);
    expect(button(container, "Confirm order").disabled).toBe(false);

    act(() => button(container, "Confirm order").click());
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          "deckLookAnswers.0": { top: ["card-b", "card-a"], bottom: [] },
        }),
      }),
    );
  });

  test("commits the untouched Opt default before confirming a controlled draft", () => {
    const change = vi.fn();
    const confirmCurrent = vi.fn();
    const view = optOrderView();
    const container = renderClient(
      <InteractionResolutionPrompt
        view={view}
        viewerId="p1"
        actionId="resolveEffect"
        values={{}}
        onChange={change}
        onConfirm={confirmCurrent}
      />,
    );

    expect(button(container, "Confirm order").disabled).toBe(false);
    act(() => button(container, "Confirm order").click());

    expect(change).toHaveBeenCalledWith("deckLookAnswers.0", {
      top: ["card-b", "card-a"],
      bottom: [],
    });
    expect(confirmCurrent).toHaveBeenCalledOnce();
  });

  test("validates a draft-controlled partition before confirming the current input", () => {
    const confirmCurrent = vi.fn();
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, Record<string, string[]>>>({});
      return (
        <InteractionResolutionPrompt
          view={{ ...partitionView(), resolution: undefined }}
          viewerId="p1"
          actionId="resolveEffect"
          values={values}
          onChange={(inputId, value) =>
            setValues((current) => ({
              ...current,
              [inputId]: value as Record<string, string[]>,
            }))
          }
          onConfirm={confirmCurrent}
          onSubmit={submit}
        />
      );
    }

    const container = renderClient(<Harness />);
    expect(button(container, "Confirm").disabled).toBe(true);

    const cards = [...container.querySelectorAll<HTMLElement>("article")];
    act(() => cards[0]!.querySelectorAll("button")[1]!.click());
    expect(button(container, "Confirm").disabled).toBe(true);
    act(() => cards[1]!.querySelectorAll("button")[0]!.click());
    expect(button(container, "Confirm").disabled).toBe(false);

    act(() => button(container, "Confirm").click());
    expect(confirmCurrent).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
  });

  test("selects a sole eligible extraction by clicking the revealed card", () => {
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, Record<string, string[]>>>({});
      return (
        <InteractionResolutionPrompt
          view={automaticPartitionView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) =>
            setValues((current) => ({
              ...current,
              [inputId]: value as Record<string, string[]>,
            }))
          }
          onSubmit={submit}
          renderCandidate={(_input, entityId) => <span>{`face:${entityId}`}</span>}
        />
      );
    }

    const container = renderClient(<Harness />);
    const cards = [...container.querySelectorAll<HTMLElement>("article")];
    const eligibleCard = cards[0]!.querySelector<HTMLButtonElement>("button")!;
    const ineligibleCard = cards[1]!.querySelector<HTMLButtonElement>("button")!;

    expect(eligibleCard.disabled).toBe(false);
    expect(ineligibleCard.disabled).toBe(true);
    expect(button(container, "Confirm").disabled).toBe(false);
    expect(container.textContent?.match(/randomized to the bottom/g)).toHaveLength(1);

    act(() => eligibleCard.click());
    expect(eligibleCard.getAttribute("aria-pressed")).toBe("true");

    act(() => button(container, "Confirm").click());
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          "deckLookAnswers.0": { tutorCardId: ["card-a"] },
        }),
      }),
    );
  });

  test("brings an offscreen selectable partition card into view", () => {
    const view = automaticPartitionView();
    const action = view.actions[0]!;
    const delayedEligibleView: EngineInteractionView = {
      ...view,
      actions: [
        {
          ...action,
          inputs: action.inputs.map((input) =>
            input.kind === "entity-partition"
              ? {
                  ...input,
                  routes: input.routes.map((route) => ({
                    ...route,
                    candidateIds: ["card-b"],
                  })),
                }
              : input,
          ),
        },
      ],
    };
    const scrollTo = vi.fn();
    const originalScrollTo = HTMLElement.prototype.scrollTo;
    const bounds = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: Element) {
        if (this instanceof HTMLElement && this.dataset.directlySelectable === "true") {
          return DOMRect.fromRect({ x: 240, width: 100, height: 100 });
        }
        if (this instanceof HTMLDivElement && this.firstElementChild?.tagName === "ARTICLE") {
          return DOMRect.fromRect({ x: 0, width: 200, height: 120 });
        }
        return DOMRect.fromRect();
      });
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });

    try {
      renderClient(
        <InteractionResolutionPrompt view={delayedEligibleView} viewerId="p1" values={{}} />,
      );

      expect(scrollTo).toHaveBeenCalledWith({ left: 190, behavior: "auto" });
    } finally {
      bounds.mockRestore();
      if (originalScrollTo) {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", {
          configurable: true,
          value: originalScrollTo,
        });
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, "scrollTo");
      }
    }
  });

  test("shows overflow controls for a clipped revealed-card shelf", () => {
    const originalClientWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth",
    );
    const originalScrollWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollWidth",
    );
    const originalScrollLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollLeft");
    const originalScrollTo = HTMLElement.prototype.scrollTo;
    let scrollLeft = 0;
    const scrollTo = vi.fn(function (
      this: HTMLElement,
      options: ScrollToOptions | number,
      y?: number,
    ) {
      scrollLeft = typeof options === "number" ? options : (options.left ?? 0);
      this.dispatchEvent(new Event("scroll"));
      void y;
    });

    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: { configurable: true, get: () => 200 },
      scrollWidth: {
        configurable: true,
        get() {
          return this instanceof HTMLDivElement && this.firstElementChild?.tagName === "ARTICLE"
            ? 400
            : 200;
        },
      },
      scrollLeft: {
        configurable: true,
        get: () => scrollLeft,
        set: (value: number) => {
          scrollLeft = value;
        },
      },
      scrollTo: { configurable: true, value: scrollTo },
    });

    try {
      const container = renderClient(
        <InteractionResolutionPrompt view={automaticPartitionView()} viewerId="p1" values={{}} />,
      );
      const earlier = container.querySelector<HTMLButtonElement>(
        'button[aria-label="Show earlier revealed cards"]',
      );
      const later = container.querySelector<HTMLButtonElement>(
        'button[aria-label="Show later revealed cards"]',
      );

      expect(earlier?.disabled).toBe(true);
      expect(later?.disabled).toBe(false);

      act(() => later?.click());

      expect(scrollTo).toHaveBeenCalledWith({ left: 160, behavior: "smooth" });
      expect(earlier?.disabled).toBe(false);
      expect(later?.disabled).toBe(false);
    } finally {
      for (const [property, descriptor] of [
        ["clientWidth", originalClientWidth],
        ["scrollWidth", originalScrollWidth],
        ["scrollLeft", originalScrollLeft],
      ] as const) {
        if (descriptor) Object.defineProperty(HTMLElement.prototype, property, descriptor);
        else Reflect.deleteProperty(HTMLElement.prototype, property);
      }
      if (originalScrollTo) {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", {
          configurable: true,
          value: originalScrollTo,
        });
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, "scrollTo");
      }
    }
  });

  test("uses protocol candidate-set copy and resolves an optional partition", () => {
    const submit = vi.fn();

    function Harness() {
      const [values, setValues] = useState<Record<string, Record<string, string[]> | boolean>>({});
      return (
        <InteractionResolutionPrompt
          view={optionalPartitionView()}
          viewerId="p1"
          values={values}
          onChange={(inputId, value) =>
            setValues((current) => ({
              ...current,
              [inputId]: value as Record<string, string[]> | boolean,
            }))
          }
          onSubmit={submit}
          renderCandidate={(_input, entityId) => <span>{`face:${entityId}`}</span>}
        />
      );
    }

    const container = renderClient(<Harness />);
    expect(container.textContent).toContain("Your Hand");
    expect(container.textContent).toContain("Skip effect");
    expect(button(container, "Confirm").disabled).toBe(true);

    act(() => container.querySelector<HTMLElement>("article button")!.click());
    expect(button(container, "Confirm").disabled).toBe(false);
    act(() => button(container, "Confirm").click());

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          "optionalAnswers.0": true,
          targetPartition: { targets: ["card-a"] },
        }),
      }),
    );
  });

  test("focuses focused mode, minimizes with Escape, and resets for a changed request", () => {
    const base = partitionView();
    const partitionInstruction = base.resolution!.currentStep.requirement!.text;
    const first: EngineInteractionView = {
      ...base,
      resolution: {
        ...base.resolution!,
        currentEffect: {
          ...base.resolution!.currentEffect,
          text: partitionInstruction,
        },
      },
    };
    const container = renderClient(<InteractionResolutionPrompt view={first} viewerId="p1" />);
    const prompt = container.querySelector<HTMLElement>("[data-layout='focused']")!;
    expect(document.activeElement).toBe(prompt);
    const descriptionId = prompt.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    expect(container.querySelector(`#${descriptionId}`)).not.toBeNull();

    const focusable = [
      ...prompt.querySelectorAll<HTMLButtonElement>(
        'button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    ];
    const firstFocusable = focusable[0]!;
    const lastFocusable = focusable[focusable.length - 1]!;
    act(() => {
      prompt.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Tab",
          shiftKey: true,
        }),
      );
    });
    expect(document.activeElement).toBe(lastFocusable);
    act(() => {
      lastFocusable.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }));
    });
    expect(document.activeElement).toBe(firstFocusable);

    void act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
    expect(prompt.dataset.minimized).toBe("true");

    act(() => button(container, "Expand").click());
    expect(prompt.dataset.minimized).toBe("false");
    expect(document.activeElement).toBe(prompt);
    expect(container.querySelector(`#${descriptionId}`)).not.toBeNull();
    void act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
    expect(prompt.dataset.minimized).toBe("true");

    const next: EngineInteractionView = {
      ...first,
      resolution: {
        ...first.resolution!,
        currentEffect: { ...first.resolution!.currentEffect, id: "effect-2" },
      },
      actions: [{ ...first.actions[0]!, requestId: "deck-look:5" }],
    };
    act(() =>
      activeRoot?.render(
        <HeadlessMantineProvider>
          <InteractionResolutionPrompt view={next} viewerId="p1" />
        </HeadlessMantineProvider>,
      ),
    );
    expect(prompt.dataset.minimized).toBe("false");
    expect(document.activeElement).toBe(prompt);
  });
});

function DraftControlledPrompt({ view }: { readonly view: EngineInteractionView }) {
  const draft = useInteractionDraft();
  return (
    <InteractionResolutionPrompt
      view={view}
      viewerId="p1"
      actionId={draft.actionId}
      values={draft.values}
      confirmedInputIds={draft.confirmedInputIds}
      visibleEntityIds={new Set()}
      onChange={draft.change}
      onClearInput={draft.unset}
      onConfirm={draft.confirmCurrent}
      onClear={draft.clear}
      onCancel={draft.cancel}
    />
  );
}

function renderClient(element: ReactElement): HTMLDivElement {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  act(() => activeRoot?.render(<HeadlessMantineProvider>{element}</HeadlessMantineProvider>));
  return activeContainer;
}

function renderToStaticMarkup(element: ReactElement): string {
  return renderReactToStaticMarkup(<HeadlessMantineProvider>{element}</HeadlessMantineProvider>);
}

function button(container: HTMLElement, label: string): HTMLButtonElement {
  const roots = container === document.body ? [container] : [container, document.body];
  const match = roots
    .flatMap((root) => [...root.querySelectorAll<HTMLButtonElement>("button")])
    .find((candidate) => candidate.textContent === label);
  if (!match) throw new Error(`Expected ${label} button.`);
  return match;
}

function openChoices(container: HTMLElement): void {
  openPromptControls(container);
  act(() => utilityAction("Browse choices").click());
}

function openPromptControls(container: HTMLElement): void {
  const trigger = container.querySelector<HTMLButtonElement>(
    'button[aria-label="Prompt controls"]',
  );
  if (!trigger) throw new Error("Expected Prompt controls button.");
  act(() => trigger.click());
}

function utilityAction(title: string): HTMLButtonElement {
  const match = [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
    (candidate) => candidate.querySelector("strong")?.textContent === title,
  );
  if (!match) throw new Error(`Expected ${title} prompt control.`);
  return match;
}

function targetView(bounds: { min: number; max: number }): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion: 4,
    status: "choosing",
    resolution: {
      actingPlayerId: "p1",
      pendingCount: 2,
      currentEffect: {
        id: "effect-1",
        text: {
          key: "gundam.effect.current",
          params: { label: "Kamille Bidan — When Linked" },
        },
      },
      currentStep: {
        index: 1,
        count: 1,
        text: { key: "gundam.effect.step" },
        requirement: {
          kind: "entity-selection",
          text: {
            key: "gundam.choice.targets",
            params: { prompt: "Choose an enemy Unit." },
          },
          required: bounds.min > 0,
          ...bounds,
        },
      },
    },
    actions: [
      {
        id: "resolveEffect",
        requestId: "effect-1:4",
        intent: "choose-targets",
        text: { key: "gundam.move.resolveEffect" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "pendingEffectId",
            implicit: true,
            text: { key: "gundam.choice.pendingEffect" },
            required: true,
            min: 1,
            max: 1,
            options: [{ id: "effect-1", text: { key: "effect-1" }, enabled: true }],
          },
          {
            kind: "entity-selection",
            id: "targets",
            text: {
              key: "gundam.choice.targets",
              params: { prompt: "Choose an enemy Unit." },
            },
            required: bounds.min > 0,
            role: "target",
            entityKinds: ["card"],
            ordered: false,
            ...bounds,
            candidates: ["unit-a", "unit-b"].map((instanceId) => ({
              entity: { kind: "card" as const, instanceId },
              text: { key: instanceId },
              enabled: true,
            })),
          },
        ],
      },
    ],
  };
}

function groupedTargetView(): EngineInteractionView {
  const view = targetView({ min: 1, max: 1 });
  const firstTarget = view.actions[0]!.inputs[1]!;
  if (firstTarget.kind !== "entity-selection") throw new Error("Expected target input");
  const secondTarget = {
    ...firstTarget,
    id: "targetGroups.1",
    candidates: ["unit-c", "unit-d"].map((instanceId) => ({
      entity: { kind: "card" as const, instanceId },
      text: { key: instanceId },
      enabled: true,
    })),
  };

  return {
    ...view,
    actions: [
      {
        ...view.actions[0]!,
        inputs: [
          view.actions[0]!.inputs[0]!,
          { ...firstTarget, id: "targetGroups.0" },
          secondTarget,
        ],
      },
    ],
  };
}

function multiOptionView(): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "flesh-and-blood",
    actorId: "p1",
    stateVersion: 4,
    status: "choosing",
    resolution: {
      actingPlayerId: "p1",
      pendingCount: 1,
      currentEffect: {
        id: "pilfer",
        text: { key: "Choose modes for Pilfer the Tomb" },
      },
      currentStep: {
        index: 1,
        count: 1,
        text: { key: "Choose 1 or both" },
        requirement: {
          kind: "option-selection",
          text: { key: "Choose 1 or both" },
          required: true,
          min: 1,
          max: 2,
        },
      },
    },
    actions: [
      {
        id: "choose-modes",
        requestId: "pilfer:4",
        intent: "choose-option",
        text: { key: "Choose modes" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "modes",
            text: { key: "Choose 1 or both" },
            required: true,
            min: 1,
            max: 2,
            options: [
              {
                id: "instant",
                text: { key: "Banish target instant" },
                enabled: true,
              },
              {
                id: "yellow",
                text: { key: "Banish target yellow card" },
                enabled: true,
              },
            ],
          },
        ],
      },
    ],
  };
}

function directOptionView(): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "flesh-and-blood",
    actorId: "p1",
    stateVersion: 4,
    status: "choosing",
    resolution: {
      actingPlayerId: "p1",
      pendingCount: 1,
      currentEffect: { id: "arcane-damage", text: { key: "Prevent incoming arcane damage?" } },
      currentStep: {
        index: 1,
        count: 1,
        text: {
          key: "fab.prompt.directOption",
          params: {
            label: "Voltic Bolt would deal 5 arcane damage.",
          },
        },
        requirement: {
          kind: "option-selection",
          text: {
            key: "fab.prompt.directOption",
            params: {
              label: "Voltic Bolt would deal 5 arcane damage.",
            },
          },
          required: false,
          min: 0,
          max: 1,
        },
      },
    },
    actions: [
      {
        id: "prevent-damage",
        requestId: "arcane-damage:4",
        intent: "choose-option",
        text: { key: "Prevent incoming arcane damage?" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "answer",
            text: {
              key: "fab.prompt.directOption",
              params: {
                label: "Voltic Bolt would deal 5 arcane damage.",
              },
            },
            required: false,
            min: 0,
            max: 1,
            options: [
              {
                id: "robe:arcane-barrier",
                text: {
                  key: "Nullrune Robe · Pay 1 resource · Prevent 1 · Take 4",
                },
                enabled: true,
              },
            ],
            presentation: {
              kind: "direct",
              emptyText: { key: "Take 5 arcane damage" },
            },
          },
        ],
      },
    ],
  };
}

function largeCardNameView(): EngineInteractionView {
  const options = [
    ...Array.from({ length: 80 }, (_, index) => ({
      id: `Card ${String(index + 1).padStart(2, "0")}`,
      text: { key: `Card ${String(index + 1).padStart(2, "0")}` },
      enabled: true,
    })),
    { id: "fab-card-name:Snatch", text: { key: "Snatch" }, enabled: true },
    { id: "fab-card-name:%C3%89clair", text: { key: "Éclair" }, enabled: true },
  ];
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "flesh-and-blood",
    actorId: "p1",
    stateVersion: 4,
    status: "choosing",
    resolution: {
      actingPlayerId: "p1",
      pendingCount: 1,
      currentEffect: { id: "retrace", text: { key: "Nommer une carte" } },
      currentStep: {
        index: 1,
        count: 1,
        text: { key: "Nommer une carte" },
        requirement: {
          kind: "option-selection",
          text: { key: "Nommer une carte" },
          required: true,
          min: 1,
          max: 1,
        },
      },
    },
    actions: [
      {
        id: "name-card",
        requestId: "retrace:4",
        intent: "choose-option",
        text: { key: "Nommer une carte" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "answer",
            text: {
              key: "Search the full catalog or choose a visible suggestion.",
            },
            required: true,
            min: 1,
            max: 1,
            options,
            presentation: {
              kind: "search",
              label: { key: "Card name" },
              placeholder: { key: "Type a card name" },
              confirmLabel: { key: "Use this name" },
              description: {
                key: "Search the full catalog or choose a visible suggestion.",
              },
              resultLimit: 12,
              suggestionGroups: [
                {
                  id: "your-hand",
                  text: { key: "In your hand" },
                  optionIds: ["fab-card-name:Snatch"],
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function optionalTargetView(
  bounds: { min: number; max: number } = { min: 2, max: 2 },
): EngineInteractionView {
  const view = targetView(bounds);
  const target = view.actions[0]!.inputs[1]!;
  if (target.kind !== "entity-selection") throw new Error("Expected target input");
  return {
    ...view,
    actions: [
      {
        ...view.actions[0]!,
        inputs: [
          view.actions[0]!.inputs[0]!,
          {
            kind: "boolean",
            id: "optionalAnswers.0",
            text: { key: "gundam.choice.optional" },
            required: true,
            trueText: {
              key: "gundam.choice.yes",
              params: { label: "Resolve" },
            },
            falseText: { key: "gundam.choice.no", params: { label: "Skip" } },
          },
          {
            ...target,
            required: false,
            requiredWhen: [{ all: [{ inputId: "optionalAnswers.0", value: true }] }],
          },
        ],
      },
    ],
  };
}

function booleanView(): EngineInteractionView {
  const view = targetView({ min: 1, max: 1 });
  return {
    ...view,
    resolution: {
      ...view.resolution!,
      currentStep: {
        ...view.resolution!.currentStep,
        text: {
          key: "gundam.effect.step",
          params: { prompt: "【Burst】Deploy this card." },
        },
        requirement: {
          kind: "boolean",
          text: {
            key: "gundam.choice.optional",
            params: { prompt: "【Burst】Deploy this card." },
          },
          required: false,
        },
      },
    },
    actions: [
      {
        id: "resolveEffect",
        requestId: "effect-1:4",
        intent: "choose-option",
        text: { key: "gundam.move.resolveEffect" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "pendingEffectId",
            implicit: true,
            text: { key: "gundam.choice.pendingEffect" },
            required: true,
            min: 1,
            max: 1,
            options: [{ id: "effect-1", text: { key: "effect-1" }, enabled: true }],
          },
          {
            kind: "boolean",
            id: "optionalAnswers.-1",
            text: {
              key: "gundam.choice.optional",
              params: { prompt: "【Burst】Deploy this card." },
            },
            required: true,
            trueText: {
              key: "gundam.choice.yes",
              params: { label: "Resolve" },
            },
            falseText: { key: "gundam.choice.no", params: { label: "Skip" } },
          },
        ],
      },
    ],
  };
}

function requiredBooleanView(): EngineInteractionView {
  const view = booleanView();
  const action = view.actions[0]!;
  const answer = action.inputs.find((input) => input.kind === "boolean");
  if (!answer || answer.kind !== "boolean") throw new Error("Expected boolean input.");
  return {
    ...view,
    resolution: {
      ...view.resolution!,
      currentStep: {
        ...view.resolution!.currentStep,
        text: { key: "Keep your hand or redraw it?" },
        requirement: {
          kind: "boolean",
          text: { key: "Keep your hand or redraw it?" },
          required: true,
        },
      },
    },
    actions: [
      {
        ...action,
        inputs: [
          {
            ...answer,
            id: "redraw",
            text: { key: "Keep your hand or redraw it?" },
            trueText: { key: "Redraw" },
            falseText: { key: "Keep hand" },
          },
        ],
      },
    ],
  };
}

function boundedNumberView(min: number, max: number): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "cyberpunk",
    actorId: "p1",
    stateVersion: 5,
    status: "choosing",
    resolution: {
      actingPlayerId: "p1",
      pendingCount: 1,
      currentEffect: { id: "adjust-gig", text: { key: "Adjust gig die" } },
      currentStep: {
        index: 1,
        count: 1,
        text: { key: "Choose the new die value" },
        requirement: {
          kind: "number",
          text: { key: "Choose the new die value" },
          required: true,
          min,
          max,
        },
      },
    },
    actions: [
      {
        id: "adjust-gig",
        requestId: "adjust-gig:5",
        intent: "choose-option",
        text: { key: "Choose the new die value" },
        enabled: true,
        inputs: [
          {
            kind: "number",
            id: "amount",
            text: { key: "Choose the new die value" },
            required: true,
            min,
            max,
            step: 1,
          },
        ],
      },
    ],
  };
}

function partitionView(): EngineInteractionView {
  const view = targetView({ min: 1, max: 1 });
  return {
    ...view,
    resolution: {
      ...view.resolution!,
      currentStep: {
        index: 1,
        count: 1,
        text: {
          key: "gundam.effect.step",
          params: { prompt: "Look at the top 2 cards of your Deck." },
        },
        requirement: {
          kind: "entity-partition",
          text: {
            key: "gundam.choice.deckLook",
            params: { prompt: "Choose a Pilot and return the rest." },
          },
          required: true,
        },
      },
    },
    actions: [
      {
        id: "resolveEffect",
        requestId: "deck-look:4",
        intent: "order-cards",
        text: { key: "gundam.move.resolveEffect" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "pendingEffectId",
            implicit: true,
            text: { key: "gundam.choice.pendingEffect" },
            required: true,
            min: 1,
            max: 1,
            options: [{ id: "effect-1", text: { key: "effect-1" }, enabled: true }],
          },
          {
            kind: "entity-partition",
            id: "deckLookAnswers.0",
            text: { key: "gundam.choice.deckLook" },
            required: true,
            entityKind: "card",
            candidates: ["card-a", "card-b"].map((instanceId) => ({
              entity: { kind: "card" as const, instanceId },
              enabled: true,
            })),
            routes: [
              {
                id: "tutorCardId",
                text: {
                  key: "gundam.choice.tutor",
                  params: { label: "Add to Hand" },
                },
                kind: "extract",
                ordered: false,
                min: 0,
                max: 1,
                candidateIds: ["card-a"],
              },
              {
                id: "toBottom",
                text: {
                  key: "gundam.choice.bottom",
                  params: { label: "Bottom of Deck" },
                },
                kind: "destination",
                ordered: true,
                min: 0,
                max: 2,
              },
            ],
            assignment: "exhaustive",
          },
        ],
      },
    ],
  };
}

function automaticPartitionView(): EngineInteractionView {
  const view = partitionView();
  const partition = view.actions[0]!.inputs.find((input) => input.kind === "entity-partition");
  if (!partition || partition.kind !== "entity-partition") {
    throw new Error("Expected partition input");
  }
  return {
    ...view,
    actions: [
      {
        ...view.actions[0]!,
        inputs: view.actions[0]!.inputs.map((input) =>
          input.id === partition.id
            ? {
                ...partition,
                routes: [partition.routes[0]!],
                assignment: "remainder-automatic" as const,
                remainderText: {
                  key: "gundam.choice.deckLook.randomBottom",
                  params: {
                    label: "Remaining cards are randomized to the bottom of the Deck",
                  },
                },
              }
            : input,
        ),
      },
    ],
  };
}

function directDeckOrderView(): EngineInteractionView {
  const view = partitionView();
  const partition = view.actions[0]!.inputs.find((input) => input.kind === "entity-partition");
  if (!partition || partition.kind !== "entity-partition") throw new Error("Expected partition");
  return {
    ...view,
    actions: [
      {
        ...view.actions[0]!,
        inputs: view.actions[0]!.inputs.map((input) =>
          input.id === partition.id
            ? {
                ...partition,
                routes: [
                  {
                    id: "top",
                    text: { key: "Top of deck (bottom card first)" },
                    kind: "destination" as const,
                    ordered: true,
                    orderDirection: "bottom-first" as const,
                    min: 0,
                    max: partition.candidates.length,
                  },
                ],
                assignment: "exhaustive" as const,
              }
            : input,
        ),
      },
    ],
  };
}

function optOrderView(): EngineInteractionView {
  const view = directDeckOrderView();
  const partition = view.actions[0]!.inputs.find((input) => input.kind === "entity-partition");
  if (!partition || partition.kind !== "entity-partition") throw new Error("Expected partition");
  return {
    ...view,
    actions: [
      {
        ...view.actions[0]!,
        inputs: view.actions[0]!.inputs.map((input) =>
          input.id === partition.id
            ? {
                ...partition,
                routes: [
                  { ...partition.routes[0]!, text: { key: "Keep on top" } },
                  {
                    ...partition.routes[0]!,
                    id: "bottom",
                    text: { key: "Put on bottom" },
                  },
                ],
              }
            : input,
        ),
      },
    ],
  };
}

function optionalPartitionView(): EngineInteractionView {
  const view = automaticPartitionView();
  const action = view.actions[0]!;
  const partition = action.inputs.find((input) => input.kind === "entity-partition");
  if (!partition || partition.kind !== "entity-partition") {
    throw new Error("Expected partition input");
  }
  const decisionId = "optionalAnswers.0";
  return {
    ...view,
    actions: [
      {
        ...action,
        inputs: [
          action.inputs[0]!,
          {
            kind: "boolean",
            id: decisionId,
            text: { key: "optional", params: { label: "Discard a card?" } },
            required: true,
            trueText: { key: "yes", params: { label: "Resolve" } },
            falseText: { key: "no", params: { label: "Skip" } },
          },
          {
            ...partition,
            id: "targetPartition",
            candidateSetText: {
              key: "candidate-set",
              params: { label: "Your Hand" },
            },
            required: false,
            requiredWhen: [{ all: [{ inputId: decisionId, value: true }] }],
            routes: [
              {
                ...partition.routes[0]!,
                id: "targets",
                text: { key: "discard", params: { label: "Discard" } },
                min: 1,
                max: 1,
                candidateIds: ["card-a", "card-b"],
              },
            ],
            remainderText: {
              key: "remainder",
              params: { label: "Remaining cards stay in Hand" },
            },
          },
        ],
      },
    ],
  };
}

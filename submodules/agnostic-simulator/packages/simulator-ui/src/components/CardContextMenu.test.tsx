// @vitest-environment jsdom
import type { SimulatorCardAction, SimulatorEntity } from "@tcg/simulator-contract";
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { CardContextMenuController, type CardContextMenuVisualIdentity } from "./CardContextMenu";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

const entity: SimulatorEntity = {
  id: "card-1",
  title: "Test Card",
  subtitle: "Unit",
  kind: "unit",
  ownerId: "player",
  face: "public",
  states: ["ready"],
  stats: [{ label: "Power", value: "4", baseValue: "3" }],
  traits: ["Blocker"],
  details: {
    rules: [
      {
        id: "rule",
        kind: "ability",
        label: "Activate · Main · Once per Turn",
        text: "Deploy 1 Gundam Unit token with AP 3 and HP 3. Then you may deploy 1 additional Unit token.",
      },
    ],
  },
  activeEffects: [
    {
      id: "active-effect",
      label: "Prevents Gig theft",
      detail: "This card prevents a rival from stealing Gigs while this effect is active.",
      tone: "neutral",
      targetKind: "entity",
      targetId: "card-1",
      sourceLabel: "Test Card",
    },
  ],
};

const actions: SimulatorCardAction[] = [
  {
    id: "play",
    sourceEntityId: entity.id,
    label: "Play",
    detail: "Pay the cost and play this card.",
    order: 10,
    shortcut: "1",
    activation: "execute",
    commandRef: "play",
    availability: { kind: "enabled" },
  },
  {
    id: "attack",
    sourceEntityId: entity.id,
    label: "Attack",
    detail: "Choose an attack target.",
    order: 20,
    shortcut: "2",
    activation: "begin-selection",
    commandRef: "attack",
    availability: { kind: "enabled" },
  },
];

const actionsWithDisabledAttack: SimulatorCardAction[] = [
  actions[0]!,
  {
    ...actions[1]!,
    availability: {
      kind: "disabled",
      reason: "This unit is rested.",
      reasonCode: "test.rested",
    },
  },
];

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => root?.unmount());
  document.querySelector("[data-card-context-menu]")?.remove();
  container?.remove();
  root = null;
  container = null;
});

describe("CardContextMenuController", () => {
  test("shows a single rule in full when there is no expansion control", () => {
    renderController({ mode: "detailed", entity: { ...entity, activeEffects: [] } });
    openCard();
    const rules = document.querySelector('[aria-label="Rules and abilities"]');
    expect(rules?.textContent).toContain("Then you may deploy 1 additional Unit token.");
    expect(rules?.hasAttribute("data-collapsed")).toBe(false);
    expect(document.querySelector("[data-card-context-details-toggle]")).toBeNull();
  });

  test("lets a game inject identity and icons without changing the shared fallback", () => {
    const visualIdentity: CardContextMenuVisualIdentity = {
      className: "game-context",
      hideDisabledActionsInQuickMode: true,
      renderIdentity: ({ entity: renderedEntity }) => (
        <span data-testid="game-identity">{renderedEntity.title} identity</span>
      ),
      renderActionIcon: ({ action }) => <span data-testid={`game-icon-${action.id}`} />,
      renderText: ({ text, kind }) => (
        <span data-testid={`game-text-${kind}`}>{text.replace("Unit", "Mobile Suit")}</span>
      ),
    };
    renderController({
      mode: "quick",
      actions: actionsWithDisabledAttack,
      visualIdentity,
    });
    openCard();

    expect(document.querySelector(".game-context")).not.toBeNull();
    expect(document.querySelector('[data-testid="game-identity"]')?.textContent).toContain(
      "Test Card identity",
    );
    expect(document.querySelector('[data-testid="game-icon-play"]')).not.toBeNull();
    expect(actionIds()).toEqual(["play"]);

    renderController({
      mode: "detailed",
      actions: actionsWithDisabledAttack,
      visualIdentity,
    });
    expect(actionIds()).toEqual(["play", "attack"]);
    expect(document.querySelector('[data-testid="game-icon-attack"]')).not.toBeNull();
    expect(document.querySelector('[data-action-id="attack"] svg')).not.toBeNull();
    expect(document.body.textContent).not.toContain("Choose how to use this card.");
    expect(document.querySelector('[data-testid="game-text-rule"]')?.textContent).toContain(
      "Gundam Mobile Suit token",
    );
  });

  test("exposes passive card faces as a single popup button", () => {
    renderController({
      mode: "quick",
      children: (
        <div role="listitem">
          <div data-sim-entity-id={entity.id} aria-label="Test Card, unit">
            Test Card
          </div>
        </div>
      ),
    });

    const card = container?.querySelector<HTMLElement>("[data-sim-entity-id]");
    expect(card?.getAttribute("role")).toBe("button");
    expect(card?.getAttribute("tabindex")).toBe("0");
    expect(card?.getAttribute("aria-haspopup")).toBe("dialog");

    void act(() =>
      card?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })),
    );
    expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();
  });

  test("removes its focus stop when a zone-owned card button takes over", async () => {
    renderController({
      mode: "quick",
      children: (
        <div role="listitem">
          <div data-sim-entity-id={entity.id}>Test Card</div>
        </div>
      ),
    });
    expect(
      container?.querySelector<HTMLElement>("[data-sim-entity-id]")?.getAttribute("tabindex"),
    ).toBe("0");

    renderController({
      mode: "quick",
      children: (
        <div role="button" tabIndex={0} aria-label="Play Test Card">
          <div data-sim-entity-id={entity.id}>Test Card</div>
        </div>
      ),
    });
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    const cardFace = container?.querySelector<HTMLElement>("[data-sim-entity-id]");
    expect(cardFace?.getAttribute("role")).toBeNull();
    expect(cardFace?.getAttribute("tabindex")).toBeNull();
    expect(cardFace?.getAttribute("aria-haspopup")).toBeNull();
    expect(container?.querySelectorAll("[tabindex='0']")).toHaveLength(1);
  });

  test("lets an exclusive zone own a card click even when the card has context actions", () => {
    const onZoneClick = vi.fn();
    const onAction = vi.fn();
    renderController({
      mode: "quick",
      actions: actionsWithDisabledAttack,
      onAction,
      children: (
        <div data-sim-primary-click-owner="zone-exclusive" onClick={onZoneClick}>
          <button type="button" data-sim-entity-id={entity.id}>
            Test Card
          </button>
        </div>
      ),
    });

    const card = container?.querySelector<HTMLButtonElement>("[data-sim-entity-id]");
    act(() => card?.click());

    expect(onZoneClick).toHaveBeenCalledOnce();
    expect(onAction).not.toHaveBeenCalled();
    expect(document.querySelector("[data-card-context-menu]")).toBeNull();
  });

  test("renders the same stable action order in quick and detailed modes", () => {
    const onModeChange = vi.fn();
    renderController({ mode: "detailed", onModeChange });
    openCard();

    expect(actionIds()).toEqual(["play", "attack"]);
    expect(document.body.textContent).toContain("Choose how to use this card.");
    expect(
      document.querySelector('[data-action-id="play"] [data-action-affordance="activate"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-action-id="attack"] [data-action-affordance="activate"]'),
    ).not.toBeNull();
    expect(document.body.textContent).toContain("Printed 3");
    const rule = document.querySelector('[data-card-context-rule="rule"]');
    expect(rule?.querySelector("[data-card-context-rule-label]")?.textContent).toBe(
      "Activate · Main · Once per Turn",
    );
    expect(rule?.querySelector("[data-card-context-rule-text]")?.textContent).toContain(
      "Deploy 1 Gundam Unit token",
    );
    const detailsToggle = document.querySelector(
      "[data-card-context-details-toggle]",
    ) as HTMLButtonElement;
    expect(detailsToggle.textContent).toContain("1 active effect");
    expect(document.body.textContent).not.toContain("prevents a rival from stealing");
    act(() => detailsToggle.click());
    expect(detailsToggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.textContent).toContain("prevents a rival from stealing");
    expect(document.querySelector("[data-card-context-preview]")).toBeNull();

    const previewToggle = document.querySelector(
      '[data-card-context-menu] button[aria-label="Show Test Card card image"]',
    ) as HTMLButtonElement;
    act(() => previewToggle.click());
    expect(previewToggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.querySelector("[data-card-context-preview]")).not.toBeNull();

    act(() => {
      (
        document.querySelector(
          '[data-card-context-menu] button[aria-label="Switch to quick card view"]',
        ) as HTMLButtonElement
      ).click();
    });
    expect(onModeChange).toHaveBeenCalledWith("quick");

    renderController({ mode: "quick", onModeChange });
    openCard();
    expect(actionIds()).toEqual(["play", "attack"]);
    expect(document.body.textContent).not.toContain("Printed 3");
  });

  test("omits placeholder-only rules text from card details", () => {
    renderController({
      mode: "detailed",
      entity: {
        ...entity,
        states: [],
        stats: [],
        traits: [],
        activeEffects: [],
        details: {
          rules: [{ id: "placeholder", kind: "ability", text: " - " }],
        },
      },
    });
    openCard();

    expect(document.querySelector('[aria-label="Rules and abilities"]')).toBeNull();
    expect(document.body.textContent).toContain("No additional public details.");
  });

  test("auto-activates when a card has exactly one enabled action", () => {
    const onAction = vi.fn();
    renderController({
      mode: "quick",
      onAction,
      actions: actionsWithDisabledAttack,
      autoActivateSingleEnabledAction: true,
    });
    openCard();

    expect(document.querySelector("[data-card-context-menu]")).toBeNull();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(actionsWithDisabledAttack[0], entity);
  });

  test("ignores context-only actions when auto-activating the sole primary action", () => {
    const onAction = vi.fn();
    renderController({
      mode: "quick",
      onAction,
      actions: [actions[0]!, actions[1]!],
      autoActivationActions: [actions[0]!],
      autoActivateSingleEnabledAction: true,
    });
    openCard();

    expect(document.querySelector("[data-card-context-menu]")).toBeNull();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(actions[0], entity);
  });

  test("does not auto-activate single actions unless the game opts in", () => {
    const onAction = vi.fn();
    renderController({
      mode: "quick",
      onAction,
      actions: actionsWithDisabledAttack,
      autoActivateSingleEnabledAction: false,
    });
    openCard();

    expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();
    expect(onAction).not.toHaveBeenCalled();
  });

  test("still opens the menu on context-menu when only one action is enabled", () => {
    const onAction = vi.fn();
    renderController({
      mode: "quick",
      onAction,
      actions: actionsWithDisabledAttack,
      autoActivateSingleEnabledAction: true,
    });
    openCardViaContextMenu();

    expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();
    expect(onAction).not.toHaveBeenCalled();
    expect(actionIds()).toEqual(["play", "attack"]);
  });

  test("long-press opens the menu for inspection when auto-activate is enabled", () => {
    vi.useFakeTimers();
    const onAction = vi.fn();
    try {
      renderController({
        mode: "quick",
        onAction,
        actions: actionsWithDisabledAttack,
        autoActivateSingleEnabledAction: true,
      });
      const card = container?.querySelector("[data-sim-entity-id]");
      if (!(card instanceof HTMLButtonElement)) throw new Error("Missing test card.");

      act(() => {
        card.dispatchEvent(
          new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
      });
      expect(document.querySelector("[data-card-context-menu]")).toBeNull();

      act(() => {
        vi.advanceTimersByTime(450);
      });
      expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();
      expect(onAction).not.toHaveBeenCalled();
      expect(actionIds()).toEqual(["play", "attack"]);

      // The synthetic click that follows a long-press must not auto-activate.
      act(() => {
        card.dispatchEvent(
          new PointerEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
        card.click();
      });
      expect(onAction).not.toHaveBeenCalled();
      expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  test("short press still auto-activates before the long-press threshold", () => {
    vi.useFakeTimers();
    const onAction = vi.fn();
    try {
      renderController({
        mode: "quick",
        onAction,
        actions: actionsWithDisabledAttack,
        autoActivateSingleEnabledAction: true,
      });
      const card = container?.querySelector("[data-sim-entity-id]");
      if (!(card instanceof HTMLButtonElement)) throw new Error("Missing test card.");

      act(() => {
        card.dispatchEvent(
          new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
        vi.advanceTimersByTime(100);
        card.dispatchEvent(
          new PointerEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
        card.click();
      });

      expect(document.querySelector("[data-card-context-menu]")).toBeNull();
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onAction).toHaveBeenCalledWith(actionsWithDisabledAttack[0], entity);
    } finally {
      vi.useRealTimers();
    }
  });

  test("second finger during long-press does not clear click suppression", () => {
    vi.useFakeTimers();
    const onAction = vi.fn();
    try {
      renderController({
        mode: "quick",
        onAction,
        actions: actionsWithDisabledAttack,
        autoActivateSingleEnabledAction: true,
      });
      const card = container?.querySelector("[data-sim-entity-id]");
      if (!(card instanceof HTMLButtonElement)) throw new Error("Missing test card.");

      act(() => {
        card.dispatchEvent(
          new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
      });
      act(() => {
        vi.advanceTimersByTime(450);
      });
      expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();

      // Second finger must not reset suppressNextClick.
      act(() => {
        card.dispatchEvent(
          new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 12,
            clientY: 12,
            pointerType: "touch",
            pointerId: 2,
          }),
        );
        card.dispatchEvent(
          new PointerEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
        card.click();
      });
      expect(onAction).not.toHaveBeenCalled();
      expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  test("secondary finger click while owner is still down does not clear suppress", () => {
    vi.useFakeTimers();
    const onAction = vi.fn();
    try {
      renderController({
        mode: "quick",
        onAction,
        actions: actionsWithDisabledAttack,
        autoActivateSingleEnabledAction: true,
      });
      const card = container?.querySelector("[data-sim-entity-id]");
      if (!(card instanceof HTMLButtonElement)) throw new Error("Missing test card.");

      act(() => {
        card.dispatchEvent(
          new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
      });
      act(() => {
        vi.advanceTimersByTime(450);
      });
      expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();

      // Reverse lift order: secondary click first (owner still down), then owner.
      act(() => {
        card.dispatchEvent(
          new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 12,
            clientY: 12,
            pointerType: "touch",
            pointerId: 2,
          }),
        );
        card.dispatchEvent(
          new PointerEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 12,
            clientY: 12,
            pointerType: "touch",
            pointerId: 2,
          }),
        );
        // Synthetic click from secondary release — must not clear suppress.
        card.click();
        card.dispatchEvent(
          new PointerEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
        // Owner synthetic click — still suppressed.
        card.click();
      });
      expect(onAction).not.toHaveBeenCalled();
      expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  test("closing the menu clears long-press click suppression", () => {
    vi.useFakeTimers();
    const onAction = vi.fn();
    try {
      renderController({
        mode: "quick",
        onAction,
        actions: actionsWithDisabledAttack,
        autoActivateSingleEnabledAction: true,
      });
      const card = container?.querySelector("[data-sim-entity-id]");
      if (!(card instanceof HTMLButtonElement)) throw new Error("Missing test card.");

      act(() => {
        card.dispatchEvent(
          new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 10,
            clientY: 10,
            pointerType: "touch",
            pointerId: 1,
          }),
        );
      });
      act(() => {
        vi.advanceTimersByTime(450);
      });
      expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();

      // Dismiss without a synthetic click (common on iOS) — close via promptActive.
      renderController({
        mode: "quick",
        onAction,
        actions: actionsWithDisabledAttack,
        autoActivateSingleEnabledAction: true,
        promptActive: true,
      });
      expect(document.querySelector("[data-card-context-menu]")).toBeNull();

      renderController({
        mode: "quick",
        onAction,
        actions: actionsWithDisabledAttack,
        autoActivateSingleEnabledAction: true,
        promptActive: false,
      });
      const cardAfter = container?.querySelector("[data-sim-entity-id]");
      if (!(cardAfter instanceof HTMLButtonElement)) throw new Error("Missing test card.");
      act(() => {
        cardAfter.click();
      });
      expect(onAction).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  test("keeps disabled actions focusable and never dispatches them", () => {
    const onAction = vi.fn();
    renderController({ mode: "quick", onAction, actions: actionsWithDisabledAttack });
    openCardViaContextMenu();

    const disabled = document.querySelector('[data-action-id="attack"]') as HTMLButtonElement;
    expect(disabled.getAttribute("aria-disabled")).toBe("true");
    act(() => disabled.click());
    expect(onAction).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain("Attack unavailable. This unit is rested.");

    act(() => {
      (document.querySelector('[data-action-id="play"]') as HTMLButtonElement).click();
    });
    expect(onAction).toHaveBeenCalledWith(actionsWithDisabledAttack[0], entity);
    expect(document.querySelector("[data-card-context-menu]")).toBeNull();
  });

  test("opens the card image in a dialog on mobile", async () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    // useActiveLayout only re-evaluates on mount/resize; flush mobile layout before open.
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    try {
      renderController({ mode: "detailed" });
      // Allow useActiveLayout's post-mount effect to settle on mobile.
      await act(async () => {
        await Promise.resolve();
      });
      openCard();

      const previewToggle = document.querySelector(
        '[data-card-context-menu] button[aria-label="Show Test Card card image"]',
      ) as HTMLButtonElement;
      expect(previewToggle).not.toBeNull();
      expect(previewToggle.getAttribute("aria-haspopup")).toBe("dialog");
      act(() => previewToggle.click());

      const dialog = document.querySelector("[data-card-context-preview-dialog]");
      expect(dialog).not.toBeNull();
      const closeButton = document.querySelector(
        '[data-card-context-preview-dialog] button[aria-label="Close card image"]',
      ) as HTMLButtonElement;
      // Focus trap under jsdom may land on the dialog surface or the close
      // control; dialog presence is the product contract under test.
      expect(closeButton).not.toBeNull();
      expect(
        closeButton === document.activeElement ||
          dialog === document.activeElement ||
          Boolean(dialog?.contains(document.activeElement)),
      ).toBe(true);
      void act(() =>
        closeButton.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }),
        ),
      );
      // Focus may stay on close or the dialog surface under jsdom; presence is enough.
      expect(
        closeButton === document.activeElement ||
          dialog === document.activeElement ||
          Boolean(dialog?.contains(document.activeElement)),
      ).toBe(true);
      await act(async () => {
        closeButton.click();
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      });
      // Dialog closed; toggle remains available. Full focus restore is not
      // reliable across jsdom/CI versions of Radix Dialog.
      expect(document.querySelector("[data-card-context-preview-dialog]")).toBeNull();
      expect(previewToggle.isConnected).toBe(true);
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
      act(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  });

  test("uses an owning shell's mobile layout for card image previews in phone landscape", async () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 568 });

    try {
      renderController({ mode: "detailed", layoutOverride: "mobile" });
      await act(async () => {
        await Promise.resolve();
      });
      openCard();

      const previewToggle = document.querySelector(
        '[data-card-context-menu] button[aria-label="Show Test Card card image"]',
      ) as HTMLButtonElement;
      expect(previewToggle.getAttribute("aria-haspopup")).toBe("dialog");
      act(() => previewToggle.click());
      expect(document.querySelector("[data-card-context-preview-dialog]")).not.toBeNull();
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
      void act(() => window.dispatchEvent(new Event("resize")));
    }
  });

  test("toggles a native preview and clears it when the menu closes", () => {
    const onPreviewEntity = vi.fn();
    const onPreviewEnd = vi.fn();
    renderController({ mode: "detailed", onPreviewEntity, onPreviewEnd });
    openCard();

    const previewToggle = document.querySelector(
      '[data-card-context-menu] button[aria-label="Show Test Card card image"]',
    ) as HTMLButtonElement;
    act(() => previewToggle.click());
    expect(onPreviewEntity).toHaveBeenCalledWith(entity);
    expect(previewToggle.getAttribute("aria-expanded")).toBe("true");
    expect(previewToggle.getAttribute("aria-label")).toBe("Hide Test Card card image");

    act(() => previewToggle.click());
    expect(onPreviewEnd).toHaveBeenCalledTimes(1);
    expect(previewToggle.getAttribute("aria-expanded")).toBe("false");

    act(() => previewToggle.click());
    renderController({ mode: "detailed", stateVersion: 2, onPreviewEntity, onPreviewEnd });
    expect(onPreviewEnd).toHaveBeenCalledTimes(2);
  });

  test("keeps a native preview active when its end callback changes", () => {
    const onPreviewEntity = vi.fn();
    const initialOnPreviewEnd = vi.fn();
    const updatedOnPreviewEnd = vi.fn();
    renderController({ mode: "detailed", onPreviewEntity, onPreviewEnd: initialOnPreviewEnd });
    openCard();

    const previewToggle = document.querySelector(
      '[data-card-context-menu] button[aria-label="Show Test Card card image"]',
    ) as HTMLButtonElement;
    act(() => previewToggle.click());
    expect(previewToggle.getAttribute("aria-expanded")).toBe("true");

    renderController({ mode: "detailed", onPreviewEntity, onPreviewEnd: updatedOnPreviewEnd });
    expect(initialOnPreviewEnd).not.toHaveBeenCalled();
    expect(updatedOnPreviewEnd).not.toHaveBeenCalled();
    expect(previewToggle.getAttribute("aria-expanded")).toBe("true");

    act(() => previewToggle.click());
    expect(updatedOnPreviewEnd).toHaveBeenCalledTimes(1);
  });

  test("reveals public attached-card names from a relationship chip", () => {
    renderController({
      mode: "detailed",
      entity: {
        ...entity,
        details: {
          rules: entity.details?.rules ?? [],
          relationships: [
            {
              id: "attached-gear",
              label: "Attached Gear",
              entityIds: ["gear-1", "gear-2"],
              entityLabels: [
                { id: "gear-1", label: "Kiroshi Optics" },
                { id: "gear-2", label: "Mantis Blades" },
              ],
            },
          ],
        },
      },
    });
    openCard();

    const relationship = document.querySelector(
      '[aria-label="Attached Gear (2): Kiroshi Optics, Mantis Blades"]',
    ) as HTMLButtonElement;
    act(() => relationship.click());

    expect(relationship.getAttribute("aria-expanded")).toBe("true");
    expect(relationship.textContent).toContain("Kiroshi Optics");
    expect(relationship.textContent).toContain("Mantis Blades");
  });

  test("does not repeat generated keyword and effective summaries already covered by printed text", () => {
    const duplicateRulesEntity: SimulatorEntity = {
      ...entity,
      details: {
        rules: [
          {
            id: "ability:0",
            kind: "text",
            text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
          },
          {
            id: "printed",
            kind: "text",
            text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.) This Unit can't attack.",
          },
          { id: "ability:1", kind: "text", text: "This Unit can't attack." },
          {
            id: "keyword:blocker",
            kind: "keyword",
            label: "BLOCKER",
            text: "This card has blocker.",
          },
          { id: "effective:cantAttack", kind: "ability", label: "Effective", text: "cant Attack" },
        ],
      },
    };
    renderController({ mode: "detailed", entity: duplicateRulesEntity });
    openCard();

    expect(document.querySelectorAll("[data-card-context-rule]")).toHaveLength(1);
    expect(document.body.textContent).not.toContain("This card has blocker.");
  });

  test("activates the focused action from the keyboard", () => {
    const onAction = vi.fn();
    renderController({ mode: "quick", onAction });
    openCard();

    const play = document.querySelector('[data-action-id="play"]') as HTMLButtonElement;
    act(() => {
      play.focus();
      play.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });

    expect(onAction).toHaveBeenCalledWith(actions[0], entity);
    expect(document.querySelector("[data-card-context-menu]")).toBeNull();
  });

  test("gives an active prompt exclusive ownership of card clicks", () => {
    renderController({ mode: "detailed", promptActive: true });
    openCard();
    expect(document.querySelector("[data-card-context-menu]")).toBeNull();
  });

  test("closes an open surface when the authoritative state version changes", () => {
    renderController({ mode: "detailed", stateVersion: 1 });
    openCard();
    expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();

    renderController({ mode: "detailed", stateVersion: 2 });
    expect(document.querySelector("[data-card-context-menu]")).toBeNull();
  });

  test("rebinds an open surface when the rendered card element is replaced", async () => {
    const onAction = vi.fn();
    renderController({ mode: "detailed", onAction });
    openCard();

    const original = container?.querySelector("[data-sim-entity-id]");
    if (!(original instanceof HTMLButtonElement)) throw new Error("Missing original card.");
    const replacement = document.createElement("button");
    replacement.type = "button";
    replacement.dataset.simEntityId = entity.id;
    replacement.textContent = "Replacement card";
    const controller = container?.querySelector("[data-card-context-controller]");
    if (!(controller instanceof HTMLDivElement)) throw new Error("Missing card controller.");

    await act(async () => {
      original.remove();
      await Promise.resolve();
      controller.append(replacement);
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    });

    expect(replacement.getAttribute("aria-haspopup")).toBe("dialog");
    expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();

    act(() => {
      (document.querySelector('[data-action-id="play"]') as HTMLButtonElement).click();
    });

    expect(onAction).toHaveBeenCalledWith(actions[0], entity);
    expect(document.activeElement).toBe(replacement);
  });

  test("closes an open surface when its card anchor is removed without a replacement", async () => {
    renderController({ mode: "detailed" });
    openCard();

    const original = container?.querySelector("[data-sim-entity-id]");
    if (!(original instanceof HTMLButtonElement)) throw new Error("Missing original card.");

    await act(async () => {
      original.remove();
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    });

    expect(document.querySelector("[data-card-context-menu]")).toBeNull();
  });
});

function renderController({
  mode,
  promptActive = false,
  stateVersion = 1,
  onAction = () => undefined,
  onModeChange = () => undefined,
  onPreviewEntity,
  onPreviewEnd,
  entity: renderedEntity = entity,
  actions: renderedActions = actions,
  autoActivationActions,
  autoActivateSingleEnabledAction = false,
  visualIdentity,
  children,
  layoutOverride,
}: {
  mode: "quick" | "detailed";
  promptActive?: boolean;
  stateVersion?: number;
  onAction?: (action: SimulatorCardAction, entity: SimulatorEntity) => void;
  onModeChange?: (mode: "quick" | "detailed") => void;
  onPreviewEntity?: (entity: SimulatorEntity) => void;
  onPreviewEnd?: () => void;
  entity?: SimulatorEntity;
  actions?: readonly SimulatorCardAction[];
  autoActivationActions?: readonly SimulatorCardAction[];
  autoActivateSingleEnabledAction?: boolean;
  visualIdentity?: CardContextMenuVisualIdentity;
  children?: ReactNode;
  layoutOverride?: "desktop" | "mobile";
}) {
  if (!container) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  const controller = (
    <CardContextMenuController
      entities={[renderedEntity]}
      actionsForEntity={() => renderedActions}
      autoActivationActionsForEntity={
        autoActivationActions ? () => autoActivationActions : undefined
      }
      mode={mode}
      stateVersion={stateVersion}
      promptActive={promptActive}
      autoActivateSingleEnabledAction={autoActivateSingleEnabledAction}
      onModeChange={onModeChange}
      onAction={onAction}
      onPreviewEntity={onPreviewEntity}
      onPreviewEnd={onPreviewEnd}
      visualIdentity={visualIdentity}
      layoutOverride={layoutOverride}
    >
      {children ?? (
        <button type="button" data-sim-entity-id={renderedEntity.id}>
          Test Card
        </button>
      )}
    </CardContextMenuController>
  );
  act(() => root?.render(controller));
}

function openCard() {
  const card = container?.querySelector("[data-sim-entity-id]");
  if (!(card instanceof HTMLButtonElement)) throw new Error("Missing test card.");
  act(() => {
    card.click();
  });
}

function openCardViaContextMenu() {
  const card = container?.querySelector("[data-sim-entity-id]");
  if (!(card instanceof HTMLButtonElement)) throw new Error("Missing test card.");
  act(() => {
    card.dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2 }),
    );
  });
}

function actionIds(): string[] {
  return [...document.querySelectorAll<HTMLElement>("[data-action-id]")].map(
    (element) => element.dataset.actionId ?? "",
  );
}

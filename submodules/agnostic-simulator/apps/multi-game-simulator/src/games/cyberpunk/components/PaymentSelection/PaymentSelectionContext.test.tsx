// @vitest-environment jsdom

import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import {
  promoLucynaKushinada,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
} from "@tcg/cyberpunk-cards";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

vi.mock("../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../animation")>("../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { CYBERPUNK_P1 } from "../../testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { LEGEND_CARD_BACK } from "../GameBoard/CardImage";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../testing/render-cyberpunk-simulator";

describe("board payment selection", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  test("spent Legends still require choosing Eddies in manual mode", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "paymentOnlyEddiesQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));

      const card = view.container.querySelector<HTMLElement>(
        '[data-testid="hand-card"][data-card-name="Mox Inciters"]',
      );
      expect(card).toBeTruthy();
      fireEvent.click(card!.querySelector<HTMLElement>('[data-testid="card"]')!);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu.querySelector<HTMLButtonElement>('[data-action-id^="playCard:"]')!);

      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
      expect(
        view.container.querySelector('[data-zone="p-field"][data-card-name="Mox Inciters"]'),
      ).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: /^Pay automatically/ }));

      await waitFor(() => {
        expect(
          view.container.querySelector('[data-zone="p-field"][data-card-name="Mox Inciters"]'),
        ).toBeTruthy();
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
        expect(
          view.container.querySelector('[data-testid="eddies-zone"][data-count="1"]'),
        ).toBeTruthy();
      });
    } finally {
      view.unmount();
    }
  });

  test("a cost that uses every ready Eddie and Legend pays automatically in manual mode", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "paymentAllResourcesQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const playerSide = view.container
        .querySelector('[data-testid="eddies-zone"][data-count="2"]')
        ?.getAttribute("data-side");
      expect(playerSide).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));

      const card = view.container.querySelector<HTMLElement>(
        '[data-testid="hand-card"][data-card-name="Mox Inciters"]',
      );
      expect(card).toBeTruthy();
      fireEvent.click(card!.querySelector<HTMLElement>('[data-testid="card"]')!);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu.querySelector<HTMLButtonElement>('[data-action-id^="playCard:"]')!);

      await waitFor(() => {
        expect(
          view.container.querySelector('[data-zone="p-field"][data-card-name="Mox Inciters"]'),
        ).toBeTruthy();
        expect(
          view.container.querySelector('[data-zone="p-legendArea"][data-spent="true"]'),
        ).toBeTruthy();
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
        expect(
          view.container.querySelector(
            `[data-testid="eddies-zone"][data-side="${playerSide}"][data-count="0"]`,
          ),
        ).toBeTruthy();
      });
    } finally {
      view.unmount();
    }
  });

  test("manual payment opens when a card uses all Eddies but Legends remain available", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "paymentFullEddiesQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));

      const card = view.container.querySelector<HTMLElement>(
        '[data-testid="hand-card"][data-card-name="MaxTac Suppression Team"]',
      );
      expect(card).toBeTruthy();
      fireEvent.click(card!.querySelector<HTMLElement>('[data-testid="card"]')!);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu.querySelector<HTMLButtonElement>('[data-action-id^="playCard:"]')!);

      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
      expect(
        view.container.querySelector(
          '[data-zone="p-field"][data-card-name="MaxTac Suppression Team"]',
        ),
      ).toBeNull();
      expect(
        view.container.querySelector('[data-testid="eddies-zone"][data-count="5"]'),
      ).toBeTruthy();
      expect(
        view.container.querySelectorAll('[data-zone="p-legendArea"][data-spent="false"]'),
      ).toHaveLength(3);

      fireEvent.keyDown(window, { key: "Escape" });
      await waitFor(() => {
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
      });
    } finally {
      view.unmount();
    }
  });

  test("a concealed Legend keeps its card back in the payment prompt preview", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "paymentFullEddiesQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));

      const slot = view.container.querySelector<HTMLElement>(
        '[data-zone-id="p-legendArea"] [data-testid="legend-slot"][data-occupied="true"][data-face-down="true"]',
      );
      expect(slot).toBeTruthy();
      expect(slot!.getAttribute("data-peeked")).toBe("false");
      fireEvent.click(slot!.querySelector<HTMLElement>('[data-testid="card"]')!);

      // Presented Legends sit face-down in random order (CR 7.7): the prompt
      // opens (the call itself is legal) but must not identify the slot.
      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
      const preview = screen
        .getByRole("region", { name: "Choose payment" })
        .querySelector<HTMLImageElement>('[aria-label="Card awaiting payment"] img');
      expect(preview).toBeTruthy();
      expect(preview!.src).toBe(LEGEND_CARD_BACK);
      expect(preview!.alt).toBe("Hidden card");
    } finally {
      view.unmount();
    }
  });

  test("QUICK ability waits for Eddie selection before automatically spending its Legend", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "paymentQuickAbilityQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const dumDum = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDumDumMaelstromTriggerman.id,
      );
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));
      fireEvent.click(
        view.container.querySelector<HTMLElement>(
          `[data-testid="card"][data-instance-id="${dumDum.instanceId}"]`,
        )!,
      );

      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
      // DumDum is face-up, so the prompt preview may show the real art.
      const faceUpPreview = screen
        .getByRole("region", { name: "Choose payment" })
        .querySelector<HTMLImageElement>('[aria-label="Card awaiting payment"] img');
      expect(faceUpPreview).toBeTruthy();
      expect(faceUpPreview!.src).not.toContain("/cards/back/");
      expect(faceUpPreview!.alt).toContain("Dum Dum");
      expect(
        view.container
          .querySelector(`[data-instance-id="${dumDum.instanceId}"]`)
          ?.getAttribute("data-spent"),
      ).toBe("false");
      fireEvent.click(screen.getByRole("button", { name: /^Pay automatically/ }));

      await waitFor(() => {
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
        expect(
          view.container
            .querySelector(`[data-instance-id="${dumDum.instanceId}"]`)
            ?.getAttribute("data-spent"),
        ).toBe("true");
        expect(
          view.container.querySelector('[data-testid="eddies-zone"][data-count="1"]'),
        ).toBeTruthy();
      });
    } finally {
      view.unmount();
    }
  });

  test("clicking a ready Eddie commits manual payment without a dialog", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "boardTappedResourcesQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const lucyna = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        promoLucynaKushinada.id,
      );

      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));
      fireEvent.click(
        view.container.querySelector<HTMLElement>(
          `[data-testid="card"][data-instance-id="${lucyna.instanceId}"]`,
        )!,
      );

      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
      expect(screen.queryByRole("dialog", { name: /Choose payment/ })).toBeNull();

      const eddieSource = await waitFor(() => {
        const source = view.container.querySelector<HTMLElement>(
          '[data-payment-source="true"][data-resource-state="ready"]',
        );
        expect(source).toBeTruthy();
        return source!;
      });
      const sourceId = eddieSource.getAttribute("data-instance-id");
      expect(sourceId).toBeTruthy();
      fireEvent.click(eddieSource.querySelector("button")!);

      await waitFor(() => {
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
        expect(
          view.container
            .querySelector(`[data-instance-id="${sourceId}"]`)
            ?.getAttribute("data-spent"),
        ).toBe("true");
        expect(
          view.container
            .querySelector(`[data-instance-id="${lucyna.instanceId}"]`)
            ?.getAttribute("data-face-down"),
        ).toBe("false");
      });
    } finally {
      view.unmount();
    }
  });

  test("hybrid payment uses the Eddie counter when no ready Eddie cards exist", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const initialEddies = view.container.querySelector<HTMLElement>(
        '[data-testid="eddies-zone"][data-count="5"]',
      );
      expect(initialEddies).toBeTruthy();
      const playerSide = initialEddies?.getAttribute("data-side");
      expect(playerSide).toBeTruthy();
      expect(initialEddies?.querySelector('[data-payment-source="true"]')).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));

      const handCard = await waitFor(() => {
        const card = view.container.querySelector<HTMLElement>(
          '[data-testid="hand-card"][data-card-name="Mox Inciters"]',
        );
        expect(card).toBeTruthy();
        return card!;
      });
      fireEvent.click(handCard.querySelector<HTMLElement>('[data-testid="card"]')!);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu.querySelector<HTMLButtonElement>('[data-action-id^="playCard:"]')!);

      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
      const legendSource = view.container.querySelector<HTMLElement>(
        '[data-payment-source="true"]',
      );
      expect(legendSource).toBeTruthy();
      fireEvent.click(legendSource!);

      fireEvent.click(await screen.findByRole("button", { name: /^Pay rest automatically/ }));

      await waitFor(() => {
        expect(
          view.container.querySelector('[data-zone="p-field"][data-card-name="Mox Inciters"]'),
        ).toBeTruthy();
        expect(
          view.container
            .querySelector(`[data-testid="eddies-zone"][data-side="${playerSide}"]`)
            ?.getAttribute("data-count"),
        ).toBe("3");
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
      });
    } finally {
      view.unmount();
    }
  });

  test("Jackie Welles's paid defeat replacement opens resource selection", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "regressionRedirectDefeatChoice" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));
      fireEvent.click(screen.getByTestId("redirect-defeat-apply"));

      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
    } finally {
      view.unmount();
    }
  });

  test("a pool of physical Eddie cards still offers automatic payment in manual mode", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "paymentPhysicalEddiesQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));

      const card = view.container.querySelector<HTMLElement>(
        '[data-testid="hand-card"][data-card-name="Mox Inciters"]',
      );
      expect(card).toBeTruthy();
      fireEvent.click(card!.querySelector<HTMLElement>('[data-testid="card"]')!);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu.querySelector<HTMLButtonElement>('[data-action-id^="playCard:"]')!);

      // Every ready Eddie is a physical card here, so the old virtual-pool
      // gate hid this button; it must stay available and settle the payment
      // with the engine's automatic order.
      fireEvent.click(await screen.findByRole("button", { name: /^Pay automatically/ }));

      await waitFor(() => {
        expect(
          view.container.querySelector('[data-zone="p-field"][data-card-name="Mox Inciters"]'),
        ).toBeTruthy();
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
        expect(
          view.container.querySelector('[data-testid="eddies-zone"]')?.getAttribute("data-count"),
        ).toBe("0");
        // The engine's automatic order: the Eddie pool first, then Legends in
        // spend priority until the cost is covered.
        expect(
          view.container.querySelectorAll('[data-zone="p-legendArea"][data-spent="true"]'),
        ).toHaveLength(2);
      });
    } finally {
      view.unmount();
    }
  });

  test("tapping a specific Legend pays the rest automatically when the pool runs short", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "paymentPhysicalEddiesQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));

      const card = view.container.querySelector<HTMLElement>(
        '[data-testid="hand-card"][data-card-name="Mox Inciters"]',
      );
      expect(card).toBeTruthy();
      fireEvent.click(card!.querySelector<HTMLElement>('[data-testid="card"]')!);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu.querySelector<HTMLButtonElement>('[data-action-id^="playCard:"]')!);

      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
      // Hand-pick one Legend, then let the engine settle the remaining 2 €$
      // from the 1 €$ pool plus the next Legend in spend priority.
      fireEvent.click(
        view.container.querySelector<HTMLElement>(
          '[data-zone="p-legendArea"][data-payment-source="true"]',
        )!,
      );
      fireEvent.click(await screen.findByRole("button", { name: /^Pay rest automatically/ }));

      await waitFor(() => {
        expect(
          view.container.querySelector('[data-zone="p-field"][data-card-name="Mox Inciters"]'),
        ).toBeTruthy();
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
        expect(
          view.container.querySelector('[data-testid="eddies-zone"]')?.getAttribute("data-count"),
        ).toBe("0");
        // The picked Legend plus exactly one auto-selected Legend — the third
        // stays ready because the pool covered its share.
        expect(
          view.container.querySelectorAll('[data-zone="p-legendArea"][data-spent="true"]'),
        ).toHaveLength(2);
      });
    } finally {
      view.unmount();
    }
  });
});

function ensureBrowserSupport() {
  ensureJsdomAnimationSupport();
  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
  globalThis.ResizeObserver ??= class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

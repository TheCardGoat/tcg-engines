// @vitest-environment jsdom
import { BoardSharedPage } from "../../pages/BoardShared.page";
import { UserConfigProvider, type EngineAction } from "../../engine";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import { act, cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import type { PointerDragDropSurfaceProps } from "@tcg/simulator-ui";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import type { CardDragSource } from "../../engine/dropEvent";
import {
  filterAcceptableCardTargets,
  encodeTargetId,
  prioritizeDirectAttackCollisions,
  prioritizeSellCollisions,
} from "./DragDropContext";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  renderCyberpunkSimulatorScenario as renderScenario,
  type RenderCyberpunkSimulatorOptions,
} from "../../testing/render-cyberpunk-simulator";
import { CyberpunkTestEngine, P1, P2 } from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailDonTFearTheReaper,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSwordwiseHuscle,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailVStreetkid,
  promoLucynaKushinada,
} from "@tcg/cyberpunk-cards";

vi.mock("../BoardV2/Scene", () => ({ default: () => null }));

const harness = vi.hoisted(() => ({
  props: null as PointerDragDropSurfaceProps<CardDragSource> | null,
}));
vi.mock("@tcg/simulator-ui", async () => {
  const actual = await vi.importActual<typeof import("@tcg/simulator-ui")>("@tcg/simulator-ui");
  return {
    ...actual,
    PointerDragDropSurface: (props: PointerDragDropSurfaceProps<CardDragSource>) => {
      harness.props = props;
      return props.children;
    },
  };
});
vi.mock("../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../animation")>("../../animation");
  return { ...actual, SoundPlayer: () => null };
});
afterEach(() => {
  cleanup();
  harness.props = null;
  vi.clearAllMocks();
});

beforeEach(() => {
  window.localStorage.clear();
  ensureJsdomAnimationSupport();
  window.matchMedia ??= (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test("a field drag prefers Rival Gigs when the pointer is inside its thin drop lane", () => {
  const rivalFieldId = encodeTargetId({ type: "zone", zone: "opp-field" });
  const rivalGigsId = encodeTargetId({ type: "zone", zone: "opp-gigArea" });
  const collisions = [{ id: rivalFieldId }, { id: rivalGigsId }];
  const droppableRects = new Map([
    [rivalFieldId, { top: 0, right: 300, bottom: 100, left: 0 }],
    [rivalGigsId, { top: 100, right: 300, bottom: 150, left: 0 }],
  ]);

  expect(
    prioritizeDirectAttackCollisions(
      { type: "card", zone: "p-field", index: 0, cardId: "attacker-1" },
      collisions,
      {
        pointerCoordinates: { x: 140, y: 125 },
        droppableRects,
      },
    ).map((collision) => collision.id),
  ).toEqual([rivalGigsId, rivalFieldId]);
});

test("a hand drag prefers Sell when its surface overlaps the broad field target", () => {
  const fieldId = encodeTargetId({ type: "zone", zone: "p-field" });
  const sellId = encodeTargetId({ type: "zone", zone: "p-eddies" });
  const collisions = [{ id: fieldId }, { id: sellId }];
  const droppableRects = new Map([
    [fieldId, { top: 0, right: 400, bottom: 500, left: 0 }],
    [sellId, { top: 320, right: 180, bottom: 500, left: 0 }],
  ]);

  expect(
    prioritizeSellCollisions(
      { type: "card", zone: "p-hand", index: 0, cardId: "hand-card-1" },
      collisions,
      { pointerCoordinates: { x: 80, y: 410 }, droppableRects },
    ).map((collision) => collision.id),
  ).toEqual([sellId, fieldId]);
});

test("a specific Gear or Program card target wins over Sell, while a Unit still sells", () => {
  const fieldId = encodeTargetId({ type: "zone", zone: "p-field" });
  const sellId = encodeTargetId({ type: "zone", zone: "p-eddies" });
  const legendId = encodeTargetId({
    type: "card",
    zone: "p-legendArea",
    index: 0,
    cardId: "face-up-legend",
  });
  const collisions = [{ id: fieldId }, { id: legendId }, { id: sellId }];
  const droppableRects = new Map([
    [fieldId, { top: 0, right: 400, bottom: 500, left: 0 }],
    [legendId, { top: 320, right: 100, bottom: 450, left: 10 }],
    [sellId, { top: 300, right: 180, bottom: 500, left: 0 }],
  ]);
  const options = {
    pointerCoordinates: { x: 55, y: 380 },
    droppableRects,
    gearTargets: new Set(["face-up-legend"]),
  };

  for (const cardType of ["gear", "program"] as const) {
    expect(
      prioritizeSellCollisions(
        { type: "card", zone: "p-hand", index: 0, cardId: "hand-card", cardType },
        collisions,
        options,
      )[0]?.id,
    ).toBe(legendId);
  }
  expect(
    prioritizeSellCollisions(
      { type: "card", zone: "p-hand", index: 0, cardId: "hand-card", cardType: "unit" },
      collisions,
      options,
    )[0]?.id,
  ).toBe(sellId);
  expect(
    prioritizeSellCollisions(
      { type: "card", zone: "p-hand", index: 0, cardId: "hand-card", cardType: "gear" },
      collisions,
      { ...options, gearTargets: new Set() },
    )[0]?.id,
  ).toBe(sellId);
});

describe.each(["v1", "v2"] as const)("%s drop controller", (ui) => {
  const renderCyberpunkSimulatorScenario = (options: RenderCyberpunkSimulatorOptions) =>
    renderScenario({ ...options, ui });
  test("a rejected or cancelled drop retains the card; an accepted drop actually plays it", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
    const card = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>(
          '[data-zone="p-hand"][data-card-name="Mox Inciters"]',
        );
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );
    expect(view.container.querySelector('[data-ui-version="v2"]') !== null).toBe(ui === "v2");
    const cardId = card.dataset.instanceId!;
    const source: CardDragSource = {
      type: "card",
      zone: "p-hand",
      index: Number(card.dataset.zoneIndex),
      cardId,
      cardType: "unit",
      name: "Mox Inciters",
    };
    const event = {
      active: {
        id: cardId,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
    };
    act(() => harness.props?.onDragStart?.(source, event));
    act(() => {
      expect(
        harness.props?.onDragEnd?.(source, encodeTargetId({ type: "zone", zone: "opp-field" }), {
          ...event,
          over: null,
          delta: { x: 0, y: 0 },
          collisions: null,
        }),
      ).toEqual({ kind: "rejected" });
    });
    expect(card.dataset.zone).toBe("p-hand");
    act(() => harness.props?.onDragStart?.(source, event));
    act(() => harness.props?.onDragCancel?.());
    expect(card.dataset.zone).toBe("p-hand");
    act(() => harness.props?.onDragStart?.(source, event));
    act(() => {
      expect(
        harness.props?.onDragEnd?.(source, encodeTargetId({ type: "zone", zone: "p-field" }), {
          ...event,
          over: null,
          delta: { x: 0, y: 0 },
          collisions: null,
        }),
      ).toEqual({ kind: "accepted" });
    });
    await waitFor(() => {
      expect(
        view.container.querySelector(`[data-instance-id="${cardId}"][data-zone="p-hand"]`),
      ).toBeNull();
      expect(
        view.container.querySelector(`[data-instance-id="${cardId}"][data-zone="p-field"]`),
      ).not.toBeNull();
    });
  });

  test("only a Sell-tag hand card can be dropped into Eddies", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
    for (const [name, cardType, expected] of [
      ["Swordwise Huscle", "unit", "rejected"],
      ["Floor It", "program", "accepted"],
    ] as const) {
      const card = await waitFor(() => {
        const node = view.container.querySelector<HTMLElement>(
          `[data-zone="p-hand"][data-card-name="${name}"]`,
        );
        expect(node).not.toBeNull();
        return node!;
      });
      const source: CardDragSource = {
        type: "card",
        zone: "p-hand",
        index: Number(card.dataset.zoneIndex),
        cardId: card.dataset.instanceId!,
        cardType,
        name,
      };
      const event = {
        active: {
          id: source.cardId!,
          data: { current: {} },
          rect: { current: { initial: null, translated: null } },
        },
        activatorEvent: new Event("pointerdown"),
        over: null,
        delta: { x: 0, y: 0 },
        collisions: null,
      };
      act(() => harness.props?.onDragStart?.(source, event));
      act(() =>
        expect(
          harness.props?.onDragEnd?.(
            source,
            encodeTargetId({ type: "zone", zone: "p-eddies" }),
            event,
          ),
        ).toEqual({ kind: expected }),
      );
      await waitFor(() =>
        expect(
          view.container.querySelector(
            `[data-instance-id="${source.cardId}"][data-zone="p-hand"]`,
          ) !== null,
        ).toBe(expected === "rejected"),
      );
    }
  });

  test("a hand Gear drag attaches to a face-up friendly Legend", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "openingMain",
      boardProps: {
        initialEngineBuilder: () =>
          CyberpunkTestEngine.createWithFixture({
            hand: [welcomeToNightCityRetailMantisBlades],
            legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
            eddies: 2,
          }),
      },
    });
    const gear = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>(
          '[data-zone="p-hand"][data-card-name="Mantis Blades"]',
        );
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );
    const legend = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>(
          `[data-zone="p-legendArea"][data-definition-id="${theHeistRetailStarterDeckVCorporateExile.id}"]`,
        );
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );
    const source: CardDragSource = {
      type: "card",
      zone: "p-hand",
      index: Number(gear.dataset.zoneIndex),
      cardId: gear.dataset.instanceId!,
      cardType: "gear",
      name: "Mantis Blades",
    };
    const event = {
      active: {
        id: source.cardId!,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
    };
    act(() => harness.props?.onDragStart?.(source, event));
    act(() => {
      expect(
        harness.props?.onDragEnd?.(
          source,
          encodeTargetId({
            type: "card",
            zone: legend.dataset.zone!,
            index: Number(legend.dataset.zoneIndex),
            cardId: legend.dataset.instanceId,
          }),
          { ...event, over: null, delta: { x: 0, y: 0 }, collisions: null },
        ),
      ).toEqual({ kind: "accepted" });
    });
    await waitFor(() => {
      expect(
        view.container.querySelector(`[data-instance-id="${source.cardId}"][data-zone="p-hand"]`),
      ).toBeNull();
      expect(
        view.container.querySelector(
          `[data-zone="p-legendArea"][data-instance-id="${legend.dataset.instanceId}"] [data-attached-to-id="${legend.dataset.instanceId}"]`,
        ),
      ).not.toBeNull();
    });
  });

  test("Gear rejects a rival host and attaches to the chosen friendly unit", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "openingMain",
      boardProps: {
        initialEngineBuilder: () =>
          CyberpunkTestEngine.createWithFixture(
            {
              hand: [welcomeToNightCityRetailMantisBlades],
              field: [welcomeToNightCityRetailFieldOperator],
              eddies: 2,
            },
            { field: [welcomeToNightCityRetailCorpoSecurity] },
          ),
      },
    });
    const gear = await waitFor(() => {
      const card = view.container.querySelector<HTMLElement>(
        '[data-zone="p-hand"][data-card-name="Mantis Blades"]',
      );
      expect(card).not.toBeNull();
      return card!;
    });
    const source: CardDragSource = {
      type: "card",
      zone: "p-hand",
      index: Number(gear.dataset.zoneIndex),
      cardId: gear.dataset.instanceId!,
      cardType: "gear",
    };
    const event = {
      active: {
        id: source.cardId!,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
      over: null,
      delta: { x: 0, y: 0 },
      collisions: null,
    };
    for (const [zone, expected] of [
      ["opp-field", "rejected"],
      ["p-field", "accepted"],
    ] as const) {
      const host = view.container.querySelector<HTMLElement>(
        `[data-zone="${zone}"][data-card-name]`,
      )!;
      const target = encodeTargetId({
        type: "card",
        zone,
        index: Number(host.dataset.zoneIndex),
        cardId: host.dataset.instanceId!,
      });
      act(() => harness.props?.onDragStart?.(source, event));
      act(() =>
        expect(harness.props?.onDragEnd?.(source, target, event)).toEqual({ kind: expected }),
      );
      if (expected === "rejected") expect(gear.isConnected).toBe(true);
      else
        await waitFor(() =>
          expect(
            view.container.querySelector(
              `[data-zone="p-field"] [data-attached-to-id="${host.dataset.instanceId}"]`,
            ),
          ).not.toBeNull(),
        );
    }
  });

  test("a payable GO SOLO Legend drags from the legend area to the field", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "openingMain",
      boardProps: {
        initialEngineBuilder: () =>
          CyberpunkTestEngine.createWithFixture({
            legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
            eddies: 5,
          }),
      },
    });
    const legend = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>(
          `[data-zone="p-legendArea"][data-definition-id="${theHeistRetailStarterDeckVCorporateExile.id}"]`,
        );
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );
    const source: CardDragSource = {
      type: "card",
      zone: "p-legendArea",
      index: Number(legend.dataset.zoneIndex),
      cardId: legend.dataset.instanceId!,
      cardType: "legend",
      name: "V - Corporate Exile",
    };
    const event = {
      active: {
        id: source.cardId!,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
    };

    expect(legend.dataset.draggable).toBe("true");
    act(() => harness.props?.onDragStart?.(source, event));
    expect(
      view.container.querySelector<HTMLElement>('[data-zone-id="p-field"]')?.dataset.dropReady,
    ).toBe("goSolo");
    act(() => {
      expect(
        harness.props?.onDragEnd?.(source, encodeTargetId({ type: "zone", zone: "p-field" }), {
          ...event,
          over: null,
          delta: { x: 0, y: 0 },
          collisions: null,
        }),
      ).toEqual({ kind: "accepted" });
    });
    await waitFor(() => {
      expect(
        view.container.querySelector(
          `[data-instance-id="${source.cardId}"][data-zone="p-legendArea"]`,
        ),
      ).toBeNull();
      const playedLegend = view.container.querySelector<HTMLElement>(
        `[data-instance-id="${source.cardId}"][data-zone="p-field"]`,
      );
      expect(playedLegend).not.toBeNull();
      expect(playedLegend?.dataset.spent).toBe("false");
    });
  });

  test("a GO SOLO Legend without enough resources is not draggable", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "openingMain",
      boardProps: {
        initialEngineBuilder: () =>
          CyberpunkTestEngine.createWithFixture({
            legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
            eddies: 0,
          }),
      },
    });
    const legend = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>(
          `[data-zone="p-legendArea"][data-definition-id="${theHeistRetailStarterDeckVCorporateExile.id}"]`,
        );
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );

    expect(legend.dataset.draggable).toBe("false");
  });

  test("a Program card drop pays first, then uses the engine target choice", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progFloorIt",
      boardProps: {
        initialEngineBuilder: () => {
          return CyberpunkTestEngine.createWithFixture(
            {
              hand: [welcomeToNightCityRetailFloorIt],
              legendArea: [
                theHeistRetailStarterDeckVCorporateExile,
                welcomeToNightCityRetailVStreetkid,
                promoLucynaKushinada,
              ].map((card) => ({ card, faceDown: false })),
            },
            { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
            { autoGainGig: false },
          );
        },
      },
    });
    const card = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>(
          '[data-zone="p-hand"][data-card-name="Floor It"]',
        );
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );
    if (ui === "v2") {
      fireEvent.click(screen.getByRole("button", { name: "Manual payment" }));
    } else {
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));
    }
    const target = view.container.querySelector<HTMLElement>(
      '[data-zone="opp-field"][data-card-name="Corpo Security"]',
    )!;
    expect(target).not.toBeNull();
    const targetId = target.dataset.instanceId!;
    const originalPower = Number(target.dataset.power);
    const source: CardDragSource = {
      type: "card",
      zone: "p-hand",
      index: Number(card.dataset.zoneIndex),
      cardId: card.dataset.instanceId!,
      cardType: "program",
      name: "Floor It",
    };
    const event = {
      active: {
        id: source.cardId!,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
    };
    act(() => harness.props?.onDragStart?.(source, event));
    act(() => {
      expect(
        harness.props?.onDragEnd?.(
          source,
          encodeTargetId({
            type: "card",
            zone: "opp-field",
            index: 0,
            cardId: targetId,
          }),
          {
            ...event,
            over: null,
            delta: { x: 0, y: 0 },
            collisions: null,
          },
        ),
      ).toEqual({ kind: "accepted" });
    });
    expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
    expect(
      view.container.querySelector(`[data-instance-id="${source.cardId}"][data-zone="p-hand"]`),
    ).not.toBeNull();
    const sources = view.container.querySelectorAll('[data-payment-source="true"]');
    expect(sources.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(sources[0]);
    await waitFor(() => {
      expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
      expect(
        view.container.querySelector(`[data-instance-id="${source.cardId}"][data-zone="p-hand"]`),
      ).toBeNull();
      const resolvedTarget = view.container.querySelector<HTMLElement>(
        `[data-instance-id="${targetId}"][data-zone="opp-field"]`,
      );
      expect(Number(resolvedTarget?.dataset.power)).toBe(originalPower - 1);
    });
  });

  test("an ineligible Program drop target leaves the effect choice to the player", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progFloorIt" });
    const card = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>(
          '[data-zone="p-hand"][data-card-name="Floor It"]',
        );
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );
    const friendly = view.container.querySelector<HTMLElement>(
      '[data-zone="p-field"][data-card-name="Swordwise Huscle"]',
    )!;
    const rivalCard = () =>
      view.container.querySelector<HTMLElement>(
        '[data-zone="opp-field"][data-card-name="Corpo Security"]',
      );
    const rival = rivalCard()!;
    expect(friendly).not.toBeNull();
    expect(rival).not.toBeNull();
    const originalPower = Number(rival.dataset.power);
    const source: CardDragSource = {
      type: "card",
      zone: "p-hand",
      index: Number(card.dataset.zoneIndex),
      cardId: card.dataset.instanceId!,
      cardType: "program",
    };
    const event = {
      active: {
        id: source.cardId!,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
    };
    act(() => harness.props?.onDragStart?.(source, event));
    act(() => {
      expect(
        harness.props?.onDragEnd?.(
          source,
          encodeTargetId({
            type: "card",
            zone: "p-field",
            index: 0,
            cardId: friendly.dataset.instanceId!,
          }),
          { ...event, over: null, delta: { x: 0, y: 0 }, collisions: null },
        ),
      ).toEqual({ kind: "accepted" });
    });
    await waitFor(() => {
      expect(
        view.container.querySelector(`[data-instance-id="${source.cardId}"][data-zone="p-hand"]`),
      ).toBeNull();
      expect(rivalCard()?.dataset.choiceEligible).toBe("true");
    });
    expect(Number(rivalCard()?.dataset.power)).toBe(originalPower);
    fireEvent.click(rivalCard()!);
    await waitFor(() => expect(Number(rivalCard()?.dataset.power)).toBe(originalPower - 1));
  });

  test("cancelling payment clears a Program card-drop target", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progFloorIt" });
    const card = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>(
          '[data-zone="p-hand"][data-card-name="Floor It"]',
        );
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );
    const rivalCard = () =>
      view.container.querySelector<HTMLElement>(
        '[data-zone="opp-field"][data-card-name="Corpo Security"]',
      );
    const targetId = rivalCard()!.dataset.instanceId!;
    const source: CardDragSource = {
      type: "card",
      zone: "p-hand",
      index: Number(card.dataset.zoneIndex),
      cardId: card.dataset.instanceId!,
      cardType: "program",
    };
    const event = {
      active: {
        id: source.cardId!,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
    };
    if (ui === "v2") {
      fireEvent.click(screen.getByRole("button", { name: "Manual payment" }));
    } else {
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for every cost" }));
    }
    const drop = (targetId: string) => {
      act(() => harness.props?.onDragStart?.(source, event));
      act(() => {
        expect(
          harness.props?.onDragEnd?.(source, targetId, {
            ...event,
            over: null,
            delta: { x: 0, y: 0 },
            collisions: null,
          }),
        ).toEqual({ kind: "accepted" });
      });
    };
    drop(encodeTargetId({ type: "card", zone: "opp-field", index: 0, cardId: targetId }));
    expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull(),
    );
    expect(
      view.container.querySelector(`[data-instance-id="${source.cardId}"][data-zone="p-hand"]`),
    ).not.toBeNull();

    drop(encodeTargetId({ type: "zone", zone: "p-field" }));
    expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
    const paymentSource = view.container.querySelector<HTMLElement>(
      '[data-payment-source="true"]',
    )!;
    fireEvent.click(paymentSource);
    await waitFor(() => {
      expect(rivalCard()?.dataset.choiceEligible).toBe("true");
      expect(
        view.container.querySelector(`[data-instance-id="${source.cardId}"][data-zone="p-hand"]`),
      ).toBeNull();
    });
  });

  test("a hosted Program card drop targets only after the server exposes its effect choice", async () => {
    const server = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailDonTFearTheReaper], eddies: 7 },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: true },
        ],
      },
      { autoGainGig: false },
    );
    const remoteDispatch = vi.fn((_action: EngineAction) => true);
    const remoteProps = () => ({
      initialEngineBuilder: () => server,
      remoteDispatch,
      remotePrompt: server.getPrompt(P1),
      remoteInteractionView: buildCyberpunkInteractionView({
        actorId: P1,
        stateVersion: server.getState().ctx.stateID,
        state: server.getState(),
        prompt: server.getPrompt(P1),
      }),
    });
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progFloorIt",
      boardProps: remoteProps(),
    });
    const showServerState = () =>
      view.rerender(
        <UserConfigProvider>
          <BoardSharedPage
            {...remoteProps()}
            scenarioId="progFloorIt"
            initialAi={{ player: null, opponent: null }}
            initialAiMode="step"
            autoResolveSingletonCardTargets={false}
          />
        </UserConfigProvider>,
      );
    const reaperId = server.findCardId(welcomeToNightCityRetailDonTFearTheReaper, "hand", P1);
    const readyId = server.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    const fieldCard = () =>
      view.container.querySelector<HTMLElement>(
        `[data-instance-id="${readyId}"][data-zone="opp-field"]`,
      );
    const source: CardDragSource = {
      type: "card",
      zone: "p-hand",
      index: 0,
      cardId: reaperId,
      cardType: "program",
    };
    const event = {
      active: {
        id: reaperId,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
    };
    act(() => harness.props?.onDragStart?.(source, event));
    expect(fieldCard()?.dataset.choiceEligible).toBe("false");
    act(() => {
      expect(
        harness.props?.onDragEnd?.(
          source,
          encodeTargetId({
            type: "card",
            zone: "opp-field",
            index: 0,
            cardId: readyId,
          }),
          {
            ...event,
            over: null,
            delta: { x: 0, y: 0 },
            collisions: null,
          },
        ),
      ).toEqual({ kind: "accepted" });
    });
    expect(remoteDispatch.mock.calls.map(([action]) => action.type)).toEqual(["playCard"]);
    expect(fieldCard()?.dataset.spent).toBe("false");
    expect(fieldCard()?.dataset.choiceEligible).toBe("false");

    // Transport acceptance has not resolved the card. Only the next server
    // projection exposes the target choice, after the spend-all effect.
    server.playCard(reaperId, { as: P1 });
    showServerState();
    await waitFor(() =>
      expect(remoteDispatch.mock.calls.map(([action]) => action.type)).toEqual([
        "playCard",
        "resolveEffectTarget",
      ]),
    );
    expect(fieldCard()?.dataset.spent).toBe("true");
    expect(remoteDispatch.mock.calls[1][0]).toMatchObject({ targetIds: [readyId] });
    server.resolveEffectTarget(readyId, { as: P1 });
    showServerState();
    await waitFor(() => expect(fieldCard()).toBeNull());
    server.expectNoPendingChoice();
    expect(view.container.querySelector('[data-choice-eligible="true"]')).toBeNull();
  });

  test("a drop released inside a choice window parks and plays once the window closes", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "openingMain",
      boardProps: {
        initialEngineBuilder: () =>
          CyberpunkTestEngine.createWithFixture(
            {
              hand: [welcomeToNightCityRetailMoxInciters, welcomeToNightCityRetailSwordwiseHuscle],
              eddies: 8,
            },
            { field: [welcomeToNightCityRetailCorpoSecurity] },
          ),
      },
    });
    const handCard = async (name: string) =>
      waitFor(
        () => {
          const node = view.container.querySelector<HTMLElement>(
            `[data-zone="p-hand"][data-card-name="${name}"]`,
          );
          expect(node).not.toBeNull();
          return node!;
        },
        { timeout: 5000 },
      );
    const mox = await handCard("Mox Inciters");
    const huscle = await handCard("Swordwise Huscle");

    const drag = (node: HTMLElement, cardType: CardDragSource["cardType"], target: string) => {
      const source: CardDragSource = {
        type: "card",
        zone: "p-hand",
        index: Number(node.dataset.zoneIndex),
        cardId: node.dataset.instanceId!,
        cardType,
      };
      const event = {
        active: {
          id: source.cardId!,
          data: { current: {} },
          rect: { current: { initial: null, translated: null } },
        },
        activatorEvent: new Event("pointerdown"),
        over: null,
        delta: { x: 0, y: 0 },
        collisions: null,
      };
      act(() => harness.props?.onDragStart?.(source, event));
      return harness.props?.onDragEnd?.(source, target, event);
    };
    const fieldDrop = encodeTargetId({ type: "zone", zone: "p-field" });

    // Playing Mox opens its rival-target choice and the view leaves "ready".
    act(() => {
      expect(drag(mox, "unit", fieldDrop)).toEqual({ kind: "accepted" });
    });
    const choiceTarget = await waitFor(
      () => {
        const node = view.container.querySelector<HTMLElement>('[data-choice-eligible="true"]');
        expect(node).not.toBeNull();
        return node!;
      },
      { timeout: 5000 },
    );

    // Released mid-window, the Swordwise drop parks — the card stays in hand.
    act(() => {
      expect(drag(huscle, "unit", fieldDrop)).toEqual({ kind: "accepted" });
    });
    expect(
      view.container.querySelector(
        `[data-instance-id="${huscle.dataset.instanceId}"][data-zone="p-hand"]`,
      ),
    ).not.toBeNull();

    // Resolving the choice reopens the play window; the parked drop dispatches.
    fireEvent.click(choiceTarget);
    await waitFor(() => {
      expect(
        view.container.querySelector(
          `[data-instance-id="${huscle.dataset.instanceId}"][data-zone="p-hand"]`,
        ),
      ).toBeNull();
      expect(
        view.container.querySelector(
          `[data-instance-id="${huscle.dataset.instanceId}"][data-zone="p-field"]`,
        ),
      ).not.toBeNull();
    });
  });
});

test("card targets that cannot accept the hand drag fall through to their zone", () => {
  const fieldZoneId = encodeTargetId({ type: "zone", zone: "p-field" });
  const friendlyId = encodeTargetId({
    type: "card",
    zone: "p-field",
    index: 0,
    cardId: "friendly-1",
  });
  const rivalId = encodeTargetId({ type: "card", zone: "opp-field", index: 0, cardId: "rival-1" });
  const collisions = [{ id: fieldZoneId }, { id: friendlyId }, { id: rivalId }];
  const ids = (list: Array<{ id: string | number }>) => list.map((collision) => collision.id);

  const gear: CardDragSource = {
    type: "card",
    zone: "p-hand",
    index: 0,
    cardId: "gear-1",
    cardType: "gear",
  };
  expect(
    ids(filterAcceptableCardTargets(gear, collisions, { gearTargets: new Set(["friendly-1"]) })),
  ).toEqual([fieldZoneId, friendlyId]);
  expect(ids(filterAcceptableCardTargets(gear, collisions, { gearTargets: new Set() }))).toEqual([
    fieldZoneId,
  ]);

  const unit: CardDragSource = {
    type: "card",
    zone: "p-hand",
    index: 1,
    cardId: "unit-1",
    cardType: "unit",
  };
  expect(ids(filterAcceptableCardTargets(unit, collisions, { handPlaysLegal: true }))).toEqual([
    fieldZoneId,
    friendlyId,
  ]);
  expect(ids(filterAcceptableCardTargets(unit, collisions, { handPlaysLegal: false }))).toEqual([
    fieldZoneId,
  ]);

  // Programs keep rival field targets: the drop records a preferred effect target.
  const program: CardDragSource = {
    type: "card",
    zone: "p-hand",
    index: 2,
    cardId: "program-1",
    cardType: "program",
  };
  expect(ids(filterAcceptableCardTargets(program, collisions, { handPlaysLegal: true }))).toEqual([
    fieldZoneId,
    friendlyId,
    rivalId,
  ]);

  // Field-source attack drags and zone targets are never filtered.
  const attacker: CardDragSource = {
    type: "card",
    zone: "p-field",
    index: 0,
    cardId: "attacker-1",
  };
  expect(filterAcceptableCardTargets(attacker, collisions, { handPlaysLegal: false })).toEqual(
    collisions,
  );
});

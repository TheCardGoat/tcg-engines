// @vitest-environment jsdom
import { act, cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import type { PointerDragDropSurfaceProps } from "@tcg/simulator-ui";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import type { CardDragSource } from "../../engine/dropEvent";
import { encodeTargetId, prioritizeDirectAttackCollisions } from "./DragDropContext";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import { getProgramSpatialTargets } from "../../engine/programTargets";
import { CyberpunkTestEngine } from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMantisBlades,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailVStreetkid,
  promoLucynaKushinada,
} from "@tcg/cyberpunk-cards";

vi.mock("../../engine/programTargets", async () => {
  const actual = await vi.importActual<typeof import("../../engine/programTargets")>(
    "../../engine/programTargets",
  );
  return { ...actual, getProgramSpatialTargets: vi.fn(actual.getProgramSpatialTargets) };
});

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

test("a rejected or cancelled drop retains the card; an accepted drop actually plays it", async () => {
  const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
  const card = await waitFor(() => {
    const node = view.container.querySelector<HTMLElement>(
      '[data-zone="p-hand"][data-card-name="Mox Inciters"]',
    );
    expect(node).not.toBeNull();
    return node!;
  });
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
  // The whole board is mounted: target resolution must not scale with its card count.
  expect(getProgramSpatialTargets).toHaveBeenCalledTimes(1);
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
  const gear = await waitFor(() => {
    const node = view.container.querySelector<HTMLElement>(
      '[data-zone="p-hand"][data-card-name="Mantis Blades"]',
    );
    expect(node).not.toBeNull();
    return node!;
  });
  const legend = await waitFor(() => {
    const node = view.container.querySelector<HTMLElement>(
      `[data-zone="p-legendArea"][data-definition-id="${theHeistRetailStarterDeckVCorporateExile.id}"]`,
    );
    expect(node).not.toBeNull();
    return node!;
  });
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

test("a targeted Program drag waits for chosen payment before resolving its target", async () => {
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
  const card = await waitFor(() => {
    const node = view.container.querySelector<HTMLElement>(
      '[data-zone="p-hand"][data-card-name="Floor It"]',
    );
    expect(node).not.toBeNull();
    return node!;
  });
  fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for next cost" }));
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
  expect(getProgramSpatialTargets).toHaveBeenCalledTimes(1);
  act(() => {
    expect(
      harness.props?.onDragEnd?.(
        source,
        encodeTargetId({
          type: "card",
          zone: "opp-field",
          index: Number(target.dataset.zoneIndex),
          cardId: targetId,
        }),
        { ...event, over: null, delta: { x: 0, y: 0 }, collisions: null },
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

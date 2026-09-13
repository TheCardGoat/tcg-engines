// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  CardContextMenuController,
  DefaultSimulatorEntityVisual,
  SimulatorEntityVisualProvider,
  TargetingProvider,
} from "@tcg/simulator-ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { GameCardData, PlayerInfo } from "../types.ts";
import { toSimulatorEntity } from "../card/to-simulator-entity.ts";
import { ResourceAreaRow } from "./ResourceAreaRow.tsx";

const player: PlayerInfo = {
  name: "player_one",
  deck: 30,
  resourceDeck: 9,
  discard: 0,
  shields: 5,
};

const restedResource: GameCardData = {
  id: "resource-rested",
  name: "Resource",
  cardType: "resource",
  exerted: true,
  zoneId: "resourceArea:player_one",
};

beforeEach(() => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: 1440,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    writable: true,
    value: 900,
  });
});

afterEach(cleanup);

describe("ResourceAreaRow target selection", () => {
  it.each([844, 1440])(
    "opens the trash gallery when its card image is clicked at width %i",
    async (width) => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: width === 844 ? 390 : 900,
      });
      const trashCard: GameCardData = {
        id: "trash-unit",
        name: "Trash Unit",
        cardType: "unit",
        zoneId: "trash:player_one",
      };
      const { container } = render(
        <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
          <CardContextMenuController
            entities={[toSimulatorEntity(trashCard)]}
            actionsForEntity={() => []}
            mode="detailed"
            stateVersion={1}
            onModeChange={() => undefined}
            onAction={() => undefined}
          >
            <ResourceAreaRow
              side="bottom"
              player={{ ...player, discard: 1 }}
              resourceArea={[]}
              discard={[trashCard]}
              availableResources={0}
              utilityColumn={null}
            />
          </CardContextMenuController>
        </SimulatorEntityVisualProvider>,
      );
      const image = container.querySelector(
        "[data-sim-zone-id='trash:player_one'] [data-sim-entity-id='trash-unit']",
      );
      expect(image).not.toBeNull();
      fireEvent.click(image!);
      expect(await screen.findByRole("dialog", { name: "TRASH · 1" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Inspect Trash Unit" })).toBeTruthy();
    },
  );

  it.each([390, 1440])(
    "opens the resource gallery when its card image is clicked at width %i",
    async (width) => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: width === 390 ? 844 : 900,
      });
      const resourceCard: GameCardData = {
        id: "resource-unit",
        name: "Resource Card",
        cardType: "resource",
        zoneId: "resourceArea:player_one",
      };
      const { container } = render(
        <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
          <CardContextMenuController
            entities={[toSimulatorEntity(resourceCard)]}
            actionsForEntity={() => []}
            mode="detailed"
            stateVersion={1}
            onModeChange={() => undefined}
            onAction={() => undefined}
          >
            <ResourceAreaRow
              side="bottom"
              player={player}
              resourceArea={[resourceCard]}
              discard={[]}
              availableResources={1}
              utilityColumn={null}
            />
          </CardContextMenuController>
        </SimulatorEntityVisualProvider>,
      );
      const image = container.querySelector(
        "[data-sim-zone-id='resourceArea:player_one'] [data-sim-entity-id='resource-unit']",
      );
      expect(image).not.toBeNull();
      fireEvent.click(image!);
      expect(await screen.findByRole("dialog", { name: "RESOURCE AREA · 1" })).toBeTruthy();
    },
  );

  it.each([390, 1440])("closes and reopens the resource sheet at width %i", (width) => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
    const { container } = render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="bottom"
          player={player}
          resourceArea={[restedResource]}
          discard={[]}
          availableResources={0}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );
    fireEvent(window, new Event("resize"));
    const trigger = container.querySelector("[data-sim-zone-id='resourceArea:player_one']")!;
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "RESOURCE AREA · 1" })).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog", { name: "RESOURCE AREA · 1" })).toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "RESOURCE AREA · 1" })).not.toBeNull();
  });

  it("opens card sheets from the compact public-zone counters", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const trashCard: GameCardData = { id: "trash-card", name: "Trash Card" };
    const resourceCard: GameCardData = { id: "resource-card", name: "Resource Card" };
    const { container } = render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="bottom"
          player={{ ...player, discard: 1 }}
          resourceArea={[resourceCard]}
          discard={[trashCard]}
          availableResources={1}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );
    fireEvent(window, new Event("resize"));

    await waitFor(() =>
      expect(container.querySelector("[data-sim-zone-id='trash:player_one']")?.tagName).toBe(
        "BUTTON",
      ),
    );
    fireEvent.click(container.querySelector("[data-sim-zone-id='trash:player_one']")!);
    expect(screen.getByRole("dialog", { name: "TRASH · 1" }).textContent).toContain("Trash Card");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    fireEvent.click(container.querySelector("[data-sim-zone-id='resourceArea:player_one']")!);
    expect(screen.getByRole("dialog", { name: "RESOURCE AREA · 1" }).textContent).toContain(
      "Resource Card",
    );
    expect(
      (container.querySelector("[data-sim-zone-id='resourceDeck:player_one']") as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(container.querySelector("[data-seat-row='resources']")?.textContent).toContain("1/1");
    expect(container.querySelector("[data-seat-row='resources']")?.textContent).toContain("DECK");
  });

  it("mirrors the combat core around the resource area", () => {
    const renderRow = (side: "top" | "bottom") => (
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side={side}
          player={player}
          resourceArea={[restedResource]}
          discard={[]}
          availableResources={0}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>
    );
    const { container, rerender } = render(renderRow("top"));

    expect(container.querySelector("[data-zone-group='base-and-shields']")?.className).toContain(
      "col-start-3",
    );
    expect(
      container.querySelector("[data-sim-zone-id='resourceArea:player_one']")?.className,
    ).toContain("col-start-2");
    expect(container.querySelector("[data-zone-group='piles']")?.className).toContain(
      "col-start-1",
    );
    expect(screen.getByRole("list", { name: "READY / LEVEL" })).not.toBeNull();
    const piles = container.querySelector("[data-zone-group='piles']")!;
    const resources = container.querySelector("[data-sim-zone-id='resourceArea:player_one']")!;
    const baseAndShields = container.querySelector("[data-zone-group='base-and-shields']")!;
    expect(piles.compareDocumentPosition(resources) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    expect(
      resources.compareDocumentPosition(baseAndShields) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);

    rerender(renderRow("bottom"));
    expect(container.querySelector("[data-zone-group='base-and-shields']")?.className).toContain(
      "col-start-1",
    );
    expect(container.querySelector("[data-zone-group='piles']")?.className).toContain(
      "col-start-3",
    );
  });

  it("uses the mirrored compact grid tracks for the top seat", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const { container, rerender } = render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="top"
          player={player}
          resourceArea={[restedResource]}
          discard={[]}
          availableResources={0}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );
    fireEvent(window, new Event("resize"));

    await waitFor(() =>
      expect(container.querySelector("[data-seat-row='resources']")?.className).toContain(
        "grid-cols-[minmax(76px,.8fr)_minmax(80px,.9fr)_minmax(148px,1.4fr)]",
      ),
    );

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1036 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 101 });
    rerender(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="top"
          player={player}
          resourceArea={[restedResource]}
          discard={[]}
          availableResources={0}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );
    fireEvent(window, new Event("resize"));

    await waitFor(() =>
      expect(container.querySelector("[data-seat-row='resources']")?.className).toContain(
        "grid-cols-[220px_minmax(0,1fr)_228px]",
      ),
    );
  });

  it("keeps wide, short viewports on the desktop compact grid", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1036 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 101 });
    const { container } = render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="bottom"
          player={player}
          resourceArea={[restedResource]}
          discard={[]}
          availableResources={0}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );
    fireEvent(window, new Event("resize"));

    await waitFor(() =>
      expect(container.querySelector("[data-seat-row='resources']")?.className).toContain(
        "grid-cols-[228px_minmax(0,1fr)_220px]",
      ),
    );
    expect(container.querySelector("[data-seat-row='resources']")?.className).not.toContain(
      "grid-cols-[minmax(96px,1fr)_minmax(92px,.9fr)_minmax(108px,1.15fr)]",
    );
  });

  it("dispatches a highlighted Resource and reflects its selected state", () => {
    const onResourceCardClick = vi.fn();
    const { rerender } = render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <TargetingProvider active candidateIds={[restedResource.id!]} role="effectTarget">
          <ResourceAreaRow
            side="bottom"
            player={player}
            resourceArea={[restedResource]}
            discard={[]}
            availableResources={0}
            highlightCardIds={[restedResource.id!]}
            onResourceCardClick={onResourceCardClick}
            utilityColumn={null}
          />
        </TargetingProvider>
      </SimulatorEntityVisualProvider>,
    );

    const candidate = screen.getByRole("button", { name: /Resource/ });
    expect(candidate.dataset.targetingState).toBe("candidate");

    fireEvent.click(candidate);
    expect(onResourceCardClick).toHaveBeenCalledWith(restedResource.id);

    rerender(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <TargetingProvider active candidateIds={[restedResource.id!]} role="effectTarget">
          <ResourceAreaRow
            side="bottom"
            player={player}
            resourceArea={[restedResource]}
            discard={[]}
            availableResources={0}
            selectedCardIds={[restedResource.id!]}
            onResourceCardClick={onResourceCardClick}
            utilityColumn={null}
          />
        </TargetingProvider>
      </SimulatorEntityVisualProvider>,
    );

    expect(screen.getByRole("button", { name: /Resource/ }).dataset.targetingState).toBe(
      "candidate",
    );
    expect(screen.getByRole("button", { name: /Resource/ }).className).toContain(
      "gd-target-selected",
    );
    const resourceDeck = screen.getByLabelText("RESOURCE DECK AREA, 9 cards remaining");
    expect(resourceDeck).not.toBeNull();
    expect(resourceDeck.dataset.simZoneId).toBe("resourceDeck:player_one");
    expect(resourceDeck).toHaveProperty("disabled", true);
  });

  it("uses each Resource's rested state instead of its display position", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const first: GameCardData = { id: "first", name: "Resource", exerted: true };
    const second: GameCardData = { id: "second", name: "Resource", exerted: false };

    render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="bottom"
          player={player}
          resourceArea={[first, second]}
          discard={[]}
          availableResources={1}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );
    fireEvent(window, new Event("resize"));

    await waitFor(() => expect(screen.getByLabelText(/rested resource 1/i)).not.toBeNull());
    expect(screen.getByLabelText(/ready resource 2/i)).not.toBeNull();
  });

  it("keeps the three most recently placed Resources in the desktop preview", () => {
    const resources = Array.from({ length: 6 }, (_, index) => ({
      id: `resource-${index + 1}`,
      name: `Resource ${index + 1}`,
      cardType: "resource" as const,
    }));
    const { container } = render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="bottom"
          player={player}
          resourceArea={resources}
          discard={[]}
          availableResources={6}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );

    const previewedResourceIds = Array.from(
      container.querySelectorAll("[data-sim-zone-id='resourceArea:player_one'] [data-card-id]"),
      (card) => card.getAttribute("data-card-id"),
    );
    expect(previewedResourceIds).toEqual(["resource-4", "resource-5", "resource-6"]);
  });

  it("expands the desktop resource row while Resource targets are visible", () => {
    const { container } = render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <TargetingProvider active candidateIds={[restedResource.id!]} role="effectTarget">
          <ResourceAreaRow
            side="bottom"
            player={player}
            resourceArea={[restedResource]}
            discard={[]}
            availableResources={0}
            highlightCardIds={[restedResource.id!]}
            onResourceCardClick={vi.fn()}
            utilityColumn={null}
          />
        </TargetingProvider>
      </SimulatorEntityVisualProvider>,
    );

    expect(container.querySelector("[data-seat-row='resources']")?.className).toContain(
      "min-h-[96px]",
    );
  });

  it("shows the public removal area only after a card is exiled", () => {
    const exiledCard: GameCardData = {
      id: "exiled-card",
      name: "Removed Unit",
      set: "GD05",
      cardNumber: "GD05-130",
    };
    const { container, rerender } = render(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="bottom"
          player={player}
          resourceArea={[]}
          discard={[]}
          availableResources={0}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );

    expect(container.querySelector("[data-sim-zone-id='removalArea:player_one']")).toBeNull();

    rerender(
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <ResourceAreaRow
          side="bottom"
          player={player}
          resourceArea={[]}
          discard={[]}
          removalArea={[exiledCard]}
          availableResources={0}
          utilityColumn={null}
        />
      </SimulatorEntityVisualProvider>,
    );

    const removalArea = screen.getByRole("button", { name: "REMOVAL AREA, 1 cards" });
    expect(removalArea.dataset.simZoneId).toBe("removalArea:player_one");
    expect(container.querySelector("[data-sim-zone-id='deck:player_one']")?.className).toContain(
      "w-full",
    );
    expect(container.querySelector("[data-sim-zone-id='trash:player_one']")?.className).toContain(
      "w-full",
    );
    fireEvent.click(removalArea);
    expect(screen.getByRole("dialog", { name: "REMOVAL AREA · 1" }).textContent).toContain(
      "Removed Unit",
    );
  });
});

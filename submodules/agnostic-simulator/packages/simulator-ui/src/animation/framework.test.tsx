import type { SimulatorEntity } from "@tcg/simulator-contract";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vite-plus/test";

import { AnimatedEntitySlot } from "./components/AnimatedEntitySlot";
import { SimulatorEntityVisual } from "./components/SimulatorEntityVisual";
import { createAnimationNodeRegistry } from "./lib/node-registry";
import { createSimulatorAnimationScope } from "./provider/createSimulatorAnimationScope";

const entity: SimulatorEntity = {
  id: "card-1",
  title: "Visible identity",
  subtitle: "Unit",
  kind: "unit",
  ownerId: "p1",
  face: "public",
  states: ["ready"],
  imageUrl: "https://cards.invalid/card-1.webp",
  stats: [{ label: "Power", value: "4" }],
  traits: ["Blocker"],
  decorations: [
    {
      id: "shield",
      slot: "top-start",
      ariaLabel: "Blocker",
      content: { kind: "icon", token: "shield" },
    },
  ],
};

describe("game-agnostic animation framework", () => {
  test("board slots and animation visuals invoke the one registered renderer", () => {
    const renderer = vi.fn(({ entity: visualEntity }: { entity: SimulatorEntity }) => (
      <span data-renderer-entity={visualEntity.id}>{visualEntity.title}</span>
    ));
    const Scope = createSimulatorAnimationScope<{ entity: SimulatorEntity }>();
    const markup = renderToStaticMarkup(
      <Scope.Root
        sessionKey="renderer-identity"
        initialState={{ entity }}
        initialVersion={1}
        projection={{
          getEntity: (state) => state.entity,
          getZone: () => null,
        }}
        entityRenderer={renderer}
        viewerSeatId="p1"
        animationSpeed="off"
      >
        <AnimatedEntitySlot entity={entity} density="normal">
          <SimulatorEntityVisual entity={entity} density="normal" />
        </AnimatedEntitySlot>
      </Scope.Root>,
    );

    expect(renderer).toHaveBeenCalledTimes(1);
    expect(markup).toContain('data-renderer-entity="card-1"');
  });

  test("hidden projection strips identifying fields and decorations before rendering", () => {
    const renderer = vi.fn(({ entity: visualEntity }: { entity: SimulatorEntity }) => (
      <span>{JSON.stringify(visualEntity)}</span>
    ));
    const Scope = createSimulatorAnimationScope<{ entity: SimulatorEntity }>();
    const markup = renderToStaticMarkup(
      <Scope.Root
        sessionKey="hidden-projection"
        initialState={{ entity }}
        initialVersion={1}
        projection={{
          getEntity: (state) => state.entity,
          getZone: () => null,
        }}
        entityRenderer={renderer}
        viewerSeatId="p2"
        animationSpeed="off"
      >
        <SimulatorEntityVisual entity={{ ...entity, face: "hidden" }} density="normal" />
      </Scope.Root>,
    );

    const projected = renderer.mock.calls[0]?.[0].entity;
    expect(projected).toMatchObject({
      title: "Hidden card",
      face: "hidden",
      stats: [],
      traits: [],
    });
    expect(projected).not.toHaveProperty("decorations");
    expect(projected).not.toHaveProperty("imageUrl");
    expect(markup).not.toContain("Visible identity");
    expect(markup).not.toContain("Blocker");
  });

  test("forwards transfer presentation to the registered game renderer", () => {
    const renderer = vi.fn(
      ({ presentation }: { presentation?: "default" | "state-change" | "transfer" }) => (
        <span data-presentation={presentation} />
      ),
    );
    const Scope = createSimulatorAnimationScope<{ entity: SimulatorEntity }>();
    const markup = renderToStaticMarkup(
      <Scope.Root
        sessionKey="transfer-presentation"
        initialState={{ entity }}
        initialVersion={1}
        projection={{
          getEntity: (state) => state.entity,
          getZone: () => null,
        }}
        entityRenderer={renderer}
        viewerSeatId="p1"
        animationSpeed="off"
      >
        <SimulatorEntityVisual entity={entity} density="normal" presentation="transfer" />
      </Scope.Root>,
    );

    expect(markup).toContain('data-presentation="transfer"');
    expect(renderer).toHaveBeenCalledWith(
      expect.objectContaining({ presentation: "transfer" }),
      undefined,
    );
  });

  test("provider registries are isolated even for equal entity ids", () => {
    const first = createAnimationNodeRegistry();
    const second = createAnimationNodeRegistry();
    const node = {} as HTMLElement;
    first.register({
      key: "first",
      ref: { kind: "entity", id: "card-1" },
      node,
      presence: "present",
    });

    expect(first.get({ kind: "entity", id: "card-1" })).toHaveLength(1);
    expect(second.get({ kind: "entity", id: "card-1" })).toHaveLength(0);
  });

  test("registry subscribers observe endpoint registration and release", () => {
    const registry = createAnimationNodeRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe(listener);
    const release = registry.register({
      key: "moving-card",
      ref: { kind: "entity", id: "card-1" },
      node: {} as HTMLElement,
      presence: "exiting",
    });

    expect(registry.getVersion()).toBe(1);
    expect(listener).toHaveBeenCalledTimes(1);

    release();
    expect(registry.getVersion()).toBe(2);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });

  test("missing scope fails instead of substituting a generic text visual", () => {
    expect(() =>
      renderToStaticMarkup(<SimulatorEntityVisual entity={entity} density="normal" />),
    ).toThrow("SimulatorEntityVisualProvider or a simulator animation scope");
  });
});

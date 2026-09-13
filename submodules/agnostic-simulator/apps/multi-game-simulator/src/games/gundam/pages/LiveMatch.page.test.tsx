// @vitest-environment jsdom
import { act, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vite-plus/test";
import { asPlayerId } from "@tcg/gundam-engine";
import type { EngineInteractionView } from "@tcg/protocol";

vi.mock("../src/components/containers/CombatIntentOverlayContainer.tsx", () => ({
  CombatIntentOverlayContainer: () => <div data-testid="combat-intent-overlay-container" />,
}));

import { loadMainPhaseDemo } from "../src/game/fixtures/main-phase-demo.ts";
import { createDevRuntime, DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "../src/game/dev-runtime.ts";
import {
  applyLiveProjectionUpdate,
  createLiveProjectionViewerEngine,
} from "../src/engine/live/liveState.ts";
import { asViewerId } from "../src/game/types.ts";
import "../src/test/renderSimulator.tsx";
import { LiveSimulatorShell } from "./LiveMatch.page.tsx";

function priorityPassOnlyView(
  actorId: string,
  passMove: "passBlock" | "passBattleAction" | "passActionStep",
): EngineInteractionView {
  return {
    protocolVersion: 2,
    gameSlug: "gundam",
    actorId,
    stateVersion: 1,
    status: "ready",
    actions: [
      {
        id: passMove,
        requestId: `gundam:1:${passMove}`,
        intent: "pass",
        text: { key: `gundam.move.${passMove}` },
        enabled: true,
        inputs: [],
      },
      {
        id: "concede",
        requestId: "gundam:1:concede",
        intent: "concede",
        text: { key: "gundam.move.concede" },
        enabled: true,
        inputs: [],
      },
    ],
  };
}

describe("LiveSimulatorShell", () => {
  it("mounts the shared Gundam animation surface for live matches", () => {
    const dev = loadMainPhaseDemo();
    const { container } = render(
      <MemoryRouter>
        <LiveSimulatorShell
          runtime={dev.runtime}
          staticResources={dev.staticResources}
          viewerId={dev.p1Id}
          remoteSubmit={() => {}}
          getInteractionView={() => undefined}
          getAnimationPackets={() => []}
          getEngineLogRecords={() => []}
          autoPassEnabled
          ended={null}
        />
      </MemoryRouter>,
    );

    expect(container.querySelector("[data-animation-interaction-boundary]")).toBeTruthy();
    expect(container.querySelector("[data-card-context-controller]")).toBeTruthy();
    expect(container.querySelector("[data-testid='combat-intent-overlay-container']")).toBeTruthy();
  });

  it.each([
    {
      passMove: "passBlock" as const,
      label: "Block Step with no legal Blocker",
    },
    {
      passMove: "passBattleAction" as const,
      label: "battle Action Step with no Action Command or Activate·Action",
    },
    {
      passMove: "passActionStep" as const,
      label: "end-phase Action Step with no Action Command or Activate·Action",
    },
  ])("auto-passes $passMove ($label) once the live preference is ready", async ({ passMove }) => {
    const dev = loadMainPhaseDemo();
    const remoteSubmit = vi.fn();
    const interactionView = priorityPassOnlyView(String(dev.p1Id), passMove);

    render(
      <MemoryRouter>
        <LiveSimulatorShell
          runtime={dev.runtime}
          staticResources={dev.staticResources}
          viewerId={dev.p1Id}
          remoteSubmit={remoteSubmit}
          getInteractionView={() => interactionView}
          getAnimationPackets={() => []}
          getEngineLogRecords={() => []}
          autoPassEnabled
          ended={null}
        />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(remoteSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          actionId: passMove,
          automation: { kind: "no-valid-action" },
        }),
        expect.any(Number),
      );
    });
  });

  it("re-renders the mounted board when a live projection advances", async () => {
    const server = createDevRuntime();
    const projection = server.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });
    const live = createLiveProjectionViewerEngine(projection);
    const { container } = render(
      <MemoryRouter>
        <LiveSimulatorShell
          runtime={live.runtime}
          staticResources={live.staticResources}
          viewerId={asViewerId(live.viewerPlayerId)}
          remoteSubmit={() => {}}
          getInteractionView={() => undefined}
          getAnimationPackets={() => []}
          getEngineLogRecords={() => []}
          autoPassEnabled
          ended={null}
        />
      </MemoryRouter>,
    );
    const mountedBoard = container.querySelector("[data-animation-interaction-boundary]");
    expect(
      container.querySelector("[aria-label='Your match status']")?.getAttribute("data-priority"),
    ).toBe("true");

    await act(async () => {
      applyLiveProjectionUpdate(live.runtime, live.staticResources, {
        ...projection,
        stateID: projection.stateID + 1,
        status: { ...projection.status, activePlayer: asPlayerId(DEV_PLAYER_TWO) },
      });
      await Promise.resolve();
    });

    expect(
      container.querySelector("[aria-label='Your match status']")?.getAttribute("data-priority"),
    ).toBeNull();
    expect(container.querySelector("[data-animation-interaction-boundary]")).toBe(mountedBoard);
  });
});

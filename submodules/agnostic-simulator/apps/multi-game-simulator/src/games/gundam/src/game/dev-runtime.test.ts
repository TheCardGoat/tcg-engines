import { describe, expect, it } from "vite-plus/test";
import {
  asPlayerId,
  createMockResource,
  createMockUnit,
  enumerateAvailableMovesDetailed,
} from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "./dev-runtime.ts";

describe("createDevRuntime", () => {
  it("defaults to the setup segment / choose-first-player phase", () => {
    const { runtime } = createDevRuntime();
    const state = runtime.getState();
    expect(state.ctx.status.gameSegment).toBe("setup");
    expect(state.ctx.status.phase).toBe("choose-first-player");
    expect(state.ctx.status.activePlayer).toBe(DEV_PLAYER_ONE);
  });

  it("returns both runtime and staticResources aligned to the same instances", () => {
    const unit = createMockUnit({ cost: 1 });
    const { runtime, staticResources } = createDevRuntime({
      skipToMainPhase: true,
      p1: { hand: [unit], resourceArea: [createMockResource()], deck: 30 },
      p2: { deck: 30 },
    });
    const moves = enumerateAvailableMovesDetailed(
      runtime.getState(),
      asPlayerId(DEV_PLAYER_ONE),
      staticResources,
    );
    expect(moves.length).toBeGreaterThan(0);
  });

  it("seeds deployUnit candidates from the hand when resources are available", () => {
    const unit = createMockUnit({ cost: 1, level: 1 });
    const { runtime, staticResources } = createDevRuntime({
      skipToMainPhase: true,
      p1: { hand: [unit], resourceArea: [createMockResource()], deck: 30 },
      p2: { deck: 30 },
    });
    const moves = enumerateAvailableMovesDetailed(
      runtime.getState(),
      asPlayerId(DEV_PLAYER_ONE),
      staticResources,
    );
    const deploy = moves.find((m) => m.moveName === "deployUnit");
    expect(deploy).toBeDefined();
    expect(deploy?.selectableCardIds.length).toBe(1);
  });

  it("skipToMainPhase=true lands in main-phase/turnCycle", () => {
    const { runtime } = createDevRuntime({ skipToMainPhase: true });
    const state = runtime.getState();
    expect(state.ctx.status.phase).toBe("main-phase");
    expect(state.ctx.status.gameSegment).toBe("turnCycle");
    expect(state.ctx.status.turnPlayer).toBe(DEV_PLAYER_ONE);
  });

  it("honours initialActivePlayer", () => {
    const { runtime } = createDevRuntime({ initialActivePlayer: DEV_PLAYER_TWO });
    expect(runtime.getState().ctx.status.activePlayer).toBe(DEV_PLAYER_TWO);
  });

  it("places cards into the non-active player's zones", () => {
    const unit = createMockUnit();
    const { runtime } = createDevRuntime({
      p2: { battleArea: [unit], deck: 30 },
      p1: { deck: 30 },
    });
    const zones = runtime.getState().ctx.zones.private.zoneCards;
    const p2Battle = zones[`battleArea:${DEV_PLAYER_TWO}`] ?? [];
    expect(p2Battle.length).toBe(1);
  });

  it("produces a filtered view scoped to the viewer", () => {
    const handUnit = createMockUnit();
    const { runtime } = createDevRuntime({
      p1: { hand: [handUnit], deck: 10 },
      p2: { hand: [createMockUnit()], deck: 10 },
    });

    const p1View = runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });
    const p1Hand = p1View.zones.zones[`hand:${DEV_PLAYER_ONE}`];
    const visibleP1Hand = p1Hand?.cards.filter((c) => c.definition !== null) ?? [];
    expect(visibleP1Hand.length).toBe(1);

    const p2HandFromP1 = p1View.zones.zones[`hand:${DEV_PLAYER_TWO}`];
    const visibleP2Hand = p2HandFromP1?.cards.filter((c) => c.definition !== null) ?? [];
    expect(visibleP2Hand.length).toBe(0);
  });
});

import { describe, expect, it } from "vite-plus/test";
import { firstUnansweredDecision } from "./find-decision.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { findObjectZone } from "../../rules/state-rules-view.ts";
import type { FabActivatedLayer } from "../../rules/layers.ts";

describe("findDecision exhaustive dispatch", () => {
  it("firstUnansweredDecision pauses on an unanswered optional leaf", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 8 }, { hero: dash, deck: 8 });
    const state = game.getState();
    const actorId = game.as(bravo).id;
    const heroId = state.players[actorId]!.heroCardId;
    if (!heroId) throw new Error("missing hero");
    const zone = findObjectZone(state, heroId);
    if (!zone) throw new Error("missing hero zone");
    const source = snapshotObject(state, heroId, actorId, zone.zone);
    const layer: FabActivatedLayer = {
      kind: "activated",
      role: "ability",
      layerId: "layer-1",
      controllerId: actorId,
      source,
      modes: [],
      bindings: {},
      abilityId: "test:optional",
      effect: {
        type: "optional",
        effect: { type: "draw", player: "controller", count: 1 },
      },
      keywords: [],
      targets: {},
      equipDestination: null,
      attackTarget: null,
    };
    const pending = firstUnansweredDecision(state, layer, {}, {}, {}, {});
    expect(pending?.decision.kind).toBe("optional");
    expect(pending?.layer.layerId).toBe("layer-1");
  });

  it("firstUnansweredDecision pauses on an unanswered name-card leaf", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 8 }, { hero: dash, deck: 8 });
    const state = game.getState();
    const actorId = game.as(bravo).id;
    const heroId = state.players[actorId]!.heroCardId;
    if (!heroId) throw new Error("missing hero");
    const zone = findObjectZone(state, heroId);
    if (!zone) throw new Error("missing hero zone");
    const source = snapshotObject(state, heroId, actorId, zone.zone);
    const layer: FabActivatedLayer = {
      kind: "activated",
      role: "ability",
      layerId: "layer-2",
      controllerId: actorId,
      source,
      modes: [],
      bindings: {},
      abilityId: "test:name-card",
      effect: { type: "name-card" },
      keywords: [],
      targets: {},
      equipDestination: null,
      attackTarget: null,
    };
    const pending = firstUnansweredDecision(state, layer, {}, {}, {}, {});
    expect(pending?.decision.kind).toBe("name-card");
    expect(
      pending?.decision.kind === "name-card" ? pending.decision.options.length : 0,
    ).toBeGreaterThan(0);
  });
});

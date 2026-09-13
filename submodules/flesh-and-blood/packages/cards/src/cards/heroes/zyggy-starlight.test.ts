import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { auricShardsRed } from "../instants/auric-shards.ts";
import { zyggyStarlight } from "./zyggy-starlight.ts";

describe("Zyggy Starlight (AZS001) AAA", () => {
  it("happy: destroy Lightning Flow and banish another Lightning aura, then return it with a holo counter", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [lightningFlow, auricShardsRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.activate(zyggyStarlight);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Zyggy.zone("arena")).not.toContain("token:lightning-flow");
    expectFabCard(Zyggy, auricShardsRed).toBeIn("arena");
    expectFabCard(Zyggy, auricShardsRed).toHaveCounters(1, "holo");
  });

  it("boundary: activation is rejected without a Lightning Flow to destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [auricShardsRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(zyggyStarlight).expectActivationRejected(zyggyStarlight);
  });
});

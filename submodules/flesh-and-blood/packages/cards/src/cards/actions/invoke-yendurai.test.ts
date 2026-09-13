import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { invokeYenduraiRed } from "./invoke-yendurai.ts";

const ash = fabToken("ash");

describe("Invoke Yendurai (UPR017) AAA", () => {
  it("happy: transforms an ash into Yendurai and refunds an action point (go again)", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [invokeYenduraiRed],
        arena: [ash],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(invokeYenduraiRed);
    game.passBoth();

    expect(Dromai.zone("arena")).toContain(invokeYenduraiRed.canonicalId);
    expect(Dromai.zone("arena")).not.toContain("token:ash");
    expectFabCard(Dromai, invokeYenduraiRed).toHaveCounters(1, "endurance");
    // 2 - 1 (play) + 1 (go again) = 2.
    expectFabPlayer(Dromai).toHaveAP(2);
  });

  it("boundary: with no ash under your control the Invoke cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [invokeYenduraiRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    expect(() => Dromai.play(invokeYenduraiRed)).toThrow();
    expectFabCard(Dromai, invokeYenduraiRed).toBeIn("hand");
  });

  it("timing: the transformed ash rides under Yendurai — it never reaches a public zone", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [invokeYenduraiRed],
        arena: [ash],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(invokeYenduraiRed);
    game.passBoth();
    game.helpers.untilIdle();

    expect(Dromai.zone("graveyard")).not.toContain("token:ash");
    expect(Dromai.zone("banished")).not.toContain("token:ash");
    expect(Dromai.zone("arena")).toHaveLength(1); // only the flipped Yendurai
  });
});

import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { limpitHopALongYellow } from "./limpit-hop-a-long.ts";
import { cindra } from "../heroes/cindra.ts";
import { huntToTheEndsOfRatheRed } from "./hunt-to-the-ends-of-rathe.ts";
import { displayLoyaltyRed } from "./display-loyalty.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Display Loyalty (CIN010) AAA", () => {
  it("after two Draconic links, creates Fealty when attacking a hero and gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, displayLoyaltyRed],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    expect(game.combat()?.open).toBe(true);
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    expect(game.combat()?.open).toBe(true);

    Cindra.attackWith(displayLoyaltyRed);
    game.passBoth();

    expect(Cindra.zone("arena")).toContain("token:fealty");
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.advanceCombatTo("resolution");
    expect(Cindra.actionPoints()).toBe(1);
  });
  it("before two Draconic links, creates no Fealty and has no conditional go again", () => {
    const game = FabTestEngine.start(
      { hero: cindra, hand: [displayLoyaltyRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(displayLoyaltyRed);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(17);
    expect(Cindra.zone("arena")).not.toContain("token:fealty");
    expect(Cindra.actionPoints()).toBe(0);
  });
  it("after two Draconic links, keeps go again but creates no Fealty when attacking an ally", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, displayLoyaltyRed],
        deck: 6,
      },
      { hero: dash, arena: [limpitHopALongYellow], deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(displayLoyaltyRed, {
      target: Dash.ref(limpitHopALongYellow).instanceId,
    });

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(Cindra.zone("arena")).not.toContain("token:fealty");
    game.helpers.resolveUntilIdle();
  });
});

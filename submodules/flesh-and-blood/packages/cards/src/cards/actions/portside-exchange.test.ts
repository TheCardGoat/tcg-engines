import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { portsideExchangeBlue } from "./portside-exchange.ts";

describe("Portside Exchange (AGB029) AAA", () => {
  it("happy: discarding a yellow card creates a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [portsideExchangeBlue, crackedBaubleYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(portsideExchangeBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: crackedBaubleYellow.canonicalId });

    expectFabCard(Gravy, crackedBaubleYellow).toBeIn("graveyard");
    expect(Gravy.zone("arena")).toContain("token:gold");
    expectFabPlayer(Gravy).toHaveHandCount(1);
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("boundary: discarding a non-yellow card creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [portsideExchangeBlue, snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(portsideExchangeBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expectFabCard(Gravy, snatchRed).toBeIn("graveyard");
    expect(Gravy.zone("arena")).not.toContain("token:gold");
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("timing: go again refunds the action point spent to play the Exchange", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [portsideExchangeBlue, crackedBaubleYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    expect(Gravy.actionPoints()).toBe(1);
    Gravy.play(portsideExchangeBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: crackedBaubleYellow.canonicalId });
    expectFabPlayer(Gravy).toHaveAP(1);
  });
});

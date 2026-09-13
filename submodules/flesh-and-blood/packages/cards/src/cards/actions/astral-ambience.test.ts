import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { astralAmbienceYellow } from "./astral-ambience.ts";
import { prism } from "../heroes/prism.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { nimblismBlue } from "./nimblism.ts";
describe("Astral Ambience preview behavior", () => {
  it("fragmenting against a defending card creates a Spectral Shield", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [astralAmbienceYellow], resourcePoints: 4, deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(prism).playAttack(astralAmbienceYellow);
    game.as(dash).defendWith(nimblismBlue);
    game.toReaction();
    expectFabPlayer(game.as(prism)).toHaveTokenCount("spectral-shield", 1);
  });
  it("an undefended attack creates no Spectral Shield", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [astralAmbienceYellow], resourcePoints: 4, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(prism).playAttack(astralAmbienceYellow);
    game.closeCombat();
    expectFabPlayer(game.as(prism)).toHaveTokenCount("spectral-shield", 0);
  });
  it("tapping a Spectral Shield grants go again to the attacking card", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [astralAmbienceYellow],
        arena: [spectralShield],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(prism);
    player.playAttack(astralAmbienceYellow);
    game.as(dash).defendWith();
    game.toReaction();
    player.activate(astralAmbienceYellow);
    game.untilIdle({ entityTargets: "maximum" });
    expectFabCard(player, spectralShield).toBeTapped();
    game.closeCombat();
    expectFabPlayer(player).toHaveAP(1);
  });
});

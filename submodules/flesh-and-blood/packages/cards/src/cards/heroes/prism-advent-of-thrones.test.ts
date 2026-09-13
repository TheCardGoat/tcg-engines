import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { figmentOfProtectionYellow } from "../instants/figment-of-protection.ts";
import { wartuneHeraldYellow } from "../actions/wartune-herald.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { prismAdventOfThrones } from "./prism-advent-of-thrones.ts";

describe("Prism, Advent of Thrones (DTD002) AAA", () => {
  it("happy: a Herald into soul during the action phase may put a figment into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAdventOfThrones,
        hand: [wartuneHeraldYellow],
        deckTop: [nimblismBlue, figmentOfProtectionYellow],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAdventOfThrones);

    Prism.playAttack(wartuneHeraldYellow);
    game.closeCombat({ optionals: "accept", entityTargets: "pause" });
    Prism.targetRequired(Prism.cardIn("deck", figmentOfProtectionYellow));
    game.untilIdle();

    expectFabCard(Prism, wartuneHeraldYellow).toBeIn("soul");
    expectFabCard(Prism, figmentOfProtectionYellow).toBeIn("arena");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: declining the search leaves the figment in the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAdventOfThrones,
        hand: [wartuneHeraldYellow],
        deckTop: [nimblismBlue, figmentOfProtectionYellow],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAdventOfThrones);

    Prism.playAttack(wartuneHeraldYellow);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Prism, wartuneHeraldYellow).toBeIn("soul");
    expect(Prism.cardsIn("deck", figmentOfProtectionYellow)).toHaveLength(1);
    expect(Prism.zone("arena")).not.toContain(figmentOfProtectionYellow.canonicalId);
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: a non-Herald hit does not search a figment", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAdventOfThrones,
        hand: [brutalAssaultBlue],
        deckTop: [nimblismBlue, figmentOfProtectionYellow],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAdventOfThrones);

    Prism.playAttack(brutalAssaultBlue);
    game.closeCombat({ optionals: "accept" });

    expectFabCard(Prism, brutalAssaultBlue).toBeIn("graveyard");
    expect(Prism.cardsIn("deck", figmentOfProtectionYellow)).toHaveLength(1);
    expect(Prism.zone("arena")).not.toContain(figmentOfProtectionYellow.canonicalId);
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });
});

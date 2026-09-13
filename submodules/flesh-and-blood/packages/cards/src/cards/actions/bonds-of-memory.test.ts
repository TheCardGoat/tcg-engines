import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { bondsOfMemoryRed } from "./bonds-of-memory.ts";

describe("Bonds of Memory (MST115) AAA", () => {
  it("happy: hit banishes the top of their deck and a card from their graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [bondsOfMemoryRed],
        actionPoints: 1,
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        graveyard: [snatchRed],
        deckTop: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.attackWith(bondsOfMemoryRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabPlayer(Uzuri).toHaveLife(20);
  });

  it("boundary: a miss does not banish from deck or graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [bondsOfMemoryRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        graveyard: [snatchRed],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.attackWith(bondsOfMemoryRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("timing: banishing a second card of the same name gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [bondsOfMemoryRed],
        actionPoints: 1,
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        graveyard: [snatchRed],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.attackWith(bondsOfMemoryRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Dash.zone("banished")).toHaveLength(2);
    expectFabPlayer(Uzuri).toHaveLife(21);
  });
});

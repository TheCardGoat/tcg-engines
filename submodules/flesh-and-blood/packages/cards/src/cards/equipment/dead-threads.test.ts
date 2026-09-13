import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { limpitHopALongYellow } from "../actions/limpit-hop-a-long.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { deadThreads } from "./dead-threads.ts";

describe("Dead Threads (SEA080) AAA", () => {
  it("happy: after an ally enters your GY this turn, Instant tap gains {r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: gravyBones,
        chest: [deadThreads],
        arena: [limpitHopALongYellow],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const allyId = Gravy.findCardInZone("arena", limpitHopALongYellow);

    game.as(dash).attackWith(snatchRed, { target: allyId });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Gravy, limpitHopALongYellow).toBeIn("graveyard");
    const outcome = game
      .moveLogs()
      .flatMap((log) => log.public)
      .find(
        (message) =>
          message.key === "flesh-and-blood.combat.hit" ||
          message.key === "flesh-and-blood.combat.miss",
      );
    expect(outcome?.values?.targetName).toBe("Limpit Hop A Long");
    game.helpers.passPriorityTo(Gravy);
    Gravy.activate(deadThreads);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Gravy).toHaveResourceCount(1);
    expectFabCard(Gravy, deadThreads).toBeIn("chest");
    expectFabCard(Gravy, deadThreads).toBeTapped();
  });

  it("boundary: a pre-seeded GY ally does not unlock the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        chest: [deadThreads],
        graveyard: [limpitHopALongYellow],
        resourcePoints: 0,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.expectActivationRejected(deadThreads);
    expectFabCard(Gravy, deadThreads).toBeIn("chest");
  });

  it("timing: Blade Break destroys this after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: gravyBones, life: 20, chest: [deadThreads], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).attackWith(snatchRed);
    Gravy.defendWith(deadThreads);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Gravy, deadThreads).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveLife(17);
  });
});

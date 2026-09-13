import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { sendPackingYellow } from "./send-packing.ts";

describe("Send Packing (HVY012) AAA", () => {
  it("happy: attacking a hero banishes their arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [sendPackingYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.attackWith(sendPackingYellow);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
  });

  it("boundary: if this doesn't hit, the banished arsenal card returns to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [sendPackingYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.attackWith(sendPackingYellow);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expect(
      game
        .getView({ role: "player", actorId: Tuffnut.id })
        .effects.filter((effect) => effect.source.canonicalId === sendPackingYellow.canonicalId),
    ).toHaveLength(0);
  });

  it("timing: its delayed effect ends when the combat chain closes after a hit", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [sendPackingYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(sendPackingYellow);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), nimblismBlue).toBeBanished();
    expect(
      game
        .getView({ role: "player", actorId: Tuffnut.id })
        .effects.filter((effect) => effect.source.canonicalId === sendPackingYellow.canonicalId),
    ).toHaveLength(0);
  });
});

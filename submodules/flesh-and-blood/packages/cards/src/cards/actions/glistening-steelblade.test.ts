import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { glisteningSteelbladeYellow } from "./glistening-steelblade.ts";

/**
 * Glistening Steelblade Yellow (DVR008) — Warrior Action, specialization(Dorinthea).
 *
 * Printed:
 *   Go again
 *   Your next Dawnblade attack this turn has go again.
 *   Whenever Dawnblade hits a hero this turn, put a +1{p} counter on it.
 *
 * AAA trio:
 * - Happy: play (cost 1), then activate Dawnblade → attack has go again.
 * - Boundary: 0 resources → cannot play.
 * - Timing: todo — on-hit +1 power counter requires full combat resolution.
 */

describe("Glistening Steelblade Yellow (DVR008) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: play then Dawnblade attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [glisteningSteelbladeYellow],
        weapon1: [dawnbladeResplendent],
        resourcePoints: 2, // 1 for play + 1 for activation
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    Dori.must.play(glisteningSteelbladeYellow);

    // Card goes to graveyard after resolution.
    expectFabCard(Dori, glisteningSteelbladeYellow).toBeIn("graveyard");

    // Go again keyword means we keep our action point; activate Dawnblade.
    Dori.must.activate(dawnbladeResplendent);

    // The appliesTo.next buff grants go again to the Dawnblade attack.
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: 0 resources — cannot play", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [glisteningSteelbladeYellow],
        weapon1: [dawnbladeResplendent],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    expect(() => Dori.must.play(glisteningSteelbladeYellow)).toThrow();
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: Dawnblade hit puts +1{p} counter on it", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [glisteningSteelbladeYellow],
        weapon1: [dawnbladeResplendent],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.play(glisteningSteelbladeYellow);
    game.untilIdle();
    Dori.activateAttack(dawnbladeResplendent);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dori, dawnbladeResplendent).toHavePower(3);
  });
});

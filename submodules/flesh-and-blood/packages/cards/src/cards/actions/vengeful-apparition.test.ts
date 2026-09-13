import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { solitaryCompanionBlue } from "./solitary-companion.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { hauntingSpecterRed } from "./haunting-specter.ts";
import { vengefulApparitionRed } from "./vengeful-apparition.ts";

/**
 * Vengeful Apparition (Red) (MST155) — Illusionist Action Aura, cost 0, Ward 1.
 *
 * Printed: When this leaves the arena, if you control no Illusionist auras,
 * you may play your next aura with cost 2 or less this turn as though it were
 * an instant. If you do, it enters the arena with a +1{p} counter.
 */

describe("Vengeful Apparition (MST155) AAA", () => {
  it("happy: after Ward destroys this, the next cost-2 aura may be played as an instant", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        arena: [vengefulApparitionRed],
        hand: [hauntingSpecterRed],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(brutalAssaultBlue);
    Enigma.defendWith();
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Enigma, vengefulApparitionRed).toBeIn("graveyard");
    if (Dash.hasPriority()) Dash.pass();
    Enigma.play(hauntingSpecterRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Enigma, hauntingSpecterRed).toBeIn("arena");
    expectFabCard(Enigma, hauntingSpecterRed).toHaveCounters(1);
  });

  it("boundary: a later cost-2 aura does not get the instant permission while this is still in the arena", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        arena: [vengefulApparitionRed],
        hand: [hauntingSpecterRed],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    expectFabCard(Enigma, vengefulApparitionRed).toBeIn("arena");
    if (Dash.hasPriority()) Dash.pass();
    expect(() => Enigma.play(hauntingSpecterRed)).toThrow();
    expectFabCard(Enigma, hauntingSpecterRed).toBeIn("hand");
  });

  it("timing: a cost-0 aura may also be played as an instant and enters with a +1{p} counter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        arena: [vengefulApparitionRed],
        hand: [solitaryCompanionBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(brutalAssaultBlue);
    Enigma.defendWith();
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Enigma, vengefulApparitionRed).toBeIn("graveyard");
    if (Dash.hasPriority()) Dash.pass();
    Enigma.play(solitaryCompanionBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabCard(Enigma, solitaryCompanionBlue).toBeIn("arena");
    expectFabCard(Enigma, solitaryCompanionBlue).toHaveCounters(1);
  });
});

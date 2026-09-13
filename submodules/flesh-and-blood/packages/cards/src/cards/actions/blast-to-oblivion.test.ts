import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dash } from "../heroes/dash.ts";
import { blinkBlue } from "../instants/blink.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { hypothermiaBlue } from "./hypothermia.ts";
import { blastToOblivionRed } from "./blast-to-oblivion.ts";

/**
 * Blast to Oblivion, Red (AUA007) — Lightning Action - Attack, cost 0, 4{p},
 * 2{d}.
 * Printed: "When this attacks, the next time you play an instant card this
 * chain link, you may return target aura permanent with cost 1 or less or
 * target aura token to its owner's hand."
 */

describe("Blast to Oblivion, Red (AUA007) AAA", () => {
  it("happy: the next instant this chain link may return a cost-1-or-less aura", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [blastToOblivionRed, blinkBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [hypothermiaBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);
    const hypothermiaId = Dash.findCardInZone("arena", hypothermiaBlue);

    Oscilio.attackWith(blastToOblivionRed);
    game.advanceCombatTo("reaction");
    Oscilio.must.playInstant(blinkBlue, { targetInstanceId: hypothermiaId });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: hypothermiaBlue.canonicalId,
    });

    expectFabCard(Dash, hypothermiaBlue).toBeIn("hand");
  });

  it("boundary: with no instant this chain link the aura stays in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [blastToOblivionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [hypothermiaBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(blastToOblivionRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), hypothermiaBlue).toBeIn("arena");
  });

  it("timing: an instant after the chain closes no longer qualifies", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [blastToOblivionRed, sigilOfSolaceRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [hypothermiaBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(blastToOblivionRed);
    game.helpers.resolveRestOfCombat();
    Oscilio.must.playInstant(sigilOfSolaceRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(game.as(dash), hypothermiaBlue).toBeIn("arena");
  });
});

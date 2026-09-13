import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { solitaryCompanionBlue } from "./solitary-companion.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { forgedForWarYellow } from "./forged-for-war.ts";
import { channelTheTranquilDomainYellow } from "./channel-the-tranquil-domain.ts";

/**
 * Channel the Tranquil Domain (SUP263) — Earth Action - Aura.
 *
 * Printed: "Go again\nWhen this enters the arena and at the start of your
 * action phase, put another target aura on the obttom [sic] of its owner's
 * deck.\nChannel Earth - At the beginning of your end phase, put a flow
 * counter on this, then destroy it unless you put an Earth card from your
 * pitch zone on the bottom of your deck for each flow counter on it."
 *
 * Rules: CR 5.3.4 move-card to deck bottom; printed "another target aura"
 * must not relocate the Channel itself; Channel upkeep per CR 1.10.4b.
 *
 * Fragment verdicts (plan §5):
 *   RESOLVED — a1 enter-arena relocation of another aura, go again, the a3
 *     Channel Earth escape (flow counter + Earth pitch to deck bottom), the
 *     a3 self-destroy when no Earth is available, and the a2 start-of-action-
 *     phase leg re-firing next turn.
 *   BLOCKED (card-definition defect) — a1/a2 "another target aura": the
 *     module's target filter scans plain `subtypes: ["Aura"]` with no
 *     self-exclusion, so the resolving Channel is itself a legal target and a
 *     lone Channel self-relocates to its owner's deck bottom. Printed
 *     "another" forbids this. Pinned in the boundary test; fix is a module
 *     re-encode (a not-this exclusion).
 */

describe("Channel the Tranquil Domain (SUP263) AAA", () => {
  it("happy: entering the arena moves another aura to the bottom of its owner's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [forgedForWarYellow],
        hand: [channelTheTranquilDomainYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(channelTheTranquilDomainYellow);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: forgedForWarYellow.canonicalId,
    });

    expectFabCard(Bravo, channelTheTranquilDomainYellow).toBeIn("arena");
    // Forged for War (owned by bravo) now sits on the bottom of his deck.
    expect(Bravo.zone("deck")[0]).toBe(forgedForWarYellow.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(forgedForWarYellow.canonicalId);
    // go again refunds the spent action point.
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary (defect pin): with no other aura, the lone Channel relocates itself", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [channelTheTranquilDomainYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(channelTheTranquilDomainYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // PINNED DEFECT (§5): "another target aura" should exclude the Channel
    // itself, but the filter has no self-exclusion — the lone aura answers its
    // own target request and self-relocates to its owner's deck bottom.
    expect(Bravo.zone("deck")[0]).toBe(channelTheTranquilDomainYellow.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(channelTheTranquilDomainYellow.canonicalId);
  });

  it("timing: the start-of-action-phase leg moves another aura again on the next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        // Solitary Companion is inert at action-phase start (upkeep-clean
        // auras like WTR046/UPR218 destroy themselves on the same event and
        // muddy the assertion).
        arena: [channelTheTranquilDomainYellow, solitaryCompanionBlue],
        pitch: [weaveEarthRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    // Turn-1 end phase: flow counter 1, the Earth pitch escapes destruction.
    // The unless-escape offers an optional boolean, so drain with
    // optionalBoolean to accept the Channel Earth payment.
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
    expectFabCard(Bravo, channelTheTranquilDomainYellow).toBeIn("arena");
    expectFabCard(Bravo, channelTheTranquilDomainYellow).toHaveCounters(1, "flow");
    expect(Bravo.zone("deck")[0]).toBe(weaveEarthRed.canonicalId);

    // Dash's end turn rolls into Bravo's turn-2 action phase, where the
    // start-phase leg fires again and asks for another target aura.
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: solitaryCompanionBlue.canonicalId,
      optionalBoolean: true,
      ordering: "listed",
    });
    expect(Bravo.zone("deck")[0]).toBe(solitaryCompanionBlue.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(solitaryCompanionBlue.canonicalId);
  });

  it("timing: no Earth card in pitch at the end phase — the Channel destroys itself", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [channelTheTranquilDomainYellow],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Bravo, channelTheTranquilDomainYellow).toBeIn("graveyard");
    // The flow counter is not retained on the destroyed object (counters
    // clear on the zone move) — pinned so a future counter-preservation
    // change trips this suite deliberately.
    expectFabCard(Bravo, channelTheTranquilDomainYellow).toHaveCounters(0, "flow");
  });
});

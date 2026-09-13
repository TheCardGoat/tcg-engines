import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  expectWait,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { viseraiUsurper } from "./viserai-usurper.ts";
import { viseraiTheForsaken } from "./viserai-the-forsaken.ts";
import { sevenSinNebula } from "../weapons/seven-sin-nebula.ts";
import { demonboundGloombladeRed } from "../actions/demonbound-gloomblade.ts";
import { envelopInDarknessRed } from "../actions/envelop-in-darkness.ts";
import { murmuringGloombladeRed } from "../actions/murmuring-gloomblade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { openTheGateToIArathaelRed } from "../actions/open-the-gate-to-i-arathael.ts";
import { unboundByShadowRed } from "../actions/unbound-by-shadow.ts";
import { PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID } from "../../runtime-registry.ts";

/**
 * Viserai, Usurper (HER106) — Shadow Runeblade Hero — Demon.
 *
 * Printed: "The first attack action card with blood debt you play each turn
 * gets go again. / At the beginning of each end phase, if you've created or
 * activated a Gate to i'Arathael this turn, you may traverse."
 *
 * Signature weapon: Seven Sin Nebula (IAR108).
 */

const opponentHero = dash;
const viseraiForsakenPhysical = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID.get(
  viseraiTheForsaken.canonicalId,
)!;

describe("viserai-usurper (IAR106) AAA", () => {
  it("UST notes: only the first blood-debt attack played each turn gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        hand: [demonboundGloombladeRed],
        banished: [demonboundGloombladeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiUsurper);

    Viserai.playAttack(demonboundGloombladeRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Viserai).toHaveAP(1);

    Viserai.playAttack(demonboundGloombladeRed, { from: "banished" });
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(opponentHero)).toHaveLife(14);
    expectFabPlayer(Viserai).toHaveAP(0);
  });

  it("UST notes: traversing after the first blood-debt attack resolves does not refund an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [envelopInDarknessRed, murmuringGloombladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 3,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);
    const Defender = game.as(opponentHero);

    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    Viserai.playAttack(murmuringGloombladeRed);
    // The first Runechant is consumed by the attack; this is the second
    // Runechant creation event of the turn.
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectFabCard(Viserai, viseraiForsakenPhysical).toHaveName("Viserai, the Forsaken");

    Defender.defendWith();
    game.advanceUntil({ stopAt: "combat-close" });

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2).toHaveAP(0);
    expectFabCard(Viserai, viseraiForsakenPhysical).toHaveName("Viserai, Usurper");
  });

  it("boundary: a non-blood-debt attack does not get go again from the hero", () => {
    const game = FabTestEngine.start(
      { hero: viseraiUsurper, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Viserai = game.as(viseraiUsurper);

    Viserai.playAttack(snatchRed);
    game.passBoth();

    expectCombat(game).toBeOpen().notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
  });

  it("UST notes: creating a Gate this turn offers the optional end-phase traverse", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        hand: [openTheGateToIArathaelRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Viserai = game.as(viseraiUsurper);

    Viserai.play(openTheGateToIArathaelRed);
    game.untilIdle({ optionals: "decline" });
    expectFabToken(game, "gate-to-i-arathael").toHaveCount(1).toBeIn("arena");

    // End phase: the Gate was created this turn — the traverse optional opens.
    Viserai.endTurn();
    expectWait(game).toHaveDecision("boolean");
    Viserai.decline();
    expectFabCard(Viserai, viseraiUsurper).toHaveName("Viserai Usurper");
  });

  it("UST notes: activating a Gate offers traverse, while an inert Gate does not", () => {
    const activated = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        arena: [fabToken("gate-to-i-arathael")],
        banished: [unboundByShadowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = activated.as(viseraiUsurper);

    Viserai.activate(fabToken("gate-to-i-arathael"));
    Viserai.target(unboundByShadowRed);
    activated.untilIdle({ optionals: "accept" });
    Viserai.endTurn();
    activated.passBoth();
    expectWait(activated).toHaveDecision("boolean");
    Viserai.decline();
    expectFabCard(Viserai, viseraiUsurper).toHaveName("Viserai Usurper");

    const inert = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        arena: [fabToken("gate-to-i-arathael")],
        banished: [unboundByShadowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const IdleViserai = inert.as(viseraiUsurper);

    IdleViserai.endTurn();
    inert.untilIdle({ optionals: "decline" });
    expectWait(inert).notToHaveDecision();
    expectFabCard(IdleViserai, viseraiUsurper).toHaveName("Viserai Usurper");
  });

  it("boundary: Seven Sin Nebula requires playing a card from banished this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        weapon1: [sevenSinNebula],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Viserai = game.as(viseraiUsurper);

    Viserai.expectActivationRejected(sevenSinNebula);
  });
});

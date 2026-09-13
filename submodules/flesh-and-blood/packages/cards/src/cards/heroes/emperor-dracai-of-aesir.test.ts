import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { emperorDracaiOfAesir } from "./emperor-dracai-of-aesir.ts";
import { jubeelSpellbane } from "../weapons/jubeel-spellbane.ts";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { snatchRed } from "../actions/snatch.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";

/**
 * Hero behavior acceptance test — Emperor Dracai of Aesir (DYN001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: activated ability searches deck for Command and Conquer,
 *   attacks with it, then shuffles
 * - Core interaction: C&C enters combat from the search
 * - Boundaries: 15hp Young boundary, 3{r} cost, no C&C in deck = optional
 *
 * Signature weapon: Jubeel Spellbane (DYN067)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

describe("emperor-dracai-of-aesir (DYN001)", () => {
  it("boundaries: hero defaults to 15 life (low Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: emperorDracaiOfAesir, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(emperorDracaiOfAesir)).toHaveLife(15);
  });

  it("core mechanic: search deck for Command and Conquer and attack with it", () => {
    // DYN001-a2: Action - {r}{r}{r}: Search deck for C&C, attack with it, shuffle.
    const game = FabTestEngine.start(
      {
        hero: emperorDracaiOfAesir,
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          commandAndConquerRed, // top of deck (last = top)
        ],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Emperor = game.as(emperorDracaiOfAesir);

    // Act — activate hero ability to search + attack with C&C.
    const commandAndConquer = Emperor.cardIn("deck", commandAndConquerRed);
    Emperor.activate(emperorDracaiOfAesir);
    game.passBoth();
    Emperor.chooseTargets(commandAndConquer);
    game.passBoth();

    // C&C should be in combat as an attacking card.
    expectCombat(game).toBeOpen().toHaveAttackPower(6);
  });

  it("core interaction: searched Command and Conquer prevents defense reactions", () => {
    // C&C's resolution ability: defense reactions can't be played this chain link.
    const game = FabTestEngine.start(
      {
        hero: emperorDracaiOfAesir,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, commandAndConquerRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: opponentHero, hand: [unmovableRed], resourcePoints: 3, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Emperor = game.as(emperorDracaiOfAesir);

    const Opponent = game.as(opponentHero);
    const commandAndConquer = Emperor.cardIn("deck", commandAndConquerRed);
    Emperor.activate(emperorDracaiOfAesir);
    game.passBoth();
    Emperor.chooseTargets(commandAndConquer);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(6).toBeAtStep("defend");
    Opponent.defendWith([]);
    Emperor.pass();
    Opponent.pass();
    expectCombat(game).toBeAtStep("reaction");
    Emperor.pass();

    const defenseReaction = Opponent.findCardInZone("hand", unmovableRed);
    expect(
      Opponent.expectFailure({
        move: "begin-play",
        payload: { instanceId: defenseReaction },
      }).errorCode,
    ).toBe("defense_reactions_blocked");
  });

  it("boundaries: insufficient resources make the activation illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: emperorDracaiOfAesir,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, commandAndConquerRed],
        resourcePoints: 2, // Need 3{r}, have only 2
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Emperor = game.as(emperorDracaiOfAesir);

    Emperor.expectActivationRejected(emperorDracaiOfAesir);
  });

  it("signature weapon: Jubeel Spellbane (DYN067) attacks for 1{r} at power 3", () => {
    const game = FabTestEngine.start(
      {
        hero: emperorDracaiOfAesir,
        weapon1: [jubeelSpellbane],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Emperor = game.as(emperorDracaiOfAesir);

    Emperor.activate(jubeelSpellbane);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(3);
  });

  it("signature weapon: Jubeel Spellbane hit creates Spellbane Aegis token", () => {
    const game = FabTestEngine.start(
      {
        hero: emperorDracaiOfAesir,
        weapon1: [jubeelSpellbane],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Emperor = game.as(emperorDracaiOfAesir);

    Emperor.activate(jubeelSpellbane);
    game.passBoth();

    // Resolve combat — no defense, hit lands.
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Spellbane Aegis token created on hit.
    expect(Emperor.zone("arena")).toContain("token:spellbane-aegis");
  });

  it("signature weapon: Jubeel Spellbane cannot attack twice in one turn", () => {
    const game = FabTestEngine.start(
      {
        hero: emperorDracaiOfAesir,
        weapon1: [jubeelSpellbane],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Emperor = game.as(emperorDracaiOfAesir);

    // First attack — hit creates Aegis.
    Emperor.activate(jubeelSpellbane);
    game.passBoth();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expect(Emperor.zone("arena")).toContain("token:spellbane-aegis");

    const aegisCount = Emperor.zone("arena").filter((c) => c === "token:spellbane-aegis").length;

    // Its printed once-per-turn limit prevents a second attack entirely.
    Emperor.expectActivationRejected(jubeelSpellbane);
    expect(Emperor.zone("arena").filter((c) => c === "token:spellbane-aegis")).toHaveLength(
      aegisCount,
    );
  });
});

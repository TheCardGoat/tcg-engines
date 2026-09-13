import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { benjiThePiercingWind } from "./benji-the-piercing-wind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { tigerSwipeRed } from "../actions/tiger-swipe.ts";

/**
 * Hero behavior acceptance test — Benji, the Piercing Wind (CRU047).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: attack action cards with ≤2{p} can't be defended from hand
 * - Core mechanic: first hit each turn buffs next attack +1{p}
 * - Boundaries: >2{p} AAC defendable, third attack unbuffed, 17hp health
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// benji-the-piercing-wind (CRU047) — Ninja/Young — 17hp
// Printed: "Your attack action cards with 2 or less {p} can't be defended by
// cards from hand. The first time an attack action card you control hits each
// turn, your next attack gains +1{p}."
// ---------------------------------------------------------------------------

describe("benji-the-piercing-wind (CRU047)", () => {
  it("boundaries: hero defaults to 17 life (distinct low-health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: benjiThePiercingWind, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(benjiThePiercingWind)).toHaveLife(17);
  });

  it("core mechanic: attack action cards with power ≤ 2 can't be defended by hand cards", () => {
    // Tiger Swipe is a power-2 attack action; opponent holds a hand block.
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [tigerSwipeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Benji = game.as(benjiThePiercingWind);

    // Act — attack to defend step.
    Benji.attackWith(tigerSwipeRed);

    // Assert — hand defense is illegal against ≤2{p} AAC under Benji's continuous.
    expectCombat(game).toBeAtStep("defend");
    expect(game.as(opponentHero).expectBlockRejected([nimblismBlue]).errorCode).toBe(
      "restricted_by_rule",
    );
  });

  it("boundaries: power > 2 attack actions may still be defended from hand", () => {
    // Snatch is power 4 — Benji's ≤2 restriction does not apply.
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Benji = game.as(benjiThePiercingWind);
    const Opponent = game.as(opponentHero);

    Benji.attackWith(snatchRed);
    expectCombat(game).toBeAtStep("defend");

    // Hand block is legal against >2 power; the 2-defend Nimblism holds the
    // 4-power Snatch to 2 damage.
    Opponent.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expect(Opponent.life()).toBe(18);
  });

  it("core mechanic: first hit by own attack action each turn buffs next attack +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);
    const Opponent = game.as(opponentHero);

    const attacks = Benji.cardsIn("hand", snatchRed);

    // First attack hits for base power 4. Trigger fires: next attack gains +1.
    Benji.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(16); // 20 - 4

    // Second attack: base 4 + 1 from Benji's hit-trigger buff = 5.
    Benji.must.playAttack(attacks[1]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(11); // 16 - 5
  });

  it("boundaries: hit-buff applies only to the NEXT attack after the first hit (third unbuffed)", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [snatchRed, snatchRed, snatchRed],
        actionPoints: 3,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);
    const Opponent = game.as(opponentHero);
    const attacks = Benji.cardsIn("hand", snatchRed);

    Benji.must.playAttack(attacks[0]!); // hit → next +1; 20-4=16
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(16);
    Benji.must.playAttack(attacks[1]!); // 16-5=11
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(11);
    Benji.must.playAttack(attacks[2]!); // 11-4=7 (no further buff)
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(7);
  });
});

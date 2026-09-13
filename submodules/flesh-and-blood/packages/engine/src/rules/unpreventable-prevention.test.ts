import { describe, expect, it } from "vitest";
import { FabTestEngine, fabToken } from "../index.ts";
import {
  bravo,
  heartOfFyendal,
  nimblismBlue,
  pummelRed,
  sigilOfSolaceRed,
  snatchRed,
} from "./fixtures.ts";
import { vynnset } from "../../../cards/src/cards/heroes/vynnset.ts";
import { seepingShadowsRed } from "../../../cards/src/cards/actions/seeping-shadows.ts";
import { holoShieldRed } from "../../../cards/src/cards/instants/holo-shield.ts";
import { sigilOfConductivityBlue } from "../../../cards/src/cards/instants/sigil-of-conductivity.ts";
import { nullruneRobe } from "../../../cards/src/cards/equipment/nullrune-robe.ts";
import { mbrioBaseWalkers } from "../../../cards/src/cards/equipment/mbrio-base-walkers.ts";

const LIFE = 20;

function fourHandAndArsenal() {
  return {
    hand: [nimblismBlue, snatchRed, sigilOfSolaceRed, pummelRed],
    arsenal: [heartOfFyendal],
    deck: 8,
  };
}

function startUnpreventableRunechantGame(defender: Record<string, unknown>) {
  return FabTestEngine.start(
    {
      hero: vynnset,
      hand: [seepingShadowsRed, snatchRed, nimblismBlue, sigilOfSolaceRed],
      arsenal: [heartOfFyendal],
      arena: [fabToken("runechant")],
      resourcePoints: 3,
      actionPoints: 2,
      deck: 8,
    },
    { hero: bravo, life: LIFE, resourcePoints: 1, ...fourHandAndArsenal(), ...defender },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

/** Accept Vynnset's life payment and advance until another player choice or idle state. */
function advanceVynnsetTurn(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const state = game.getState();
    if (state.decision) {
      if (state.decision.kind === "boolean") {
        game.as(vynnset).chooseBoolean(true);
        continue;
      }
      return;
    }
    if (!state.combat?.open && state.rulesStack.length === 0) return;
    game.passBoth();
  }
  throw new Error("Unpreventable Runechant scenario did not settle.");
}

function armAndAttack(game: ReturnType<typeof FabTestEngine.start>): void {
  const Vynnset = game.as(vynnset);
  Vynnset.play(seepingShadowsRed);
  advanceVynnsetTurn(game);
  Vynnset.play(snatchRed);
  advanceVynnsetTurn(game);
}

describe("CR 6.4.10h unpreventable damage prevention", () => {
  it("AAA mandatory Ward: real Holo Shield is destroyed but prevents zero unpreventable Runechant damage", () => {
    const game = startUnpreventableRunechantGame({ arena: [holoShieldRed] });
    const Defender = game.as(bravo);

    armAndAttack(game);

    // Ward is mandatory. It applies once, destroys the real aura, and cannot
    // reduce the Runechant damage that Vynnset made unpreventable.
    expect(Defender.zone("graveyard")).toContain(holoShieldRed.canonicalId);
    expect(Defender.life()).toBe(LIFE - 6);
  });

  it("AAA mandatory Arcane Shelter: real Sigil is destroyed while the unpreventable Runechant still deals damage", () => {
    const game = startUnpreventableRunechantGame({ arena: [sigilOfConductivityBlue] });
    const Defender = game.as(bravo);

    armAndAttack(game);

    expect(Defender.zone("graveyard")).toContain(sigilOfConductivityBlue.canonicalId);
    expect(Defender.life()).toBe(LIFE - 6);
  });

  it("AAA optional Arcane Barrier: the player may accept, pays resources, and still takes the full unpreventable damage", () => {
    const game = startUnpreventableRunechantGame({ chest: [nullruneRobe] });
    const Defender = game.as(bravo);

    armAndAttack(game);

    const choice = Defender.expectDecision("option");
    expect(choice.options).toHaveLength(1);
    Defender.chooseOptions(choice.options[0]!.id);

    expect(Defender.resourcePoints()).toBe(0);
    expect(Defender.zone("chest")).toContain(nullruneRobe.canonicalId);
    expect(Defender.life()).toBe(LIFE - 1);
  });

  it("AAA optional Quell: the player may accept, pays, and still schedules the paid equipment for destruction", () => {
    const game = startUnpreventableRunechantGame({ legs: [mbrioBaseWalkers] });
    const Vynnset = game.as(vynnset);
    const Defender = game.as(bravo);

    armAndAttack(game);

    const choice = Defender.expectDecision("option");
    expect(choice.options).toHaveLength(1);
    Defender.chooseOptions(choice.options[0]!.id);
    game.helpers.resolveRestOfCombat();
    Vynnset.endTurn();

    expect(Defender.resourcePoints()).toBe(0);
    expect(Defender.zone("legs")).not.toContain(mbrioBaseWalkers.canonicalId);
    expect(Defender.zone("graveyard")).toContain(mbrioBaseWalkers.canonicalId);
    expect(Defender.life()).toBe(LIFE - 6);
  });
});

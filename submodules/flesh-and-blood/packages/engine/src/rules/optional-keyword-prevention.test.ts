import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import {
  bravo,
  dash,
  heartOfFyendal,
  nimblismBlue,
  pummelRed,
  sigilOfSolaceRed,
  snatchRed,
} from "./fixtures.ts";
import { flashBoltRed } from "../../../cards/src/cards/instants/flash-bolt.ts";
import { volticBoltRed } from "../../../cards/src/cards/actions/voltic-bolt.ts";
import { nullruneRobe } from "../../../cards/src/cards/equipment/nullrune-robe.ts";
import { mbrioBaseWalkers } from "../../../cards/src/cards/equipment/mbrio-base-walkers.ts";
import { maskOfTheSwarmingClaw } from "../../../cards/src/cards/equipment/mask-of-the-swarming-claw.ts";
import { arcaneLantern } from "../../../cards/src/cards/equipment/arcane-lantern.ts";

const LIFE = 20;

function fourHandAndArsenal() {
  return {
    hand: [nimblismBlue, snatchRed, sigilOfSolaceRed, pummelRed],
    arsenal: [heartOfFyendal],
    deck: 8,
  };
}

function startArcanePreventionGame(equipment: {
  readonly chest?: readonly [typeof nullruneRobe];
  readonly legs?: readonly [typeof mbrioBaseWalkers];
}) {
  return FabTestEngine.start(
    {
      hero: bravo,
      resourcePoints: 2,
      hand: [volticBoltRed, nimblismBlue, snatchRed, sigilOfSolaceRed],
      arsenal: [heartOfFyendal],
      deck: 8,
    },
    {
      hero: dash,
      life: LIFE,
      resourcePoints: 1,
      ...fourHandAndArsenal(),
      ...equipment,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

function presentArcanePreventionChoice(game: ReturnType<typeof FabTestEngine.start>) {
  const Bravo = game.as(bravo);
  const Dash = game.as(dash);
  Bravo.play(volticBoltRed, { target: Dash.id });
  game.passBoth();
  return Dash.expectDecision("option");
}

describe("optional static keyword prevention", () => {
  it("AAA Arcane Lantern pays from an off-hand seat and prevents exactly one arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [volticBoltRed, nimblismBlue, snatchRed, sigilOfSolaceRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      {
        hero: dash,
        weapon2: [arcaneLantern],
        resourcePoints: 1,
        ...fourHandAndArsenal(),
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    const choice = presentArcanePreventionChoice(game);
    expect(choice.options).toHaveLength(1);
    Dash.chooseOptions(choice.options[0]!.id);

    expect(Dash.life()).toBe(LIFE - 4);
    expect(Dash.resourcePoints()).toBe(0);
    expect(Dash.zone("weapon2")).toContain(arcaneLantern.canonicalId);
  });

  it("AAA Arcane Barrier decline: four-card hand plus arsenal, decline leaves resources and takes full arcane damage", () => {
    const game = startArcanePreventionGame({ chest: [nullruneRobe] });
    const Dash = game.as(dash);

    const choice = presentArcanePreventionChoice(game);
    expect(choice.options).toHaveLength(1);
    Dash.chooseOptions();

    expect(Dash.life()).toBe(LIFE - 5);
    expect(Dash.resourcePoints()).toBe(1);
    expect(Dash.zone("chest")).toContain(nullruneRobe.canonicalId);
  });

  it("AAA Arcane Barrier accept: four-card hand plus arsenal, pay once and prevent exactly one arcane damage", () => {
    const game = startArcanePreventionGame({ chest: [nullruneRobe] });
    const Dash = game.as(dash);

    const choice = presentArcanePreventionChoice(game);
    Dash.chooseOptions(choice.options[0]!.id);

    expect(Dash.life()).toBe(LIFE - 4);
    expect(Dash.resourcePoints()).toBe(0);
    expect(Dash.zone("chest")).toContain(nullruneRobe.canonicalId);
  });

  it("AAA Quell decline: four-card hand plus arsenal, decline does not spend or schedule destruction", () => {
    const game = startArcanePreventionGame({ legs: [mbrioBaseWalkers] });
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const choice = presentArcanePreventionChoice(game);
    expect(choice.options).toHaveLength(1);
    Dash.chooseOptions();
    Bravo.endTurn();

    expect(Dash.life()).toBe(LIFE - 5);
    expect(Dash.resourcePoints()).toBe(0);
    expect(Dash.zone("legs")).toContain(mbrioBaseWalkers.canonicalId);
  });

  it("AAA Quell accept: four-card hand plus arsenal, pay once, prevent one, then destroy at end phase", () => {
    const game = startArcanePreventionGame({ legs: [mbrioBaseWalkers] });
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const choice = presentArcanePreventionChoice(game);
    Dash.chooseOptions(choice.options[0]!.id);
    Bravo.endTurn();

    expect(Dash.life()).toBe(LIFE - 4);
    expect(Dash.resourcePoints()).toBe(0);
    expect(Dash.zone("legs")).not.toContain(mbrioBaseWalkers.canonicalId);
    expect(Dash.zone("graveyard")).toContain(mbrioBaseWalkers.canonicalId);
  });

  it("AAA Mask of the Swarming Claw exposes Arcane Barrier and live Spellvoid as separate optional candidates", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        head: [maskOfTheSwarmingClaw],
        resourcePoints: 1,
        hand: [snatchRed, nimblismBlue, sigilOfSolaceRed, pummelRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      {
        hero: dash,
        life: LIFE,
        resourcePoints: 2,
        hand: [flashBoltRed, nimblismBlue, snatchRed, sigilOfSolaceRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      game.declareNoDefenseIfPending();
      const priorityPlayerId = game.getPriorityPlayerId();
      if (priorityPlayerId) game.exec({ move: "pass", actorId: priorityPlayerId, payload: {} });
    }
    Dash.play(flashBoltRed, { target: Bravo.id });
    game.passBoth();

    const choice = Bravo.expectDecision("option");
    // Spellvoid X is 1 from the open chain link and Arcane Barrier is 1.
    // The static policy emits both independent optional candidates rather than
    // suppressing the second keyword on the same equipment.
    expect(choice.options).toHaveLength(2);
    // Candidate collection preserves keyword order: Spellvoid then Barrier.
    // Choose only the Barrier to prove the Mask remains equipped.
    Bravo.chooseOptions(choice.options[1]!.id);

    expect(Bravo.life()).toBe(LIFE - 2);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("head")).toContain(maskOfTheSwarmingClaw.canonicalId);
  });
});

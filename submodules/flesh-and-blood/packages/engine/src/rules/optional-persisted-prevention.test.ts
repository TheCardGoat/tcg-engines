import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";
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
import { capOfQuickThinking } from "../../../cards/src/cards/equipment/cap-of-quick-thinking.ts";
import { hyperDriver } from "../../../cards/src/cards/tokens/hyper-driver.ts";
import { mbrioBaseVizier } from "../../../cards/src/cards/equipment/mbrio-base-vizier.ts";
import { solrayPlating } from "../../../cards/src/cards/equipment/solray-plating.ts";

const LIFE = 20;
const manualPriority = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function fourCardsAndArsenal() {
  return {
    hand: [nimblismBlue, snatchRed, sigilOfSolaceRed, pummelRed],
    arsenal: [heartOfFyendal],
    deck: 8,
  } as const;
}

function presentArcaneDamage(
  game: ReturnType<typeof FabTestEngine.start>,
  attacker = game.as(dash),
  defender = game.as(bravo),
) {
  attacker.play(volticBoltRed, { target: defender.id });
  game.passBoth();
  return defender.expectDecision("option");
}

describe("optional persisted prevention costs", () => {
  it("AAA Cap: four-card hand plus arsenal, choose the exact Instant after snapshot restore, discard it once, prevent one, and draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed, nimblismBlue, snatchRed, pummelRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      {
        hero: bravo,
        head: [capOfQuickThinking],
        hand: [sigilOfSolaceRed, flashBoltRed, nimblismBlue, snatchRed],
        arsenal: [heartOfFyendal],
        deck: [pummelRed, pummelRed, pummelRed, pummelRed],
        life: LIFE,
      },
      manualPriority,
    );
    const Dash = game.as(dash);
    let Bravo = game.as(bravo);

    // Act: on the opponent's turn, arm Cap before the opponent's arcane source.
    Dash.pass();
    Bravo.activate(capOfQuickThinking);
    game.passBoth();
    const choice = presentArcaneDamage(game, Dash, Bravo);
    Bravo.chooseOptions(choice.options[0]!.id);
    expect(Bravo.expectDecision("entity-target").continuation).toMatchObject({
      kind: "replacement-cost-target",
    });

    // Persist the unresolved cost prompt, then resume via the public snapshot ingress.
    const state = game.getState();
    const restored = restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    const resumed = FabTestEngine.fromState(restored);
    Bravo = resumed.as(bravo);
    Bravo.chooseTargets(sigilOfSolaceRed);

    // Assert: the chosen Sigil, not the other legal Instant, is paid exactly once.
    expect(Bravo.life()).toBe(LIFE - 4);
    expect(Bravo.zone("graveyard")).toContain(sigilOfSolaceRed.canonicalId);
    expect(Bravo.zone("hand")).toContain(flashBoltRed.canonicalId);
    expect(Bravo.zone("hand")).toHaveLength(4); // discard one, then draw one.
    expect(Bravo.zone("head")).not.toContain(capOfQuickThinking.canonicalId);
  });

  it("AAA Cap decline: four-card hand plus arsenal, decline spends neither an Instant nor a prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed, nimblismBlue, snatchRed, pummelRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      {
        hero: bravo,
        head: [capOfQuickThinking],
        hand: [sigilOfSolaceRed, flashBoltRed, nimblismBlue, snatchRed],
        arsenal: [heartOfFyendal],
        deck: 8,
        life: LIFE,
      },
      manualPriority,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.pass();
    Bravo.activate(capOfQuickThinking);
    game.passBoth();
    presentArcaneDamage(game, Dash, Bravo);
    Bravo.chooseOptions();

    expect(Bravo.life()).toBe(LIFE - 5);
    expect(Bravo.zone("hand")).toEqual(
      expect.arrayContaining([sigilOfSolaceRed.canonicalId, flashBoltRed.canonicalId]),
    );
  });

  it("AAA mBrio: four-card hand plus arsenal, separately accept Arcane Barrier and steam prevention, then choose the exact Hyper Driver", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [volticBoltRed, nimblismBlue, snatchRed, pummelRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      {
        hero: dash,
        head: [mbrioBaseVizier],
        arena: [
          { card: hyperDriver, state: { steamCounters: 1 } },
          { card: hyperDriver, state: { steamCounters: 1 } },
        ],
        resourcePoints: 1,
        ...fourCardsAndArsenal(),
        life: LIFE,
      },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const hyperDrivers = Dash.cardsIn("arena", hyperDriver);
    expect(hyperDrivers).toHaveLength(2);

    const choice = presentArcaneDamage(game, Bravo, Dash);
    expect(choice.options).toHaveLength(2);
    Dash.chooseOptions(...choice.options.map((option) => option.id));
    expect(
      Dash.expectDecision("entity-target").candidates.map((candidate) => candidate.instanceId),
    ).toEqual(expect.arrayContaining(hyperDrivers.map((card) => card.instanceId)));
    Dash.chooseTargets(hyperDrivers[1]!);
    const ordering = Dash.expectDecision("ordering");
    game.answerDecision(Dash.id, {
      kind: "ordering",
      orderedIds: ordering.entries.map((entry) => entry.id),
    });

    expect(Dash.life()).toBe(LIFE - 3);
    expect(Dash.resourcePoints()).toBe(0);
    expect(game.getState().objects[hyperDrivers[0]!.instanceId]?.counters).toContainEqual({
      kind: "named",
      name: "steam",
      count: 1,
    });
    expect(game.getState().objects[hyperDrivers[1]!.instanceId]?.counters).not.toContainEqual({
      kind: "named",
      name: "steam",
      count: 1,
    });
  });

  it("AAA Solray: four-card hand plus arsenal, choose the exact soul card, prevent one, and destroy Solray at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed, nimblismBlue, snatchRed, pummelRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      {
        hero: bravo,
        chest: [solrayPlating],
        soul: [nimblismBlue, sigilOfSolaceRed],
        ...fourCardsAndArsenal(),
        life: LIFE,
      },
      manualPriority,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    const choice = presentArcaneDamage(game, Dash, Bravo);
    Bravo.chooseOptions(choice.options[0]!.id);
    Bravo.chooseTargets(Bravo.cardIn("soul", sigilOfSolaceRed));

    expect(Bravo.life()).toBe(LIFE - 4);
    expect(Bravo.zone("soul")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("soul")).not.toContain(sigilOfSolaceRed.canonicalId);
    expect(Bravo.zone("banished")).toContain(sigilOfSolaceRed.canonicalId);

    Dash.endTurn();
    expect(Bravo.zone("chest")).not.toContain(solrayPlating.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(solrayPlating.canonicalId);
  });

  it("AAA Solray decline: four-card hand plus arsenal, decline keeps soul and equipment while taking full damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed, nimblismBlue, snatchRed, pummelRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      {
        hero: bravo,
        chest: [solrayPlating],
        soul: [nimblismBlue, sigilOfSolaceRed],
        ...fourCardsAndArsenal(),
        life: LIFE,
      },
      manualPriority,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    presentArcaneDamage(game, Dash, Bravo);
    Bravo.chooseOptions();

    expect(Bravo.life()).toBe(LIFE - 5);
    expect(Bravo.zone("soul")).toEqual(
      expect.arrayContaining([nimblismBlue.canonicalId, sigilOfSolaceRed.canonicalId]),
    );
    expect(Bravo.zone("chest")).toContain(solrayPlating.canonicalId);
  });
});

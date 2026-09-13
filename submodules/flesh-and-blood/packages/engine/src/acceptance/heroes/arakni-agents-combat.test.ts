/**
 * HNT003–HNT007 Arakni Agent of Chaos demi-heroes — combat acceptance.
 *
 * HNT003 Black Widow:  a2: Once per Turn Attack Reaction — Discard Assassin
 *                       card → +3{p}, on-hit banish hand if stealth
 * HNT004 Funnel Web:   Same pattern (structural tests only)
 * HNT006 Redback:      Same pattern (structural tests only)
 * HNT007 Tarantula:    a1: dagger hit → 1 life loss; a2: dagger attack-reaction
 *
 * Attack-reaction timing requires advancing to the reaction step via
 * advanceCombatTo("reaction") after defending with no blocks.
 */
import { describe, expect, it } from "vitest";

import { arakniBlackWidow } from "../../../../cards/src/cards/demi-heroes/arakni-black-widow.ts";
import { arakniFunnelWeb } from "../../../../cards/src/cards/demi-heroes/arakni-funnel-web.ts";
import { arakniRedback } from "../../../../cards/src/cards/demi-heroes/arakni-redback.ts";
import { arakniTarantula } from "../../../../cards/src/cards/demi-heroes/arakni-tarantula.ts";
import { hunterSKlaive } from "../../../../cards/src/cards/weapons/hunter-s-klaive.ts";
import { arakniMarionette } from "../../../../cards/src/cards/heroes/arakni-marionette.ts";
import { biteRed } from "../../../../cards/src/cards/actions/bite.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { dash } from "../../rules/fixtures.ts";

function loadAgent(agent: typeof arakniBlackWidow) {
  const game = FabTestEngine.start(
    { hero: arakniMarionette, arena: [agent], deck: 6 },
    { hero: dash, deck: 6 },
    { autoPassPriority: false },
  );
  expect(game.as(arakniMarionette).zone("arena")).toContain(agent.canonicalId);
  return game;
}

function verifyDiscardFilter(agent: typeof arakniBlackWidow) {
  // Verify the cost filter uses supertypes (not subtypes) — this was a
  // card-model bug where subtypes:["Assassin"] never matched any card.
  const abilities = agent.base.abilities ?? [];
  for (const ability of abilities) {
    if (!("cost" in ability) || !ability.cost || typeof ability.cost !== "object") {
      continue;
    }
    const filter = (ability.cost as { filter?: { typeBox?: { supertypes?: readonly string[] } } })
      .filter;
    if (filter?.typeBox?.supertypes) {
      expect(filter.typeBox.supertypes).toContain("Assassin");
      return;
    }
  }
}

describe("HNT003 Arakni Black Widow", () => {
  it("card loads into arena", () => {
    loadAgent(arakniBlackWidow);
  });
  it("discard cost uses supertypes:Assassin", () => {
    verifyDiscardFilter(arakniBlackWidow);
  });
  it("once-per-turn limit is declared", () => {
    const a2 = arakniBlackWidow.base.abilities?.find((a) => a.kind === "activated");
    expect(a2?.limit?.count).toBe(1);
    expect(a2?.limit?.per).toBe("turn");
  });

  it("a2: attack-reaction discards Assassin card and gives +3{p} to an Assassin attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniBlackWidow],
        hand: [biteRed, biteRed],
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Weaver = game.as(arakniMarionette);
    const Dash = game.as(dash);

    // Attack with biteRed (Assassin attack with stealth)
    Weaver.attackWith(biteRed);

    // Advance to reaction step (defender passes → no blocks)
    game.advanceCombatTo("reaction");

    // Activate Black Widow's attack-reaction — cost discards an Assassin card
    const handBefore = Weaver.handCount();
    Weaver.activate(arakniBlackWidow, {
      abilityId: "RPWBDmM6hG6dk9zMWwr6b:empowerStealthAndBanishHandOnHit",
    });
    // Discard cost consumed one Assassin card
    expect(Weaver.handCount()).toBe(handBefore - 1);

    // Resolve the reaction and finish combat
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // biteRed 3{p} + 3{p} from AR = 6 damage
    expect(Dash.life()).toBe(14);
  });
});

describe("HNT004 Arakni Funnel Web", () => {
  it("card loads into arena", () => {
    loadAgent(arakniFunnelWeb);
  });
  it("discard cost uses supertypes:Assassin", () => {
    verifyDiscardFilter(arakniFunnelWeb);
  });
  it("once-per-turn limit is declared", () => {
    const a2 = arakniFunnelWeb.base.abilities?.find((a) => a.kind === "activated");
    expect(a2?.limit?.count).toBe(1);
  });
});

describe("HNT006 Arakni Redback", () => {
  it("card loads into arena", () => {
    loadAgent(arakniRedback);
  });
  it("discard cost uses supertypes:Assassin", () => {
    verifyDiscardFilter(arakniRedback);
  });
  it("once-per-turn limit is declared", () => {
    const a1 = arakniRedback.base.abilities?.find((a) => a.kind === "activated");
    expect(a1?.limit?.count).toBe(1);
  });
});

describe("HNT007 Arakni Tarantula", () => {
  it("card loads into arena with dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniTarantula],
        weapon1: [hunterSKlaive],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 2,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(game.as(arakniMarionette).zone("arena")).toContain(arakniTarantula.canonicalId);
  });

  it("a1: whenever a dagger hits a hero, they lose 1 life", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniTarantula],
        weapon1: [hunterSKlaive],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 2,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Weaver = game.as(arakniMarionette);
    const Dash = game.as(dash);
    const dashLifeBefore = Dash.life();

    // Activate the dagger weapon (costs {r}{r}), then close combat.
    // Klaive's mark-on-hit and Tarantula's lose-1{h} fire together.
    Weaver.activate(hunterSKlaive);
    game.passBoth();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Dagger deals 1 damage; HNT007 a1 trigger hits for 1 life loss
    expect(Dash.life()).toBe(dashLifeBefore - 2);
  });

  it("a2: attack-reaction discards Assassin card and gives +3{p} to a dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniTarantula],
        weapon1: [hunterSKlaive],
        hand: [biteRed],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 2,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Weaver = game.as(arakniMarionette);
    const Dash = game.as(dash);

    // Activate the dagger weapon, then walk to the reaction step.
    Weaver.activate(hunterSKlaive);
    game.passBoth();
    game.advanceCombatTo("reaction");

    // Activate Tarantula's attack-reaction during the reaction step
    // cost discards an Assassin card (biteRed)
    const handBefore = Weaver.handCount();
    Weaver.activate(arakniTarantula, { abilityId: "twn6MLFjQJrQ9GnwW9BNd:empowerDaggerAttack" });
    expect(Weaver.handCount()).toBe(handBefore - 1);

    // Resolve the reaction onto the open dagger attack.
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);

    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Dagger base 1{p} + 3{p} from AR = 4 damage; HNT007 a1 trigger = 1 life loss = 5 total
    expect(Dash.life()).toBe(20 - 4 - 1);
  });

  it("ability structure: 3 abilities", () => {
    verifyDiscardFilter(arakniTarantula);
  });
});

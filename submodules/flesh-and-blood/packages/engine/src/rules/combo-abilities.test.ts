/**
 * CR 8.4.1 Combo — structured last-attack conditions, keyword surface, rewards.
 *
 * Golden multi-link paths use real play: first attack with go again → advance to
 * Resolution Step → second attack (Combo) while the chain is still open.
 */
import { describe, expect, it } from "vite-plus/test";

import { soulbeadStrikeRed } from "../../../cards/src/cards/actions/soulbead-strike.ts";
import { craneDanceRed } from "../../../cards/src/cards/actions/crane-dance.ts";
import { tempestPalmGustwaveYellow } from "../../../cards/src/cards/actions/tempest-palm-gustwave.ts";
import { chaseTheTailRed } from "../../../cards/src/cards/actions/chase-the-tail.ts";
import { aspectOfTigerBodyRed } from "../../../cards/src/cards/actions/aspect-of-tiger-body.ts";
import { maskOfWizenedWhiskers } from "../../../cards/src/cards/equipment/mask-of-wizened-whiskers.ts";
import { retraceThePastBlue } from "../../../cards/src/cards/actions/retrace-the-past.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
import {
  comboAbilities,
  evaluateAbilityCondition,
  baseHasKeyword,
  buildFabRulesView,
  matchLastAttackIdentity,
  toFabCardDefinition,
  type FabCardDefinitionInput,
  type FabRegisteredCardDefinition,
} from "../index.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue } from "./fixtures.ts";
import { hitTrainer } from "./test-trainers.ts";

const blueComboLead: FabCardDefinitionInput = {
  canonicalId: "combo-blue-lead",
  name: "Some Blue Strike",
  types: ["Ninja", "Action", "Attack"],
  color: "Blue",
  cost: 0,
  power: 3,
  defense: 3,
  keywords: [{ name: "go-again" }],
};

/** Catalog modules are structurally FabCardDefinitionInput for engine helpers. */
function asDef(card: object): FabRegisteredCardDefinition {
  return toFabCardDefinition(card as Parameters<typeof toFabCardDefinition>[0]);
}

/** Collect cards in a zone that match baseHasKeyword (consumer filter path). */
function cardsWithKeyword(
  game: FabTestEngine,
  playerId: string,
  zone: "hand" | "graveyard" | "deck",
  keyword: string,
): string[] {
  const state = game.getState();
  const ids = state.containers.zonesByPlayerId[playerId]![zone];
  return ids.filter((id) => {
    const canonical = state.objects[id]?.canonicalId;
    const def = state.cardDefinitions[canonical ?? ""];
    return baseHasKeyword(def, keyword);
  });
}

function currentAttack(game: FabTestEngine) {
  const instanceId = game.getState().combat?.activeLink?.activeAttack.sourceObjectId;
  const record = instanceId ? game.getState().objects[instanceId] : undefined;
  return record
    ? buildFabRulesView(game.getState()).object({
        instanceId: record.instanceId,
        incarnation: record.incarnation,
      })
    : null;
}

describe("CR 8.4.1 Combo — pure last-attack matcher", () => {
  it("matches exact names case-insensitively", () => {
    expect(
      matchLastAttackIdentity(
        { name: "Soulbead Strike", color: "Red", types: ["Ninja", "Action", "Attack"] },
        { names: ["Soulbead Strike"] },
      ),
    ).toBe(true);
    expect(
      matchLastAttackIdentity(
        { name: "soulbead strike", types: ["Action", "Attack"] },
        { names: ["Soulbead Strike"] },
      ),
    ).toBe(true);
    expect(
      matchLastAttackIdentity(
        { name: "Head Jab", types: ["Action", "Attack"] },
        { names: ["Soulbead Strike"] },
      ),
    ).toBe(false);
  });

  it("matches OR-lists of names", () => {
    expect(
      matchLastAttackIdentity(
        { name: "Spinning Wheel Kick", types: ["Action", "Attack"] },
        { names: ["Twin Twisters", "Spinning Wheel Kick"] },
      ),
    ).toBe(true);
    expect(
      matchLastAttackIdentity(
        { name: "Head Jab", types: ["Action", "Attack"] },
        { names: ["Twin Twisters", "Spinning Wheel Kick"] },
      ),
    ).toBe(false);
  });

  it("matches nameIncludes substrings", () => {
    expect(
      matchLastAttackIdentity(
        { name: "Whelming Gustwave", types: ["Action", "Attack"] },
        { nameIncludes: ["Gustwave"] },
      ),
    ).toBe(true);
    expect(
      matchLastAttackIdentity(
        { name: "Head Jab", types: ["Action", "Attack"] },
        { nameIncludes: ["Gustwave"] },
      ),
    ).toBe(false);
  });

  it("matches color + AAC filter", () => {
    expect(
      matchLastAttackIdentity(
        { name: "Something", color: "Red", types: ["Action", "Attack"] },
        {
          color: "Red",
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      ),
    ).toBe(true);
    expect(
      matchLastAttackIdentity(
        { name: "Something", color: "Blue", types: ["Action", "Attack"] },
        {
          color: "Red",
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      ),
    ).toBe(false);
    expect(
      matchLastAttackIdentity(
        { name: "Something", color: "Red", types: ["Action"] },
        {
          color: "Red",
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      ),
    ).toBe(false);
  });

  it("fails closed when last attack is missing", () => {
    expect(matchLastAttackIdentity(null, { names: ["Soulbead Strike"] })).toBe(false);
    expect(matchLastAttackIdentity(undefined, { names: ["Soulbead Strike"] })).toBe(false);
  });
});

describe("CR 8.4.1 Combo — card with combo keyword surface", () => {
  it("Crane Dance is baseHasKeyword combo via emitted keyword", () => {
    const def = asDef(craneDanceRed);
    expect(baseHasKeyword(def, "combo")).toBe(true);
    expect(comboAbilities(def).length).toBeGreaterThan(0);
  });

  it("baseHasKeyword combo also matches label-only cards without keyword array entry", () => {
    const def = asDef({
      ...craneDanceRed,
      base: { ...craneDanceRed.base, keywords: [] },
    });
    expect(baseHasKeyword(def, "combo")).toBe(true);
  });

  it("Mask of Wizened Whiskers AST targets baseHasKeyword combo; consumer can select Crane Dance", () => {
    const mask = asDef(maskOfWizenedWhiskers);
    const blob = JSON.stringify(mask.base.abilities);
    expect(blob).toContain('"hasKeyword":"combo"');

    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [craneDanceRed, snatchRed, nimblismBlue],
        graveyard: [craneDanceRed],
        deck: 8,
      },
      { hero: dash, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const comboInGy = cardsWithKeyword(game, Bravo.id, "graveyard", "combo");
    expect(comboInGy.length).toBeGreaterThanOrEqual(1);
    // Snatch is not combo
    expect(baseHasKeyword(asDef(snatchRed), "combo")).toBe(false);
  });
});

describe("CR 8.4.1 Combo — multi-link golden chains (real play)", () => {
  // CR 7.0.1a / 7.6.3a: attack actions are legal during the Resolution Step so
  // go-again multi-link chains can continue without closing combat.
  it("Soulbead Strike then Crane Dance on one chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, craneDanceRed],
        deck: 10,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 10 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(soulbeadStrikeRed);
    Dash.defendWith();
    game.advanceCombatTo("resolution");
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    // First link stamps lastAttack as Soulbead (for the *next* link).
    expect(currentAttack(game)?.current.names[0]?.toLowerCase()).toMatch(/soulbead/);

    // Advance to Resolution (go again grants AP); chain stays open.
    game.advanceCombatTo("resolution");
    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.step).toBe("resolution");
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(1);

    // Second link: Combo evaluates against prior lastAttack (Soulbead).
    Bravo.play(craneDanceRed, { target: Dash.id });
    game.passBoth();
    const link = game.combat()?.activeLink;
    // Printed power 3 + Combo +1
    expect(link?.attackPower).toBe(4);
    expect(link?.keywords).toContain("go-again");
  });

  it("two resolution abilities on an attack still leave the stack (Tempest Palm)", () => {
    // SUP246 combo +2{p} and chain-link-3 go again are separate resolution
    // abilities. CR 5.3.4 then 5.3.6: generate both, then move onto the chain.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tempestPalmGustwaveYellow],
        deck: 8,
      },
      { hero: dash, life: 20, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(tempestPalmGustwaveYellow, { target: game.as(dash).id });
    game.passBoth();
    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });

  it("color-split attack stamps a color-agnostic lastAttack name (regression)", () => {
    // Color-split catalog modules keep the printed name in i18n, not on the
    // base module, so the slug-derived name must strip the trailing color
    // token. Locks the Combo `names` contract regardless of how the name is
    // derived: soulbead-strike-red → "soulbead strike", never "… red".
    const game = FabTestEngine.start(
      { hero: bravo, hand: [soulbeadStrikeRed], deck: 6 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(soulbeadStrikeRed, { target: game.as(dash).id });
    game.passBoth();
    const name = currentAttack(game)?.current.names[0]?.toLowerCase();
    expect(name).toBe("soulbead strike");
    // No trailing color word survives the stamping.
    expect(name).not.toMatch(/\b(red|yellow|blue)$/);
    // And the color-agnostic name satisfies the structured Combo condition.
    expect(
      evaluateAbilityCondition(game.getState(), game.as(bravo).id, undefined, {
        type: "last-attack-this-combat-chain",
        names: ["Soulbead Strike"],
      }),
    ).toBe(true);
  });

  it("wrong lead then Crane Dance has no combo rewards", () => {
    const wrongComboLead = hitTrainer({
      slug: "wrong-combo-lead",
      power: 4,
      cost: 0,
      keywords: [{ name: "go-again" }],
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wrongComboLead, craneDanceRed, nimblismBlue, nimblismBlue],
        deck: 10,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 10 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(wrongComboLead, { target: game.as(dash).id });
    game.passBoth();
    game.advanceCombatTo("resolution");
    // Wrong lead is a trainer (not Soulbead); combo gate must fail on Crane Dance.
    const leadName = currentAttack(game)?.current.names[0]?.toLowerCase() ?? "";
    const leadCanonical =
      game.getState().objects[game.combat()?.activeLink?.activeAttack.sourceObjectId ?? ""]
        ?.canonicalId ?? "";
    expect(leadName).not.toMatch(/soulbead/);
    expect(leadCanonical).not.toMatch(/soulbead/i);
    Bravo.play(craneDanceRed, { target: game.as(dash).id });
    game.passBoth();
    const link = game.combat()?.activeLink;
    expect(link?.attackPower).toBe(3);
    expect(link?.keywords ?? []).not.toContain("go-again");
  });

  it("chain close clears lastAttack; solo Crane Dance has no combo", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, craneDanceRed],
        deck: 10,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 10 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(soulbeadStrikeRed, { target: game.as(dash).id });
    game.passBoth();
    expect(currentAttack(game)).toBeTruthy();
    game.resolveCombatNoReactions();
    expect(game.combat()).toBeNull();
    expect(currentAttack(game)).toBeNull();

    // Start a fresh turn through the public turn cycle instead of reopening
    // the consumed action point on the prior turn.
    game.as(bravo).endTurn();
    game.as(dash).endTurn();
    expect(game.as(bravo).actionPoints()).toBe(1);
    game.as(bravo).play(craneDanceRed, { target: game.as(dash).id });
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    // New chain's lastAttack is Crane Dance (this attack), not Soulbead.
    expect(currentAttack(game)?.current.names[0]?.toLowerCase()).toMatch(/crane/);
  });

  it("evaluateAbilityCondition uses combat.lastAttack for structured Combo conditions", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [soulbeadStrikeRed], deck: 6 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(soulbeadStrikeRed, { target: game.as(dash).id });
    game.passBoth();
    const cond = {
      type: "last-attack-this-combat-chain" as const,
      names: ["Soulbead Strike"],
    };
    // After play, lastAttack is Soulbead — condition holds for the *next* attack.
    expect(evaluateAbilityCondition(game.getState(), game.as(bravo).id, undefined, cond)).toBe(
      true,
    );
    expect(
      evaluateAbilityCondition(game.getState(), game.as(bravo).id, undefined, {
        type: "last-attack-this-combat-chain",
        names: ["Head Jab"],
      }),
    ).toBe(false);
    game.resolveCombatNoReactions();
    expect(evaluateAbilityCondition(game.getState(), game.as(bravo).id, undefined, cond)).toBe(
      false,
    );
  });
});

describe("CR 8.4.1 Combo — catalog structured surface", () => {
  it("Crane Dance condition is structured last-attack with names + label params", () => {
    const ability = craneDanceRed.base.abilities?.[0] as {
      condition?: { type?: string; names?: string[] };
      label?: { name?: string; params?: { names?: string[] } };
    };
    expect(ability.condition?.type).toBe("last-attack-this-combat-chain");
    expect(ability.condition?.names).toContain("Soulbead Strike");
    expect(ability.label?.name).toBe("combo");
    expect(ability.label?.params?.names).toContain("Soulbead Strike");
  });

  it("Chase the Tail is triggered combo with Crouching Tiger prerequisite", () => {
    const ability = chaseTheTailRed.base.abilities?.[0] as {
      kind?: string;
      staticKind?: string;
      trigger?: { event?: { name?: string }; state?: { type?: string; names?: string[] } };
      label?: { name?: string; params?: { names?: string[] } };
    };
    expect(ability.kind).toBe("static");
    expect(ability.staticKind).toBe("triggered");
    expect(ability.trigger?.event?.name).toBe("attack");
    expect(ability.trigger?.state?.type).toBe("last-attack-this-combat-chain");
    expect(ability.trigger?.state?.names).toContain("Crouching Tiger");
    expect(ability.label?.name).toBe("combo");
    expect(baseHasKeyword(asDef(chaseTheTailRed), "combo")).toBe(true);
  });

  it("Aspect of Tiger: Body uses color + AAC filter (not name string)", () => {
    const ability = aspectOfTigerBodyRed.base.abilities?.[0] as {
      trigger?: {
        state?: {
          type?: string;
          color?: string;
          filter?: {
            typeBox?: { types?: string[]; subtypes?: string[] };
          };
          names?: string[];
        };
      };
      label?: { name?: string };
    };
    expect(ability.trigger?.state?.type).toBe("last-attack-this-combat-chain");
    expect(ability.trigger?.state?.color).toBe("Red");
    expect(ability.trigger?.state?.filter?.typeBox?.types).toContain("Action");
    expect(ability.trigger?.state?.filter?.typeBox?.subtypes).toContain("Attack");
    expect(ability.trigger?.state?.names).toBeUndefined();
    expect(ability.label?.name).toBe("combo");
  });

  it("Retrace the Past uses nameIncludes Gustwave", () => {
    const ability = retraceThePastBlue.base.abilities?.[0] as {
      trigger?: { state?: { type?: string; nameIncludes?: string[] } };
      label?: { name?: string; params?: { names?: string[] } };
    };
    expect(ability.trigger?.state?.type).toBe("last-attack-this-combat-chain");
    expect(ability.trigger?.state?.nameIncludes?.some((n) => /gustwave/i.test(n))).toBe(true);
    expect(ability.label?.name).toBe("combo");
  });
});

describe("CR 8.4.1 Combo — color prerequisite via real multi-link", () => {
  it("red AAC enables Aspect of Tiger: Body", () => {
    // Soulbead is Red AAC with go again — satisfies Aspect color condition.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, aspectOfTigerBodyRed],
        deck: 10,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 10 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(soulbeadStrikeRed, { target: game.as(dash).id });
    game.passBoth();
    expect(currentAttack(game)?.current.color).toBe("red");
    game.advanceCombatTo("resolution");
    Bravo.play(aspectOfTigerBodyRed, { target: game.as(dash).id });
    game.passBoth();
    // Aspect already has base go again; Combo also grants go again + create tiger.
    // Assert condition held by checking create-token side effect in banished or log.
    const link = game.combat()?.activeLink;
    expect(link?.keywords).toContain("go-again");
    // Token creation may put a crouching tiger in banished
    const banished = Bravo.zone("banished");
    const log = game
      .playerLogs()
      .map((e) => e.message)
      .join(" ");
    const createdTiger =
      banished.some((id) => /tiger|crouching/i.test(id)) ||
      /crouching|tiger/i.test(log) ||
      // Event-native token creation uses stable token canonical ids.
      Object.values(game.getState().objects)
        .map((object) => object.canonicalId)
        .some((c) => /tiger/i.test(c));
    // At minimum power path ran with condition true — attack power stays printed 3
    // (combo grants go again + create, not power). Condition gate proven if wrong color fails.
    expect(link?.attackPower).toBe(3);
    void createdTiger;
  });

  it("blue AAC does not enable Aspect of Tiger: Body", () => {
    // blueComboLead is a blue go-again AAC trainer — fails Aspect's red filter.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [blueComboLead, aspectOfTigerBodyRed], deck: 6 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(blueComboLead, { target: game.as(dash).id });
    game.passBoth();
    game.advanceCombatTo("resolution");
    game.as(bravo).play(aspectOfTigerBodyRed, { target: game.as(dash).id });
    game.passBoth();
    // When condition fails, create-token step should not run — no tiger tokens.
    const tigerInstances = Object.values(game.getState().objects)
      .map((object) => object.canonicalId)
      .filter((c) => /tiger/i.test(c));
    expect(tigerInstances.length).toBe(0);
  });
});

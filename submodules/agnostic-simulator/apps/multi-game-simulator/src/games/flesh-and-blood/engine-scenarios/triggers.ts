import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "@tcg/flesh-and-blood-cards/cards/heroes/dorinthea";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dawnblade } from "@tcg/flesh-and-blood-cards/cards/weapons/dawnblade";
import { refractionBolters } from "@tcg/flesh-and-blood-cards/cards/equipment/refraction-bolters";
import { leadWithSpeedRed } from "@tcg/flesh-and-blood-cards/cards/actions/lead-with-speed";
import type {
  FabCardDefinitionInput,
  FabPracticeMatch,
} from "@tcg/flesh-and-blood-engine/simulator";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "./cards";
import { matchFromEngine, createEngine } from "./runtime";
import { placeholderDefinitionBase } from "./synthetic";
import type { FabScenarioCollection } from "./types";

const TRIGGER_TARGET_CARD_DEFINITIONS = {
  "fixture-trigger-target-aura": {
    canonicalId: "fixture-trigger-target-aura",
    name: "Trigger Lab Aura",
    types: ["Action", "Aura"],
    pitch: 1,
    cost: 0,
    defense: 3,
  },
  "fixture-trigger-target-aura-2": {
    canonicalId: "fixture-trigger-target-aura-2",
    name: "Trigger Lab Aura Two",
    types: ["Action", "Aura"],
    pitch: 1,
    cost: 0,
    defense: 3,
  },
} as const;

function triggerDecisionLabDefinition(): FabCardDefinitionInput {
  const base = CATALOG_TEST_DEFINITIONS[catalogIds.snatch];
  if (!base) throw new Error("Missing catalog Snatch in CATALOG_TEST_DEFINITIONS");
  const catalogDefinition = placeholderDefinitionBase(base);
  return {
    ...catalogDefinition,
    canonicalId: "fixture-trigger-decision-snatch",
    name: "Snatch · Trigger Lab",
    base: {
      ...catalogDefinition.base,
      names: ["Snatch · Trigger Lab"],
      abilities: [
        {
          id: "trigger-lab-optional-draw",
          kind: "static",
          staticKind: "triggered",
          text: "When this hits, you may draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: { kind: "player", player: "ability-controller" },
              observes: { kind: "source", selector: "attack" },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          },
        },
        {
          id: "trigger-lab-destroy-aura",
          kind: "static",
          staticKind: "triggered",
          text: "When this hits, destroy target opposing aura.",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: { kind: "player", player: "ability-controller" },
              observes: { kind: "source", selector: "attack" },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "opponent",
                zones: ["permanent"],
                filter: { typeBox: { subtypes: ["Aura"] } },
                count: 1,
              },
            },
          },
        },
      ],
    },
  };
}

function multiTriggerHeroDefinition(): FabCardDefinitionInput {
  return {
    canonicalId: "fixture-multi-trigger-hero",
    name: "Trigger Lab Hero",
    types: ["Brute", "Hero"],
    health: 20,
    intelligence: 4,
    abilities: [
      {
        id: "multi-trigger-hero-hit-draw",
        kind: "static",
        staticKind: "triggered",
        text: "Whenever an attack action card you control hits a hero, draw a card.",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "none" },
            target: { kind: "hero" },
          },
        },
        resolution: {
          kind: "effect",
          effect: { type: "draw", count: 1, player: "controller" },
        },
      },
    ],
  };
}

function multiTriggerHitAttackDefinition(): FabCardDefinitionInput {
  const base = CATALOG_TEST_DEFINITIONS[catalogIds.snatch];
  if (!base) throw new Error("Missing catalog Snatch in CATALOG_TEST_DEFINITIONS");
  const catalogDefinition = placeholderDefinitionBase(base);
  return {
    ...catalogDefinition,
    canonicalId: "fixture-multi-trigger-hit-attack",
    name: "Snatch · Multi-trigger",
    base: {
      ...catalogDefinition.base,
      names: ["Snatch · Multi-trigger"],
      abilities: [
        {
          id: "multi-trigger-attack-destroy-aura",
          kind: "static",
          staticKind: "triggered",
          text: "When this hits, destroy target opposing aura.",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: { kind: "player", player: "ability-controller" },
              observes: { kind: "source", selector: "attack" },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "opponent",
                zones: ["permanent"],
                filter: { typeBox: { subtypes: ["Aura"] } },
                count: 1,
              },
            },
          },
        },
      ],
    },
  };
}

function bootTriggerDecisionLab(): FabPracticeMatch {
  const attack = triggerDecisionLabDefinition();
  const engine = createEngine({
    seed: "fab-scenario-trigger-decision-lab",
    cardDefinitions: {
      [attack.canonicalId]: attack,
      ...TRIGGER_TARGET_CARD_DEFINITIONS,
    },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      hand: [attack.canonicalId],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 0,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      arena: ["fixture-trigger-target-aura", "fixture-trigger-target-aura-2"],
      hand: [],
      deck: 8,
    },
  });
  const attacker = engine.as(catalogIds.rhinar);
  attacker.play(attack.canonicalId, { target: "player-2" });
  engine.passBoth(); // card layer -> attack
  engine.passBoth(); // attack -> defend
  engine.passBoth(); // defend -> reaction
  engine.passBoth(); // reaction -> damage -> simultaneous-trigger ordering decision
  return matchFromEngine(engine, "fab-scenario-trigger-decision-lab");
}

function bootMultipleTriggerOpen(): FabPracticeMatch {
  const hero = multiTriggerHeroDefinition();
  const attack = multiTriggerHitAttackDefinition();
  const engine = createEngine({
    seed: "fab-scenario-multiple-trigger-open",
    cardDefinitions: {
      [hero.canonicalId]: hero,
      [attack.canonicalId]: attack,
      "fixture-trigger-target-aura": TRIGGER_TARGET_CARD_DEFINITIONS["fixture-trigger-target-aura"],
    },
    player1: {
      heroCardId: hero.canonicalId,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      hand: [attack.canonicalId],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 0,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      arena: ["fixture-trigger-target-aura"],
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-multiple-trigger-open");
}

export const TRIGGERS_SCENARIOS = {
  "dorinthea-bolters": {
    id: "dorinthea-bolters",
    label: "Dorinthea · separate weapon hit triggers",
    description:
      "Play Lead with Speed and attack with Dawnblade, then resolve Dorinthea and Refraction Bolters independently.",
    group: "multiple-triggers",
    tags: ["engine", "trigger", "optional", "animation"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: () =>
      matchFromEngine(
        FabTestEngine.start(
          {
            hero: dorinthea,
            weapon1: [dawnblade],
            legs: [refractionBolters],
            hand: [leadWithSpeedRed],
            deck: 8,
            resourcePoints: 3,
          },
          { hero: bravo, hand: [], deck: 8 },
          { autoPassPriority: false },
        ),
        "fab-dorinthea-bolters",
      ),
  },
  "trigger-decision-lab": {
    id: "trigger-decision-lab",
    label: "Simultaneous triggers · ordering + target + optional",
    description:
      "Snapshot at the moment a single hit produced two simultaneous triggers on one attack. Order them, declare the opposing Aura target, then resolve the optional draw.",
    group: "multiple-triggers",
    tags: ["engine", "trigger", "simultaneous", "ordering", "target", "optional"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootTriggerDecisionLab,
  },
  "multiple-trigger-open": {
    id: "multiple-trigger-open",
    label: "Multiple triggers · reach by attacking",
    description:
      "Two sources trigger on one hit — the hero's 'whenever an attack action card you control hits' and the attack's 'when this hits'. Play the attack, walk the chain, and order the two triggers (draw vs destroy-aura).",
    group: "multiple-triggers",
    tags: ["engine", "trigger", "simultaneous", "ordering", "multi-source", "hit"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootMultipleTriggerOpen,
  },
} satisfies FabScenarioCollection;

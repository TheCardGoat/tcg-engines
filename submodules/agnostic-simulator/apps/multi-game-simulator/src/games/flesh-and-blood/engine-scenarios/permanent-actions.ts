import { aetherSinkYellow as aetherSinkRules } from "@tcg/flesh-and-blood-cards/cards/actions/aether-sink";
import { chowderHeartyCookYellow as chowderRules } from "@tcg/flesh-and-blood-cards/cards/actions/chowder-hearty-cook";
import { energyPotionBlue as energyPotionRules } from "@tcg/flesh-and-blood-cards/cards/actions/energy-potion";
import { microProcessorBlue as microProcessorRules } from "@tcg/flesh-and-blood-cards/cards/actions/micro-processor";
import { nimblismBlue as nimblismRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { restlessLooterRed as restlessLooterRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-looter";
import { restlessPlowmanRed as restlessPlowmanRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-plowman";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { gold as goldRules } from "@tcg/flesh-and-blood-cards/cards/tokens/gold";
import { ursurTheSoulReaper as ursurRules } from "@tcg/flesh-and-blood-cards/cards/tokens/ursur-the-soul-reaper";
import { voxNecropolis as voxNecropolisRules } from "@tcg/flesh-and-blood-cards/cards/weapons/vox-necropolis";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";

import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

const aetherSink = previewCard(aetherSinkRules);
const chowder = previewCard(chowderRules);
const dash = previewCard(dashRules);
const energyPotion = previewCard(energyPotionRules);
const gold = previewCard(goldRules);
const malice = previewCard(maliceRules);
const microProcessor = previewCard(microProcessorRules);
const nimblism = previewCard(nimblismRules);
const restlessLooter = previewCard(restlessLooterRules);
const restlessPlowman = previewCard(restlessPlowmanRules);
const ursur = previewCard(ursurRules);
const voxNecropolis = previewCard(voxNecropolisRules);

function bootAllyPermanentActions() {
  const engine = FabTestEngine.start(
    {
      hero: malice,
      weapon1: [voxNecropolis],
      life: 18,
      arena: [restlessLooter, chowder, restlessPlowman, ursur],
      hand: [nimblism],
      deck: 8,
      actionPoints: 2,
      resourcePoints: 2,
    },
    { hero: dash, hand: [], deck: 8 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  return matchFromEngine(engine, "fab-scenario-permanent-actions-allies");
}

function bootItemAndTokenPermanentActions() {
  const engine = FabTestEngine.start(
    {
      hero: dash,
      arena: [
        microProcessor,
        { card: aetherSink, state: { steamCounters: 1 } },
        gold,
        energyPotion,
      ],
      hand: [nimblism],
      deck: 8,
      actionPoints: 2,
      resourcePoints: 3,
    },
    { hero: malice, hand: [], deck: 8 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  return matchFromEngine(engine, "fab-scenario-permanent-actions-items-and-tokens");
}

/**
 * Compact browser labs for card-context action QA. Each board intentionally
 * combines several real permanents so one pass covers single-action,
 * multi-action, attack, Instant, item, ally, and token projections.
 */
export const PERMANENT_ACTION_SCENARIOS = {
  "permanent-actions-allies": {
    id: "permanent-actions-allies",
    label: "Permanent actions · allies",
    description:
      "Click Restless Looter, Chowder, Restless Plowman, and Ursur to compare ordinary ally attacks, additional activated abilities, automatic keywords, and token attacks.",
    group: "opening",
    tags: ["engine", "permanent", "ally", "token", "attack", "instant", "action-menu"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootAllyPermanentActions,
  },
  "permanent-actions-items-and-tokens": {
    id: "permanent-actions-items-and-tokens",
    label: "Permanent actions · items and tokens",
    description:
      "Click Micro-processor, Aether Sink, Gold, and Energy Potion to compare multiple same-type actions, Action/Instant choices, and token item actions.",
    group: "opening",
    tags: ["engine", "permanent", "item", "token", "instant", "multi-action", "action-menu"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootItemAndTokenPermanentActions,
  },
} satisfies FabScenarioCollection;

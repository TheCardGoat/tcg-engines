import { type FabResolutionAbility, type FabTarget } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import type { RulesOnlyAbility } from "../../authoring/card.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/construct-nitro-mechanoid.generated.ts";

const equipmentZones = {
  Head: "equipment-head",
  Chest: "equipment-chest",
  Arms: "equipment-arms",
  Legs: "equipment-legs",
} as const;

const equipmentTarget = (subtype: keyof typeof equipmentZones): FabTarget => ({
  selector: "object",
  declared: "on-stack",
  player: "controller",
  zones: [equipmentZones[subtype]],
  filter: {
    typeBox: {
      supertypes: ["Mechanologist"],
      subtypes: [subtype],
    },
  },
  count: 1,
});

const constructNitroResolution = {
  kind: "resolution",
  layerKeywords: [goAgain],
  effect: {
    type: "transform-into-resolving-card",
    target: equipmentTarget("Head"),
    additionalTargets: [
      equipmentTarget("Chest"),
      equipmentTarget("Arms"),
      equipmentTarget("Legs"),
      {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["weapon"],
        filter: {
          typeBox: {
            supertypes: ["Mechanologist"],
            types: ["Weapon"],
          },
        },
        count: 1,
      },
      {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["permanent"],
        filter: { name: "Hyper Driver" },
        count: 3,
      },
    ],
    onIncomplete: "negate-resolving-card",
  },
  label: { name: "transform" },
} satisfies RulesOnlyAbility<FabResolutionAbility>;

export const constructNitroMechanoid = definePitchFamily(
  fabPitchFamilies["construct-nitro-mechanoid"],
  {
    keywords: [goAgain],
    abilities: () => ({
      transformComponents: constructNitroResolution,
    }),
  },
);
export const { yellow: constructNitroMechanoidYellow } = constructNitroMechanoid.cards;

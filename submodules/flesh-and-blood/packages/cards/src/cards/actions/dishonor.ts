import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dishonor.generated.ts";

import { comboStatic } from "@tcg/flesh-and-blood-types";

import { combo } from "../shared/keywords.ts";

export const dishonor = definePitchFamily(fabPitchFamilies["dishonor"], {
  keywords: [combo],
  abilities: () => ({
    bondsOfAncestryCombo: comboStatic({
      names: ["Bonds Of Ancestry"],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    }),
    whenHitsHeroIfControlSurgingStrikeDescendentGustwave: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "and",
          conditions: [
            {
              type: "control-object",
              zones: ["combat-chain", "permanent"],
              filter: { name: "Surging Strike" },
            },
            {
              type: "control-object",
              zones: ["combat-chain", "permanent"],
              filter: { name: "Descendent Gustwave" },
            },
            {
              type: "control-object",
              zones: ["combat-chain", "permanent"],
              filter: { name: "Bonds of Ancestry" },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-property",
          property: {
            kind: "abilities",
          },
          target: {
            selector: "attack-target",
          },
          duration: "permanent",
        },
      },
    },
  }),
});
export const { blue: dishonorBlue } = dishonor.cards;

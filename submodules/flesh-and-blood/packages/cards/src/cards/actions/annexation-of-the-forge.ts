import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/annexation-of-the-forge.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

export const annexationOfTheForge = definePitchFamily(fabPitchFamilies["annexation-of-the-forge"], {
  abilities: () => ({
    crushEquipGuardianEquipment: crushAbility({
      effect: {
        type: "equip",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["permanent"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
          count: 1,
        },
      },
      observes: {
        kind: "event-object",
        selector: "damage-source",
        relationship: {
          kind: "any",
        },
        filter: {
          typeBox: {
            supertypes: ["Guardian"],
          },
        },
      },
    }),
  }),
});
export const { yellow: annexationOfTheForgeYellow } = annexationOfTheForge.cards;

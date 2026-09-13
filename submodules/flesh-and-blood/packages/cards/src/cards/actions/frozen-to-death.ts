import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/frozen-to-death.generated.ts";

export const frozenToDeath = definePitchFamily(fabPitchFamilies["frozen-to-death"], {
  keywords: [fusion("Ice")],
  abilities: () => ({
    ifWasFusedMayDestroyEquipment1Counter: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "optional",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
              hasCounter: "-1{d}",
            },
            count: 1,
          },
        },
      },
    },
    mayCreateFrostbiteTokenExposedHeadChestArmsLegs: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "create-token",
          token: "frostbite",
          controller: "opponent",
          amongExposed: ["equipment-head", "equipment-chest", "equipment-arms", "equipment-legs"],
        },
      },
    },
  }),
});
export const { blue: frozenToDeathBlue } = frozenToDeath.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wailer-humperdinck.generated.ts";
import { wateryGrave } from "../shared/keywords.ts";

export const wailerHumperdinck = definePitchFamily(fabPitchFamilies["wailer-humperdinck"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionResourceResourceResourceResourceResourceResourceTAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 6,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  }),
});

export const { yellow: wailerHumperdinckYellow } = wailerHumperdinck.cards;

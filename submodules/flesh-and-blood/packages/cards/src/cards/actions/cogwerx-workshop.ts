import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cogwerx-workshop.generated.ts";

export const cogwerxWorkshop = definePitchFamily(fabPitchFamilies["cogwerx-workshop"], {
  abilities: () => ({
    createGoldenCogToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "golden-cog",
        controller: "controller",
      },
    },
    putSteamCounterUp2CogsControl: {
      kind: "resolution",
      effect: {
        type: "add-counter",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Cog"],
            },
          },
          count: { type: "up-to", amount: 2 },
        },
      },
    },
  }),
});
export const { blue: cogwerxWorkshopBlue } = cogwerxWorkshop.cards;

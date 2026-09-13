import { goAgain, legendary, wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/onyx-amulet.generated.ts";

export const onyxAmulet = definePitchFamily(fabPitchFamilies["onyx-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    actionDestroyTapAllAlliesGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "tap",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["hero", "permanent"],
          filter: {
            or: [
              {
                typeBox: {
                  types: ["Hero"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
            ],
          },
          count: {
            type: "all",
          },
        },
      },
    },
  }),
});

export const { blue: onyxAmuletBlue } = onyxAmulet.cards;

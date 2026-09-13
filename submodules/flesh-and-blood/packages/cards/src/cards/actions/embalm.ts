import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/embalm.generated.ts";

import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const embalm = definePitchFamily(fabPitchFamilies["embalm"], {
  keywords: [goAgain, bloodDebt],
  abilities: () => ({
    mayPlayFromBanishedZoneIfDoGetsGo: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
        then: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
    putAttackActionBloodDebtFromGraveyardBottomDeck: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["graveyard"],
          filter: {
            and: [
              {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              {
                typeBox: {
                  types: ["Action"],
                },
              },
              {
                hasKeyword: "blood-debt",
              },
            ],
          },
          count: 1,
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
    },
  }),
});
export const { yellow: embalmYellow } = embalm.cards;

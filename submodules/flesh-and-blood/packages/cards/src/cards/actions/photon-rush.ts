import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/photon-rush.generated.ts";

export const photonRush = definePitchFamily(fabPitchFamilies["photon-rush"], {
  parameters: {
    blue: {
      playedLightningTurnGetsGoAgain: {
        kind: "resolution",
        condition: {
          type: "played-this",
          per: "turn",
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        effect: {
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
        label: {
          name: "lightning-flow",
        },
      },
    },
    red: {
      playedLightningTurnGetsGoAgain: {
        kind: "resolution",
        condition: {
          type: "played-this",
          per: "turn",
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        effect: {
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
        label: {
          name: "lightning-flow",
        },
      },
    },
  },
  abilities: (abilities) => abilities,
});

export const { blue: photonRushBlue, red: photonRushRed } = photonRush.cards;

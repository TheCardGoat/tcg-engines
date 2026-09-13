import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/glint-the-quicksilver.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const glintTheQuicksilver = definePitchFamily(fabPitchFamilies["glint-the-quicksilver"], {
  abilities: () => ({
    grantGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: { types: ["Weapon"] },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    drawAfterHandDefense: {
      kind: "resolution",
      condition: {
        type: "defended-this-chain-link",
        from: "hand",
      },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
      label: {
        name: "reprise",
      },
    },
  }),
});

export const { blue: glintTheQuicksilverBlue } = glintTheQuicksilver.cards;

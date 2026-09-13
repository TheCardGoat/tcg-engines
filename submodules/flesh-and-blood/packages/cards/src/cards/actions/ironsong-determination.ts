import { dominate, goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ironsong-determination.generated.ts";

export const ironsongDetermination = definePitchFamily(fabPitchFamilies["ironsong-determination"], {
  keywords: [goAgain],
  abilities: () => ({
    targetWeaponsAttacksGet1PowerDominateEndTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            appliesTo: {
              attacksOf: true,
              next: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: { type: "all" },
              events: ["attack"],
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: ironsongDeterminationYellow } = ironsongDetermination.cards;

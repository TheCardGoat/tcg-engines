import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/tarantula-toxin.generated.ts";

export const tarantulaToxin = definePitchFamily(fabPitchFamilies["tarantula-toxin"], {
  abilities: () => ({
    chooseDaggerOrDefenseMode: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "up-to",
          amount: 2,
        },
      },
      modes: {
        boostDagger: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
        reduceDefenderDefense: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "defense",
            op: "subtract",
            amount: 3,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                defending: true,
                defendingAgainst: {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                  hasKeyword: "stealth",
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
      },
    }),
  }),
});

export const { red: tarantulaToxinRed } = tarantulaToxin.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/donkey.generated.ts";

export const donkey = definePitchFamily(fabPitchFamilies["donkey"], {
  abilities: () => ({
    wagerArsenal: {
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
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "wager",
            attacker: { selector: "this-attack" },
            prize: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "winner",
                zones: ["arsenal"],
                count: 1,
              },
            },
          },
        ],
        outputBinding: "it",
      },
    },
  }),
});

export const { blue: donkeyBlue } = donkey.cards;

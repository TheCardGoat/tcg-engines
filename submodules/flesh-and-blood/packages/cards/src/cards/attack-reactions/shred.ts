import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/shred.generated.ts";

export const shred = definePitchFamily(fabPitchFamilies.shred, {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount) => ({
    defendingCard: {
      type: "modify-numeric",
      property: "defense",
      op: "subtract",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: { defending: true, defendingAgainst: { typeBox: { supertypes: ["Assassin"] } } },
        count: 1,
      },
      duration: "this-combat-chain",
      outputBinding: "it",
    },
  }),
});
export const { red: shredRed, yellow: shredYellow, blue: shredBlue } = shred.cards;

import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/diced.generated.ts";

export const diced = definePitchFamily(fabPitchFamilies.diced, {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    daggerBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 1,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: { typeBox: { subtypes: ["Dagger"] } },
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
    nextDaggerBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: { selector: "this-attack" },
      duration: "this-turn",
      appliesTo: { next: { typeBox: { subtypes: ["Dagger"] } } },
    },
  }),
});

export const { red: dicedRed, yellow: dicedYellow, blue: dicedBlue } = diced.cards;

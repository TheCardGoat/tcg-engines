import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/incision.generated.ts";

export const incision = definePitchFamily(fabPitchFamilies.incision, {
  supertypeSets: [["Assassin"], ["Warrior"]],
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    daggerBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
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
  }),
});
export const { red: incisionRed, yellow: incisionYellow, blue: incisionBlue } = incision.cards;

import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/resounding-courage.generated.ts";

export const resoundingCourage = definePitchFamily(fabPitchFamilies["resounding-courage"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    lightWarriorBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: {
          and: [{ typeBox: { supertypes: ["Light"] } }, { typeBox: { supertypes: ["Warrior"] } }],
        },
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
    createCourage: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
      effect: { type: "create-token", token: "courage", controller: "controller" },
    },
  }),
});
export const {
  red: resoundingCourageRed,
  yellow: resoundingCourageYellow,
  blue: resoundingCourageBlue,
} = resoundingCourage.cards;

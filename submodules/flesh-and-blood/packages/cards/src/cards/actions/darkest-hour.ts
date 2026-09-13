import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/darkest-hour.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const darkestHour = definePitchFamily(fabPitchFamilies["darkest-hour"], {
  keywords: [bloodDebt, goAgain],
  parameters: { red: 4, yellow: 3, blue: 1 },
  abilities: (amount) => ({
    alternate: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: { class: "effect", type: "move-to-deck", from: "hand", position: "top", count: 1 },
      },
    },
    power: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: { selector: "this-attack" },
      duration: "this-turn",
      appliesTo: { next: { typeBox: { supertypes: ["Shadow"], subtypes: ["Attack"] } } },
    },
  }),
});
export const {
  red: darkestHourRed,
  yellow: darkestHourYellow,
  blue: darkestHourBlue,
} = darkestHour.cards;

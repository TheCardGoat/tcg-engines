import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/reinforce-the-line.generated.ts";

export const reinforceTheLine = definePitchFamily(fabPitchFamilies["reinforce-the-line"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount) => ({
    reinforce: {
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({ defending: true }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});

export const {
  red: reinforceTheLineRed,
  yellow: reinforceTheLineYellow,
  blue: reinforceTheLineBlue,
} = reinforceTheLine.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-looter.generated.ts";
import { decay } from "../shared/keywords.ts";

export const restlessLooter = definePitchFamily(fabPitchFamilies["restless-looter"], {
  keywords: [decay],
  abilities: () => ({
    discardThenDraw: {
      kind: "activated",
      abilityType: "instant",
      cost: { class: "effect", type: "tap-self" },
      effect: {
        type: "if-you-do",
        effect: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: 1,
          },
        },
        then: { type: "draw", count: 1, player: "controller" },
      },
    },
  }),
});

export const { red: restlessLooterRed } = restlessLooter.cards;

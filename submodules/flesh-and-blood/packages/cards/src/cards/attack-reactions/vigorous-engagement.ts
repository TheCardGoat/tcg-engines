import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/vigorous-engagement.generated.ts";

export const vigorousEngagement = definePitchFamily(fabPitchFamilies["vigorous-engagement"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    boostAndVigor: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { supertypes: ["Warrior"] } },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        {
          type: "conditional",
          condition: {
            type: "binding-matches",
            binding: "it",
            filter: { hasStatus: "defended-by-attack-action" },
          },
          then: { type: "create-token", token: "vigor", controller: "controller" },
        },
      ],
    },
  }),
});

export const {
  red: vigorousEngagementRed,
  yellow: vigorousEngagementYellow,
  blue: vigorousEngagementBlue,
} = vigorousEngagement.cards;

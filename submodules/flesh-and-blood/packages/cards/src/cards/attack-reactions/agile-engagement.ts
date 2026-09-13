import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/agile-engagement.generated.ts";

export const agileEngagement = definePitchFamily(fabPitchFamilies["agile-engagement"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    boostAndAgility: {
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
          then: { type: "create-token", token: "agility", controller: "controller" },
        },
      ],
    },
  }),
});

export const {
  red: agileEngagementRed,
  yellow: agileEngagementYellow,
  blue: agileEngagementBlue,
} = agileEngagement.cards;

import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/fatal-engagement.generated.ts";

export const fatalEngagement = definePitchFamily(fabPitchFamilies["fatal-engagement"], {
  parameters: pitchMap({ red: 5, yellow: 4, blue: 3 }),
  abilities: (amount) => ({
    attackActionDefends: {
      kind: "static",
      staticKind: "play",
      condition: { type: "defended-this-chain-link", filter: attackActionFilter() },
      playEffect: { role: "condition" },
    },
    attackBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: { typeBox: { subtypes: ["Attack"] } },
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});

export const {
  red: fatalEngagementRed,
  yellow: fatalEngagementYellow,
  blue: fatalEngagementBlue,
} = fatalEngagement.cards;

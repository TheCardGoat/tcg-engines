import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/guardian-of-the-shadowrealm.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const guardianOfTheShadowrealm = definePitchFamily(
  fabPitchFamilies["guardian-of-the-shadowrealm"],
  {
    keywords: [bloodDebt],
    abilities: () => ({
      returnFromBanishedZone: {
        kind: "activated",
        abilityType: "action",
        functionalZones: ["banished"],
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        effect: {
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "hand",
          },
        },
      },
    }),
  },
);

export const { red: guardianOfTheShadowrealmRed } = guardianOfTheShadowrealm.cards;

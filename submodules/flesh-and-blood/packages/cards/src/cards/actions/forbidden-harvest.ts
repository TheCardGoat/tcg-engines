import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/forbidden-harvest.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const forbiddenHarvest = definePitchFamily(fabPitchFamilies["forbidden-harvest"], {
  keywords: [goAgain],
  abilities: () => ({
    turnBanishedFaceDownCreateRunechantsForShadow: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "turn-face-down",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["banished"],
              filter: { hasStatus: "face-up" },
              count: { type: "up-to", amount: 3 },
            },
          },
          {
            type: "create-token",
            token: "runechant",
            controller: "controller",
            count: {
              type: "count",
              what: "turned-face-down-this-way",
              filter: { typeBox: { supertypes: ["Shadow"] } },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: forbiddenHarvestYellow } = forbiddenHarvest.cards;

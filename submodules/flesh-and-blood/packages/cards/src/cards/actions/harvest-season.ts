import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/harvest-season.generated.ts";

export const harvestSeason = definePitchFamily(fabPitchFamilies["harvest-season"], {
  keywords: [goAgain],

  abilities: () => ({
    triggeredActionPhaseStartSequenceDestroyGainLife: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "gain-life",
              amount: 3,
              target: {
                selector: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: harvestSeasonRed,
  yellow: harvestSeasonYellow,
  blue: harvestSeasonBlue,
} = harvestSeason.cards;

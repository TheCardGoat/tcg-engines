import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/saltwater-swell.generated.ts";

export const saltwaterSwell = definePitchFamily(fabPitchFamilies["saltwater-swell"], {
  keywords: [goAgain],

  abilities: () => ({
    createGoldWhenAttackMeetsRequirement: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  color: ["blue"],
                },
              },
              then: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "pitch",
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: saltwaterSwellRed,
  yellow: saltwaterSwellYellow,
  blue: saltwaterSwellBlue,
} = saltwaterSwell.cards;

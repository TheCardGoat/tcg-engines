import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ride-the-tailwind.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const rideTheTailwind = definePitchFamily(fabPitchFamilies["ride-the-tailwind"], {
  keywords: [goAgain],
  abilities: () => ({
    triggeredHitGrantPropertyThisTurnPower: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                types: ["Action"],
              },
              numeric: [
                {
                  property: "power",
                  basis: "base",
                  comparison: {
                    op: "lte",
                    value: 2,
                  },
                },
              ],
            },
            events: ["play", "attack"],
          },
        },
      },
    },
  }),
});

export const {
  red: rideTheTailwindRed,
  yellow: rideTheTailwindYellow,
  blue: rideTheTailwindBlue,
} = rideTheTailwind.cards;

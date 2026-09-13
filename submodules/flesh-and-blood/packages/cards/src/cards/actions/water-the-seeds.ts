import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/water-the-seeds.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const waterTheSeeds = definePitchFamily(fabPitchFamilies["water-the-seeds"], {
  keywords: [goAgain],
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-combat-chain",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              power: {
                op: "lte",
                value: 1,
              },
            },
          },
        },
      },
    },
  }),
});

export const {
  red: waterTheSeedsRed,
  yellow: waterTheSeedsYellow,
  blue: waterTheSeedsBlue,
} = waterTheSeeds.cards;

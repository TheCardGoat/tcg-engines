import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/big-bully.generated.ts";

export const bigBully = definePitchFamily(fabPitchFamilies["big-bully"], {
  abilities: () => ({
    whenAttacksHeroIfHaveMoreThanThemCrowd: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "gt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "crowd-boos",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
    ifVeBeenBooedTurnSBaseIsDoubled: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "booed", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "multiply",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "the-crowd-boos",
      },
    },
  }),
});
export const { red: bigBullyRed } = bigBully.cards;

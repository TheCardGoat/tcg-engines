import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/beckoning-brilliance.generated.ts";

export const beckoningBrilliance = definePitchFamily(fabPitchFamilies["beckoning-brilliance"], {
  abilities: () => ({
    whenAttacksNextInstantPlayChainLinkCostsLess: {
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
          property: "cost",
          op: "subtract",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-chain-link",
          appliesTo: {
            next: {
              typeBox: {
                types: ["Instant"],
              },
            },
          },
        },
      },
    },
  }),
});
export const { red: beckoningBrillianceRed } = beckoningBrilliance.cards;

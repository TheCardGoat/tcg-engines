import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/savage-beatdown.generated.ts";

export const savageBeatdown = definePitchFamily(fabPitchFamilies["savage-beatdown"], {
  abilities: () => ({
    playOnlyVeDiscardedWithNumber6MorePowerTurn: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "discard-power-6", player: "controller" },
      playEffect: {
        role: "condition",
      },
    },
    asAdditionalCostPlayDiscardRandom: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          random: true,
        },
      },
    },
    discardedHasNumber6MorePowerGetsNumber6Power: {
      kind: "resolution",
      condition: {
        type: "binding-matches",
        binding: "discardedCard",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 6,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: savageBeatdownRed } = savageBeatdown.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/harness-lightning.generated.ts";

/**
 * Model notes (hand-authored): printed "target hero" is any-hero, but a
 * conditional resolution ability never binds that target on the stack.
 * Opponent is the 1v1 subject so Lightning Flow can actually deal the 3.
 */
export const harnessLightning = definePitchFamily(fabPitchFamilies["harness-lightning"], {
  parameters: {
    red: {
      playedLightningTurnDeal3ArcaneDamageTarget: {
        kind: "resolution",
        condition: {
          type: "played-this",
          per: "turn",
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 3,
          target: {
            selector: "opponent",
          },
        },
        label: {
          name: "lightning-flow",
        },
      },
    },
    yellow: {
      playedLightningTurnDeal2ArcaneDamageTarget: {
        kind: "resolution",
        condition: {
          type: "played-this",
          per: "turn",
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 2,
          target: {
            selector: "any-hero",
          },
        },
        label: {
          name: "lightning-flow",
        },
      },
    },
  },
  abilities: (abilities) => abilities,
});

export const { red: harnessLightningRed, yellow: harnessLightningYellow } = harnessLightning.cards;

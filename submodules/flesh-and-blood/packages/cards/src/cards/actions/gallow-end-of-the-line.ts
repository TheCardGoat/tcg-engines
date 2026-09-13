import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gallow-end-of-the-line.generated.ts";

import { wateryGrave } from "../shared/keywords.ts";

export const gallowEndOfTheLine = definePitchFamily(fabPitchFamilies["gallow-end-of-the-line"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    instantDiscardWateryGraveUntilEndTurnEffectsControlled: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "discard",
            count: 1,
            filter: {
              hasKeyword: "watery-grave",
            },
          },
        ],
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "trigger",
        source: "opponents-effects",
        filter: {
          hasStatus: "attack-hit-this-chain-link",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { yellow: gallowEndOfTheLineYellow } = gallowEndOfTheLine.cards;

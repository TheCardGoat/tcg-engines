import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bubba-lubba-run-aground.generated.ts";

import { goAgain, wateryGrave } from "../shared/keywords.ts";

export const bubbaLubbaRunAground = definePitchFamily(fabPitchFamilies["bubba-lubba-run-aground"], {
  keywords: [wateryGrave],
  abilities: () => ({
    entersArena1Counter: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "enter-arena",
          subject: "self",
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
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
    actionRemove1CounterFromAllyControlDestroyAura: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        count: 1,
        filter: {
          typeBox: {
            subtypes: ["Ally"],
          },
        },
      },
      layerKeywords: [goAgain],
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["permanent"],
          filter: {
            and: [
              {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              {
                typeBox: {
                  metatypes: ["Token"],
                },
              },
            ],
          },
          count: 1,
        },
      },
    },
  }),
});
export const { yellow: bubbaLubbaRunAgroundYellow } = bubbaLubbaRunAground.cards;

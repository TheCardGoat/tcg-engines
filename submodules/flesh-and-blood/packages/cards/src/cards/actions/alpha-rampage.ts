import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/alpha-rampage.generated.ts";

export const alphaRampage = definePitchFamily(fabPitchFamilies["alpha-rampage"], {
  keywords: [
    {
      name: "specialization",
      hero: "Rhinar",
    },
  ],
  abilities: () => ({
    asAdditionalCostPlayAlphaRampageDiscardRandom: {
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
      label: {
        name: "intimidate",
      },
    },
    whenAttackAlphaRampageIntimidate: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Alpha Rampage",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "intimidate",
          target: "opponent",
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});
export const { red: alphaRampageRed } = alphaRampage.cards;

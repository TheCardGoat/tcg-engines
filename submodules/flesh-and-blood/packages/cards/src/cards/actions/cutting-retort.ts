import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cutting-retort.generated.ts";

export const cuttingRetort = definePitchFamily(fabPitchFamilies["cutting-retort"], {
  abilities: () => ({
    whenAttacksHeroMayPayUpDestroyManyAura: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "pay",
                cost: {
                  class: "asset",
                  type: "resources",
                  amount: {
                    type: "up-to",
                    amount: 3,
                  },
                },
                payer: "controller",
              },
            },
            {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    metatypes: ["Token"],
                    subtypes: ["Aura"],
                  },
                  differentNames: true,
                },
                count: {
                  type: "count",
                  what: "resources-paid-this-way",
                },
              },
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: {
                type: "count",
                what: "destroyed-this-way",
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});
export const { red: cuttingRetortRed } = cuttingRetort.cards;

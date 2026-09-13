import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/frost-hex.generated.ts";

export const frostHex = definePitchFamily(fabPitchFamilies["frost-hex"], {
  keywords: [
    {
      name: "specialization",
      hero: "Iyslander",
    },
  ],
  abilities: () => ({
    frostbitesControlHaveAtBeginningEndPhaseDeals1: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "atBeginningEndPhaseDeals1ArcaneDamage",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "end-phase",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "deal-damage",
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "controller",
                },
                source: {
                  selector: "self",
                },
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Frostbite",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { blue: frostHexBlue } = frostHex.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flashfreeze.generated.ts";

import { dominate, goAgain } from "../shared/keywords.ts";

export const flashfreeze = definePitchFamily(fabPitchFamilies["flashfreeze"], {
  keywords: [fusion(["Ice", "Lightning"], "and-or"), goAgain],
  abilities: () => ({
    ifFlashfreezeWasFusedIceAttacksControlTurnGain: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused-with-ice-card",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenAttackGainsDominateUnlessDefendingHeroPays",
            text: "",
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
                    name: "This",
                  },
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "unless",
                effect: {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: dominate,
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
                escape: {
                  type: "pay",
                  cost: {
                    class: "asset",
                    type: "resources",
                    amount: 2,
                  },
                  payer: "defending-hero",
                },
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
    ifFlashfreezeWasFusedLightningAttacksControlTurnGain: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused-with-lightning-card",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "ifHitsHeroDeal3DamageThem",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "hit",
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
                type: "deal-damage",
                damageType: "generic",
                amount: 3,
                target: {
                  selector: "attack-target",
                },
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: flashfreezeRed } = flashfreeze.cards;

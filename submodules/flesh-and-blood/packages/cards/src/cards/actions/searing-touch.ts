import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/searing-touch.generated.ts";

export const searingTouch = definePitchFamily(fabPitchFamilies["searing-touch"], {
  abilities: () => ({
    searingTouchPlayedAsChainLinkNumber4HigherHasWhenAttackWith: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "played-at-chain-link-4-or-higher",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenAttackWithDealNumber2DamageAny",
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
                type: "deal-damage",
                damageType: "generic",
                amount: 2,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["hero", "permanent"],
                  count: 1,
                },
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
      label: {
        name: "rupture",
      },
    },
  }),
});

export const { red: searingTouchRed } = searingTouch.cards;

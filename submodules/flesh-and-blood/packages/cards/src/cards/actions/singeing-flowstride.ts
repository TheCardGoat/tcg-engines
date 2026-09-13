import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/singeing-flowstride.generated.ts";

export const singeingFlowstride = definePitchFamily(fabPitchFamilies["singeing-flowstride"], {
  abilities: () => ({
    continuousStaticGrantProperty: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-keyword",
        keyword: "go-again",
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "triggeredStaticOnAttackEffect",
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
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "attack-target",
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
        name: "quickstrike",
      },
    },
    triggeredStaticOnDealtDamageEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "lightning-flow",
          controller: "controller",
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [1],
      },
    },
  }),
});

export const {
  red: singeingFlowstrideRed,
  yellow: singeingFlowstrideYellow,
  blue: singeingFlowstrideBlue,
} = singeingFlowstride.cards;

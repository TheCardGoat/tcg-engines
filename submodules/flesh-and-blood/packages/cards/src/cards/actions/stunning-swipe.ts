import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stunning-swipe.generated.ts";

export const stunningSwipe = definePitchFamily(fabPitchFamilies["stunning-swipe"], {
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
            kind: "event-object",
            selector: "damage-source",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Lightning"],
              },
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "tap",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "opponent",
            zones: ["hero", "weapon"],
            count: 1,
          },
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
  red: stunningSwipeRed,
  yellow: stunningSwipeYellow,
  blue: stunningSwipeBlue,
} = stunningSwipe.cards;

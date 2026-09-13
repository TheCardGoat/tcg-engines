import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/consuming-volition.generated.ts";
export const consumingVolition = definePitchFamily(fabPitchFamilies["consuming-volition"], {
  abilities: () => ({
    staticContinuousDamageDealtArcaneGrantProperty: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "damage-dealt",
        damageType: "arcane",
        player: "controller",
        per: "turn",
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "staticTriggeredHitDiscard",
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
                type: "discard",
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
    },
  }),
});
export const {
  red: consumingVolitionRed,
  yellow: consumingVolitionYellow,
  blue: consumingVolitionBlue,
} = consumingVolition.cards;

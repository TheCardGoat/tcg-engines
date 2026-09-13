import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { fusion } from "../shared/keywords.ts";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bramble-spark.generated.ts";

export const brambleSpark = definePitchFamily(fabPitchFamilies["bramble-spark"], {
  keywords: [fusion("Earth"), goAgain],

  abilities: () => ({
    grantArcaneDamageOnAttack: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "dealArcaneDamageOnAttack",
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
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "any-hero",
                },
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
    increaseNextAttackPowerIfFused: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
  }),
});
export const {
  red: brambleSparkRed,
  yellow: brambleSparkYellow,
  blue: brambleSparkBlue,
} = brambleSpark.cards;

import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/knife-through-butter.generated.ts";

export const knifeThroughButter = definePitchFamily(fabPitchFamilies["knife-through-butter"], {
  parameters: { red: { value1: 4 }, yellow: { value1: 3 }, blue: { value1: 2 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Dagger"],
            },
          },
        },
      },
    },
    delayedTriggerAttackThisTurnGrantPropertyThisTurn: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
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
                hasStatus: "marked",
              },
            },
            target: {
              kind: "hero",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const {
  red: knifeThroughButterRed,
  yellow: knifeThroughButterYellow,
  blue: knifeThroughButterBlue,
} = knifeThroughButter.cards;

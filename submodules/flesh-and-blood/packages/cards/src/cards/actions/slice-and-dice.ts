import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/slice-and-dice.generated.ts";

export const sliceAndDice = definePitchFamily(fabPitchFamilies["slice-and-dice"], {
  parameters: pitchMap({ red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionDelayedTrigger: {
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
                or: [
                  {
                    typeBox: {
                      subtypes: ["Sword"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Dagger"],
                    },
                  },
                ],
              },
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
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: { type: "count", what: "weapon-attacks-this-turn" },
              comparison: { op: "eq", value: 1 },
            },
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
            },
            else: {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: { type: "count", what: "weapon-attacks-this-turn" },
                comparison: { op: "eq", value: 2 },
              },
              then: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: value1,
                target: {
                  selector: "this-attack",
                },
                duration: "this-turn",
              },
            },
          },
        },
      },
    },
  }),
});

export const {
  red: sliceAndDiceRed,
  yellow: sliceAndDiceYellow,
  blue: sliceAndDiceBlue,
} = sliceAndDice.cards;

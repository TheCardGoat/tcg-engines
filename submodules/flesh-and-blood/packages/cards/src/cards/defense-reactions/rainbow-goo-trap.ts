import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/rainbow-goo-trap.generated.ts";

export const rainbowGooTrap = definePitchFamily(fabPitchFamilies["rainbow-goo-trap"], {
  abilities: () => ({
    stripAbilitiesOnBoostedDominateGoAgain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              and: [
                {
                  hasStatus: "power-greater-than-base",
                },
                {
                  hasKeyword: "dominate",
                },
                {
                  hasKeyword: "go-again",
                },
              ],
            },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "subtract",
              amount: 2,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "remove-property",
                  property: {
                    kind: "abilities",
                  },
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
                },
                {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "gain-abilities",
                  duration: "this-turn",
                },
              ],
            },
          ],
        },
      },
    },
  }),
});

export const { red: rainbowGooTrapRed } = rainbowGooTrap.cards;

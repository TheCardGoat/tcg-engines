import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pulsewave-harpoon.generated.ts";

export const pulsewaveHarpoon = definePitchFamily(fabPitchFamilies["pulsewave-harpoon"], {
  keywords: [boost],
  abilities: () => ({
    attacksRevealXHandWhereXNumberTimesBoostedCombatChainChooseActionDefenseLessThanEqualXThenAddChainLinkDefending:
      {
        kind: "static",
        staticKind: "triggered",
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
            type: "sequence",
            steps: [
              {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["hand"],
                  count: {
                    type: "count",
                    what: "boosts-this-combat-chain",
                  },
                },
                outputBinding: "it",
              },
              {
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["hand"],
                  filter: {
                    typeBox: {
                      types: ["Action"],
                    },
                    defense: {
                      op: "lte",
                      value: {
                        type: "count",
                        what: "boosts-this-combat-chain",
                      },
                    },
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "add-defending",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            ],
          },
        },
      },
  }),
});

export const { red: pulsewaveHarpoonRed } = pulsewaveHarpoon.cards;

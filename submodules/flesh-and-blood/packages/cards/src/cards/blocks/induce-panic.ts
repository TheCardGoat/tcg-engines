import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/induce-panic.generated.ts";

export const inducePanic = definePitchFamily(fabPitchFamilies["induce-panic"], {
  abilities: () => ({
    revealAndDiscardChosenColor: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-color",
            },
            {
              type: "for-each",
              target: {
                selector: "each-hero",
              },
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "reveal",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "iteration-subject",
                      zones: ["hand"],
                      count: 1,
                      random: true,
                    },
                    outputBinding: "it",
                    duration: "until-triggered",
                  },
                  {
                    type: "conditional",
                    condition: {
                      type: "binding-matches",
                      binding: "it",
                      filter: {
                        color: ["chosen"],
                      },
                    },
                    then: {
                      type: "discard",
                      target: {
                        selector: "binding",
                        binding: "it",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: inducePanicYellow } = inducePanic.cards;

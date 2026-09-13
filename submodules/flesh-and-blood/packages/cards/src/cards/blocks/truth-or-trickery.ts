import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/truth-or-trickery.generated.ts";

export const truthOrTrickery = definePitchFamily(fabPitchFamilies["truth-or-trickery"], {
  abilities: () => ({
    guessTopCardColorOnDefend: {
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
              type: "optional",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "look",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["deck"],
                      position: "top",
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "choose-color",
                  },
                  {
                    type: "guess",
                    predicate: "binding-matches-chosen-color",
                    binding: "it",
                    guesser: "attacking-hero",
                  },
                  {
                    type: "look",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                  {
                    type: "conditional",
                    condition: {
                      type: "has-status",
                      status: "guessed-wrong",
                    },
                    then: {
                      type: "discard",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "attacking-hero",
                        zones: ["hand"],
                        count: 1,
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

export const { yellow: truthOrTrickeryYellow } = truthOrTrickery.cards;

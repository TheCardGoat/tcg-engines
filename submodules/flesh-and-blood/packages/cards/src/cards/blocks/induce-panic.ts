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
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "each",
                zones: ["hand"],
                count: 1,
                random: true,
              },
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
                  selector: "object",
                  declared: "at-resolution",
                  player: "each",
                  zones: ["hand"],
                  count: 1,
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: inducePanicYellow } = inducePanic.cards;

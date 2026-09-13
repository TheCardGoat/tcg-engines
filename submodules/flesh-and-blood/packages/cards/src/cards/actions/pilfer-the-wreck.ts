import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pilfer-the-wreck.generated.ts";

export const pilferTheWreck = definePitchFamily(fabPitchFamilies["pilfer-the-wreck"], {
  abilities: () => ({
    triggeredHitSequenceOptionalTurnFaceDownConditionalBindingMatchesCreateTokenGold: {
      kind: "static",
      staticKind: "triggered",
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
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "turn-face-down",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["graveyard"],
                  filter: {},
                  count: 1,
                },
                outputBinding: "it",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  color: ["yellow"],
                },
              },
              then: {
                type: "create-token",
                token: "gold",
                controller: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: pilferTheWreckRed,
  yellow: pilferTheWreckYellow,
  blue: pilferTheWreckBlue,
} = pilferTheWreck.cards;

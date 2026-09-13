import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/right-behind-you.generated.ts";

export const rightBehindYou = definePitchFamily(fabPitchFamilies["right-behind-you"], {
  abilities: () => ({
    triggeredDefendSequenceModifyNumericDefenseThisTurnOptionalLookOptionalMoveCard: {
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
          cohort: {
            kind: "together-with",
            filter: {
              playedFromZones: ["hand"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "defense",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
                {
                  type: "optional",
                  effect: {
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
                },
              ],
            },
            {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: rightBehindYouRed,
  yellow: rightBehindYouYellow,
  blue: rightBehindYouBlue,
} = rightBehindYou.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shifting-winds-of-the-mystic-beast.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shiftingWindsOfTheMysticBeast = definePitchFamily(
  fabPitchFamilies["shifting-winds-of-the-mystic-beast"],
  {
    keywords: [goAgain],
    abilities: () => ({
      wheneverPlayCrouchingTigerTurnNameGetsName: {
        kind: "resolution",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "played-card",
                relationship: {
                  kind: "any",
                },
                filter: {
                  name: "Crouching Tiger",
                },
                bindAs: "it",
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
              type: "sequence",
              steps: [
                {
                  type: "name-card",
                  suggestions: ["your-hand"],
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "name",
                    value: "chosen",
                  },
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "permanent",
                },
              ],
            },
          },
        },
      },
      chiWasPitchedPlayCreateNumber2CrouchingTigersInHand: {
        kind: "resolution",
        condition: {
          type: "binding-numeric",
          binding: "pitched-this-way-chi-card",
          comparison: { op: "eq", value: 1 },
        },
        effect: {
          type: "create-token",
          token: "crouching-tiger",
          controller: "controller",
          count: 2,
          to: {
            zone: "hand",
          },
        },
      },
    }),
  },
);

export const { blue: shiftingWindsOfTheMysticBeastBlue } = shiftingWindsOfTheMysticBeast.cards;

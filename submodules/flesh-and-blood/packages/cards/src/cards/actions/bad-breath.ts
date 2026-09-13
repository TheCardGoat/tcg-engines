import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bad-breath.generated.ts";

export const badBreath = definePitchFamily(fabPitchFamilies["bad-breath"], {
  keywords: [goAgain],

  // Printed token counts scale inversely with pitch: red 3, yellow 2, blue 1.
  abilities: (_parameter, { pitch }) => ({
    intimidate: {
      kind: "resolution",
      effect: {
        type: "intimidate",
        target: "any",
      },
      label: {
        name: "intimidate",
      },
    },
    onHitCreateTokenMight: {
      kind: "resolution",
      label: {
        name: "intimidate",
      },
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
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
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              bindAs: "it",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "might",
            controller: "controller",
            count: 4 - Number(pitch),
          },
        },
      },
    },
  }),
});
export const { red: badBreathRed, yellow: badBreathYellow, blue: badBreathBlue } = badBreath.cards;

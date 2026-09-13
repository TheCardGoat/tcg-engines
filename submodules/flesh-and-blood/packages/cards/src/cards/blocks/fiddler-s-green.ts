import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/fiddler-s-green.generated.ts";

export const fiddlerSGreen = definePitchFamily(fabPitchFamilies["fiddler-s-green"], {
  parameters: pitchMap({ red: { lifeGain: 3 }, yellow: { lifeGain: 2 }, blue: { lifeGain: 1 } }),
  abilities: ({ lifeGain }) => ({
    gainLifeOnGraveyard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "put-into-graveyard",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "gain-life", amount: lifeGain, target: { selector: "controller" } },
      },
    },
  }),
});

export const {
  red: fiddlerSGreenRed,
  yellow: fiddlerSGreenYellow,
  blue: fiddlerSGreenBlue,
} = fiddlerSGreen.cards;

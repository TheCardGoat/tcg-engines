import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/earth-form.generated.ts";
export const earthForm = definePitchFamily(fabPitchFamilies["earth-form"], {
  abilities: () => ({
    staticTriggeredHitCreateTokenEmbodimentEarth: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "embodiment-of-earth",
          controller: "controller",
        },
      },
    },
  }),
});
export const { red: earthFormRed, yellow: earthFormYellow, blue: earthFormBlue } = earthForm.cards;

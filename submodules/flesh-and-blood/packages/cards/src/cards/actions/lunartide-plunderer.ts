import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lunartide-plunderer.generated.ts";

export const lunartidePlunderer = definePitchFamily(fabPitchFamilies["lunartide-plunderer"], {
  abilities: () => ({
    triggeredHitSequenceBanish: {
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
              type: "banish",
              target: {
                selector: "self",
              },
            },
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["soul"],
                count: 1,
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: lunartidePlundererRed,
  yellow: lunartidePlundererYellow,
  blue: lunartidePlundererBlue,
} = lunartidePlunderer.cards;

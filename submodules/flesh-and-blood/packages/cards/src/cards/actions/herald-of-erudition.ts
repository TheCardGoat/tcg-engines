import { dominate, phantasm } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-erudition.generated.ts";

export const heraldOfErudition = definePitchFamily(fabPitchFamilies["herald-of-erudition"], {
  keywords: [dominate, phantasm],
  abilities: () => ({
    hitsPutSoulDraw2: {
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
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "self",
              },
              to: {
                zone: "soul",
              },
            },
            {
              type: "draw",
              count: 2,
              player: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: heraldOfEruditionYellow } = heraldOfErudition.cards;

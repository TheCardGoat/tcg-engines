import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/over-loop.generated.ts";
import { boost } from "../shared/keywords.ts";

export const overLoop = definePitchFamily(fabPitchFamilies["over-loop"], {
  keywords: [boost],
  abilities: () => ({
    triggeredHitMoveCard: {
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
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  }),
});

export const { red: overLoopRed, yellow: overLoopYellow, blue: overLoopBlue } = overLoop.cards;

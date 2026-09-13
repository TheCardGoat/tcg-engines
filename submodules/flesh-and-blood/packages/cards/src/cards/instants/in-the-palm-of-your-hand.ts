import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/in-the-palm-of-your-hand.generated.ts";

export const inThePalmOfYourHand = definePitchFamily(fabPitchFamilies["in-the-palm-of-your-hand"], {
  keywords: [suspense],
  abilities: () => ({
    whenEntersLeavesArenaDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "enter-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
            {
              name: "leave-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  }),
});

export const { red: inThePalmOfYourHandRed } = inThePalmOfYourHand.cards;

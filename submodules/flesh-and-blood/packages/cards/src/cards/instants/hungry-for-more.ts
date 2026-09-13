import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/hungry-for-more.generated.ts";

export const hungryForMore = definePitchFamily(fabPitchFamilies["hungry-for-more"], {
  keywords: [suspense],
  abilities: () => ({
    whenLeavesArenaGain3: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-life",
          amount: 3,
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { red: hungryForMoreRed } = hungryForMore.cards;

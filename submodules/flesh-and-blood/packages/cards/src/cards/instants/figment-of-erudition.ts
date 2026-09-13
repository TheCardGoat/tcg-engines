import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/figment-of-erudition.generated.ts";

export const figmentOfErudition = definePitchFamily(fabPitchFamilies["figment-of-erudition"], {
  keywords: [legendary],
  abilities: () => ({
    whenEntersArenaCreatePonderToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
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
          type: "create-token",
          token: "ponder",
          controller: "controller",
        },
      },
    },
  }),
});

export const { yellow: figmentOfEruditionYellow } = figmentOfErudition.cards;

import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/figment-of-war.generated.ts";

export const figmentOfWar = definePitchFamily(fabPitchFamilies["figment-of-war"], {
  keywords: [legendary],
  abilities: () => ({
    whenEntersArenaCreateCourageToken: {
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
          token: "courage",
          controller: "controller",
        },
      },
    },
  }),
});

export const { yellow: figmentOfWarYellow } = figmentOfWar.cards;

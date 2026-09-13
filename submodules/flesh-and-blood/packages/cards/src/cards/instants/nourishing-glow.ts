import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/nourishing-glow.generated.ts";

export const nourishingGlow = definePitchFamily(fabPitchFamilies["nourishing-glow"], {
  keywords: [ward(1)],
  abilities: () => ({
    whenEntersArenaGain1: {
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
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { blue: nourishingGlowBlue } = nourishingGlow.cards;

import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/figment-of-ravages.generated.ts";

export const figmentOfRavages = definePitchFamily(fabPitchFamilies["figment-of-ravages"], {
  keywords: [legendary],
  abilities: () => ({
    whenEntersArenaDeal1ArcaneDamageAnyTarget: {
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
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["hero", "permanent"],
            count: 1,
          },
        },
      },
    },
  }),
});

export const { yellow: figmentOfRavagesYellow } = figmentOfRavages.cards;

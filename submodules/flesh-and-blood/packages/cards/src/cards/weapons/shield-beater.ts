import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/shield-beater.generated.ts";

export const shieldBeater = defineCard(fabCardIdentitiesByCanonicalId["t86nFWmmtDFMPJr9R9jwN"], {
  abilities: {
    actionResourceResourceResourceResourceTapAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 4,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    namedVisitAnvilheimGetGoAgain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["permanent"],
          filter: {
            name: "Visit Anvilheim",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  },
});

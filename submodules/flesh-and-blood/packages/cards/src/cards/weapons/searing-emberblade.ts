import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/searing-emberblade.generated.ts";

export const searingEmberblade = defineCard(
  fabCardIdentitiesByCanonicalId["jqRDtJRT9rF7rwC6pdfJD"],
  {
    abilities: {
      oncePerTurnActionResourceResourceAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      grantGoAgainAfterTwoDraconicChainLinks: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "chain-links",
            player: "controller",
            filter: { typeBox: { supertypes: ["Draconic"] } },
          },
          comparison: { op: "gte", value: 2 },
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: { selector: "self" },
          duration: "while-in-arena",
          appliesTo: {
            attacksOf: true,
            next: {
              typeBox: {
                types: ["Weapon"],
              },
            },
            count: { type: "all" },
            events: ["attack"],
          },
        },
      },
    },
  },
);

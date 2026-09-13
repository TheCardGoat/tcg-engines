import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/macros/omens-of-arcana.generated.ts";
import { spellvoid } from "../shared/keywords.ts";

export const omensOfArcana = defineCard(fabCardIdentitiesByCanonicalId.mjprN8T6mMh9pcWCmgPrN, {
  abilities: {
    createLightningFlows: {
      kind: "static",
      staticKind: "meta",
      effect: {
        type: "create-token",
        token: "lightning-flow",
        controller: "each",
      },
    },
    grantSpellvoid: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: spellvoid(1),
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["permanent"],
          filter: {
            name: "Lightning Flow",
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

import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/corrupted-corpse.generated.ts";
import { bloodDebt, goAgain, incarnate } from "../shared/keywords.ts";

export const corruptedCorpse = defineCard(fabCardIdentitiesByCanonicalId["qmC78MP6bjTHcDChc6RMJ"], {
  keywords: [incarnate, goAgain, bloodDebt],
  abilities: {
    sAttacksGetGoAgain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "this-attack",
        },
        duration: "while-in-arena",
      },
    },
  },
});

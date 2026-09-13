import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/miragai.generated.ts";
import { phantasm } from "../shared/keywords.ts";

export const miragai = defineCard(fabCardIdentitiesByCanonicalId.Nhdt8dQ86kQhLgFd8cd8z, {
  abilities: {
    removePhantasmFromFirstDragonAttack: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-property",
            property: {
              kind: "keyword",
              keyword: phantasm,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Dragon"],
                },
              },
              ordinal: 1,
            },
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "gain-keyword",
            filter: {
              hasKeyword: "phantasm",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Dragon"],
                },
              },
              ordinal: 1,
            },
          },
        ],
      },
    },
  },
});

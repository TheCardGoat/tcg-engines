import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/ash.generated.ts";
import { phantasm } from "../shared/keywords.ts";

export const ash = defineCard(fabCardIdentitiesByCanonicalId.G6CnbFqjfGgKqqqmnCbMh, {
  abilities: {
    grantPhantasmWhileUnderObject: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "source-is-subcard-of-host",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: phantasm,
        },
        target: {
          selector: "host",
        },
        duration: "while-condition",
      },
      label: {
        name: "material",
      },
    },
  },
});

import { spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/volcanic-vice.generated.ts";

export const volcanicVice = defineCard(fabCardIdentitiesByCanonicalId["8tGLHwNjzzJdqkjhhKBRb"], {
  abilities: {
    ifVeCreatedSeismicSurgeTurnGetsSpellvoid3: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "performed-this-turn",
        event: "create-seismic-surge",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: spellvoid(3),
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
});

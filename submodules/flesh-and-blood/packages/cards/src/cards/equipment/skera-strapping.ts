import { spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/skera-strapping.generated.ts";

export const skeraStrapping = defineCard(fabCardIdentitiesByCanonicalId["LB6wBhCKpBWCJqd9tFR8B"], {
  abilities: {
    ifVePitched6MoreTurnGetsSpellvoid3: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "pitch-power-6", player: "controller" },
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

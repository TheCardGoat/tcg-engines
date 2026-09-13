import { spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/claw-of-vynserakai.generated.ts";

export const clawOfVynserakai = defineCard(
  fabCardIdentitiesByCanonicalId["hgWGqgpQTdRHtTKcWpjkw"],
  {
    keywords: [spellvoid(1)],
    abilities: {
      oncePerTurnActionResourceAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
);

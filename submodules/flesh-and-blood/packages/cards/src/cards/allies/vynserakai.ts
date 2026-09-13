import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/vynserakai.generated.ts";

export const vynserakai = defineCard(fabCardIdentitiesByCanonicalId.MFrJG8G8RgrhkpfkD8KWj, {
  abilities: {
    dealArcaneDamageOnHit: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 3,
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  },
});

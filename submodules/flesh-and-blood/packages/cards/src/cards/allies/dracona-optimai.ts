import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/dracona-optimai.generated.ts";

export const draconaOptimai = defineCard(fabCardIdentitiesByCanonicalId["78FGMN9nn9QR9FDzC9z68"], {
  abilities: {
    revealAndDealArcaneDamageOnAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 3,
              },
            },
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: {
                type: "double",
                operands: [
                  {
                    type: "count",
                    what: "cards-revealed-this-way",
                    filter: {
                      color: ["red"],
                    },
                  },
                ],
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["hero", "permanent"],
                count: 1,
              },
            },
          ],
        },
      },
    },
  },
});

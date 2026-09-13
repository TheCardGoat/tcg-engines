import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/face-purgatory.generated.ts";

export const facePurgatory = defineCard(fabCardIdentitiesByCanonicalId["Q8bMrFtWrMrdPC7KtGbFz"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsTogetherAttackActionNonAttackActionAttacking: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
          cohort: {
            kind: "together-with-each",
            filters: [
              attackActionFilter(),
              {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            ],
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              // "the attacking hero discards a card" — they choose from their hand.
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attacking-hero",
                zones: ["hand"],
                count: 1,
                chooser: "attacking-hero",
              },
            },
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
          ],
        },
      },
    },
  },
});

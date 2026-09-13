import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/toby-jugs.generated.ts";

export const tobyJugs = defineCard(fabCardIdentitiesByCanonicalId["rKwFK8LDKhPht6b9pNF7P"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsMayPayIfDoGets2Turn: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "controller",
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    },
  },
});

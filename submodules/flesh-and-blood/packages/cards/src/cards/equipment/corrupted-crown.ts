import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/corrupted-crown.generated.ts";

export const corruptedCrown = defineCard(fabCardIdentitiesByCanonicalId["cG7zJMLjpLdWLFtzLTmbn"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsMayBanishFromHandIfDoGets: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 1,
            target: { selector: "self" },
            duration: "this-chain-link",
          },
        },
      },
    },
  },
});

import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/reach-of-the-abyss.generated.ts";
export const reachOfTheAbyss = defineCard(fabCardIdentitiesByCanonicalId["DJDdtNF6rgJkJ77JwLqQF"], {
  abilities: {
    defended: {
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
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "combat-chain-close",
              actor: { kind: "none" },
              observes: { kind: "none" },
            },
          },
          policy: { kind: "windowed", duration: "this-combat-chain", matching: "first" },
          resolution: {
            kind: "effect",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["combat-chain"],
                filter: { defending: true },
                count: { type: "all" },
              },
            },
          },
        },
      },
    },
  },
});

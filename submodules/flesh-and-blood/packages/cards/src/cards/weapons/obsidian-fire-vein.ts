import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/obsidian-fire-vein.generated.ts";

export const obsidianFireVein = defineCard(
  fabCardIdentitiesByCanonicalId["qMBpL7WdHmD7rgtMwQpfR"],
  {
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
      playedDraconicChainLinkAttackGets1PowerGoAgain: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "played-this",
          per: "chain-link",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        effect: {
          type: "sequence",
          appliesTo: {
            attacksOf: true,
            next: {
              typeBox: {
                types: ["Weapon"],
              },
            },
            count: { type: "all" },
            events: ["attack"],
          },
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: { selector: "self" },
              duration: "while-in-arena",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: { selector: "self" },
              duration: "while-in-arena",
            },
          ],
        },
      },
    },
  },
);

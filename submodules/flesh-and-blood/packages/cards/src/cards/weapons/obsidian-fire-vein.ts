import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/obsidian-fire-vein.generated.ts";

export const obsidianFireVein = defineCard(
  fabCardIdentitiesByCanonicalId["qMBpL7WdHmD7rgtMwQpfR"],
  {
    abilities: {
      oncePerTurnActionResourceAttackPlayedDraconicChainLinkAttackGets1PowerGoAgain: {
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
          type: "sequence",
          steps: [
            {
              type: "attack-with",
              target: {
                selector: "self",
              },
            },
            {
              type: "conditional",
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
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 1,
                    target: {
                      selector: "this-attack",
                    },
                    duration: "permanent",
                  },
                  {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: goAgain,
                    },
                    target: {
                      selector: "this-attack",
                    },
                    duration: "permanent",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
);

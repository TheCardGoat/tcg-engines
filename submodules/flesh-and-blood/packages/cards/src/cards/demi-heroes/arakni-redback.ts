import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/demi-heroes/arakni-redback.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const arakniRedback = defineCard(fabCardIdentitiesByCanonicalId.dhHz8JT9mMD79KJqNWNnB, {
  abilities: {
    empowerStealthAndGrantGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "discard",
        count: 1,
        filter: {
          typeBox: {
            supertypes: ["Assassin"],
          },
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Assassin"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                hasKeyword: "stealth",
              },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "permanent",
            },
          },
        ],
      },
    },
    returnToBrood: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "return-to-brood" },
      },
    },
  },
});

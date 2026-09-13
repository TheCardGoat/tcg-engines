import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/duelist-gauntlets.generated.ts";

export const duelistGauntlets = defineCard(
  fabCardIdentitiesByCanonicalId["d8Hz9pLqTcWgzGG6WD6Gz"],
  {
    keywords: [battleworn],
    abilities: {
      attackReactionDestroyTargetSwordAttackGetsReactionGet: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            { class: "asset", type: "resources", amount: 1 },
            { class: "effect", type: "destroy-self" },
          ],
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              id: "reactionGet1WhileDefending",
              text: "",
              kind: "static",
              staticKind: "continuous",
              effect: {
                type: "modify-numeric",
                property: "defense",
                op: "subtract",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "any",
                  zones: ["combat-chain"],
                  filter: {
                    or: [
                      { typeBox: { types: ["Attack Reaction"] } },
                      { typeBox: { types: ["Defense Reaction"] } },
                    ],
                    defending: true,
                  },
                  count: { type: "all" },
                },
                duration: "this-chain-link",
              },
            },
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { subtypes: ["Sword"] } },
            count: 1,
          },
          duration: "this-chain-link",
        },
      },
    },
  },
);

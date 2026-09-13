import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tiger-stripe-shuko.generated.ts";

export const tigerStripeShuko = defineCard(
  fabCardIdentitiesByCanonicalId["gtzjLhHGpPmFgcLdpTBFH"],
  {
    keywords: [bladeBreak],
    abilities: {
      secondAttackAction2LessBasePlayEachTurn: {
        kind: "static",
        staticKind: "continuous",
        effect: {
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
              duration: "this-turn",
              appliesTo: {
                ...nextAttackActionLatch({
                  power: {
                    op: "lte",
                    value: 2,
                  },
                }),
                ordinal: 2,
              },
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  id: "damageWouldBeDealtByCanTBePrevented",
                  text: "",
                  kind: "static",
                  staticKind: "continuous",
                  effect: {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "be-prevented",
                    subject: {
                      name: "This",
                    },
                    duration: "permanent",
                  },
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                ...nextAttackActionLatch({
                  power: {
                    op: "lte",
                    value: 2,
                  },
                }),
                ordinal: 2,
              },
            },
          ],
        },
      },
    },
  },
);

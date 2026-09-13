import { arcaneBarrier, battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/arcanite-skullcap.generated.ts";

export const arcaniteSkullcap = defineCard(
  fabCardIdentitiesByCanonicalId["NQDNdGfjP6bd8WHP8QNnt"],
  {
    // Printed AB 3 is only while life < opponent (continuous below), not base.
    keywords: [battleworn],
    abilities: {
      ifHaveLessThanOpponentArcaniteSkullcapGains1: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              // Continuous static: re-evaluated while condition holds (not a
              // one-turn grant that expires at end of turn).
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: arcaneBarrier(3),
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          ],
        },
      },
    },
  },
);

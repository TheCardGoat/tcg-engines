import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/tremor-of-anticipation.generated.ts";

export const tremorOfAnticipation = defineCard(
  fabCardIdentitiesByCanonicalId.fKbwfGWzk7zrpWBTNcrjd,
  {
    abilities: {
      increaseTokensCreated: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "create",
            filter: {
              typeBox: {
                metatypes: ["Token"],
              },
            },
          },
          modification: {
            type: "modify-numeric",
            property: "count",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          duration: "this-turn",
        },
      },
      createGold: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
      },
    },
  },
);

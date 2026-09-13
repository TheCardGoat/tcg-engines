import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/annals-of-sutcliffe.generated.ts";

export const annalsOfSutcliffe = defineCard(
  fabCardIdentitiesByCanonicalId["9gnHtCMJBbDQjqk8cWmhN"],
  {
    abilities: {
      oncePerTurnActionResourceResourceResourceDrawAttackActionNonAttackActionWerePitchedWayCreateRunechantToken:
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "action",
          cost: {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "draw",
                count: 1,
                player: "controller",
              },
              {
                type: "conditional",
                condition: {
                  type: "has-status",
                  status: "pitched-attack-and-non-attack-action-to-play-this",
                },
                then: {
                  type: "create-token",
                  token: "runechant",
                  controller: "controller",
                },
              },
            ],
          },
        },
    },
  },
);

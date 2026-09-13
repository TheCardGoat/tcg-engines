import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/zen-tamer-of-purpose.generated.ts";

export const zenTamerOfPurpose = defineCard(
  fabCardIdentitiesByCanonicalId["GDbCgdDrFKCWWthrgD6h6"],
  {
    abilities: {
      oncePerTurnInstantChiChiChiCreateCrouchingTigerHandSearchDeckComboBanishThenShufflePlayTurn: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "asset",
          type: "chi",
          amount: 3,
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "crouching-tiger",
              controller: "controller",
              to: {
                zone: "hand",
              },
            },
            {
              type: "search",
              zones: ["deck"],
              filter: {
                hasKeyword: "combo",
              },
              mayFail: true,
              to: {
                zone: "banished",
              },
              // Bind the tutored combo card for the this-turn play permission
              // (same pattern as Katsu's hit tutor / Young Zen MST047).
              outputBinding: "it",
            },
            {
              type: "shuffle",
              zone: "deck",
            },
            {
              // Continuous this-turn play permission (not an immediate optional cast).
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  },
);

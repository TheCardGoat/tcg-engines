import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/seven-sin-nebula.generated.ts";

export const sevenSinNebula = defineCard(fabCardIdentitiesByCanonicalId["6NCKgNWRrD7cqzzhw6Qtz"], {
  abilities: {
    actionResourceTapAttackActivateOnlyPlayedBanishedZoneTurn: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      condition: { type: "played-this", per: "turn", filter: { playedFromZones: ["banished"] } },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    hitsCreateRunechantToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
  },
});

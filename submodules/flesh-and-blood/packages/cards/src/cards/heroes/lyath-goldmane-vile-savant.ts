import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/lyath-goldmane-vile-savant.generated.ts";

export const lyathGoldmaneVileSavant = defineCard(
  fabCardIdentitiesByCanonicalId["MgKprw8PQjNKC7JDmppHh"],
  {
    abilities: {
      basePowerDefenseHalvedRoundedUp: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "divide",
              amount: 2,
              rounding: "up",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: [
                  "combat-chain",
                  "stack",
                  "hand",
                  "deck",
                  "arsenal",
                  "graveyard",
                  "banished",
                ],
                count: {
                  type: "all",
                },
              },
              duration: "while-in-arena",
            },
            {
              type: "modify-numeric",
              property: "defense",
              op: "divide",
              amount: 2,
              rounding: "up",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: [
                  "combat-chain",
                  "stack",
                  "hand",
                  "deck",
                  "arsenal",
                  "graveyard",
                  "banished",
                ],
                count: {
                  type: "all",
                },
              },
              duration: "while-in-arena",
            },
          ],
        },
      },
      instantResourceResourceTapCrowdBoosDefendingActionGet1DefenseTurn: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            {
              class: "effect",
              type: "tap-self",
            },
          ],
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "crowd-boos",
              target: "controller",
            },
            {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent", "combat-chain"],
                filter: {
                  typeBox: {
                    types: ["Action"],
                  },
                  defending: true,
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-turn",
            },
          ],
        },
      },
      wheneverCrowdBoosCreateMightToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "crowd-boos",
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
          effect: {
            type: "create-token",
            token: "might",
            controller: "controller",
          },
        },
      },
    },
  },
);

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/old-favorite.generated.ts";

export const oldFavorite = definePitchFamily(fabPitchFamilies["old-favorite"], {
  abilities: () => ({
    attacksCheeredTurnCreateToughnessToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: { type: "performed-this-turn", event: "cheered", player: "controller" },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "toughness",
          controller: "controller",
        },
      },
    },
    defends6MoreDefensePutBottomOwnersDeckCombatChainCloses: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "binding-matches",
          binding: "it",
          filter: {
            defense: {
              op: "gte",
              value: 6,
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "combat-chain-close",
              actor: {
                kind: "none",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-combat-chain",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "move-card",
              target: {
                selector: "self",
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
          },
        },
      },
    },
  }),
});

export const { yellow: oldFavoriteYellow } = oldFavorite.cards;

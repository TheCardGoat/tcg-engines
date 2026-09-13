import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scooba-salty-sea-dog.generated.ts";
import { wateryGrave } from "../shared/keywords.ts";

export const scoobaSaltySeaDog = definePitchFamily(fabPitchFamilies["scooba-salty-sea-dog"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionResourceResourceResourceTAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    whenAttacksPutYellowFromGraveyardOnBottomOwnerSDeckDo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["graveyard"],
              filter: {
                color: ["yellow"],
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
          then: {
            type: "create-token",
            token: "gold",
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { yellow: scoobaSaltySeaDogYellow } = scoobaSaltySeaDog.cards;

import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/gravy-bones.generated.ts";

export const gravyBones = defineCard(fabCardIdentitiesByCanonicalId["Fq9Cg9pKGFKrTbfHq9mBb"], {
  abilities: {
    instantTapDestroyGoldDrawThenDiscard: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              name: "Gold",
            },
          },
        ],
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
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
        ],
      },
    },
    bluePutGraveyardTurnPlayWateryGraveGraveyard: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "performed-this-turn",
        event: "put-blue-card-into-graveyard",
        player: "controller",
      },
      effect: {
        type: "play-card",
        fromZones: ["graveyard"],
        source: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["graveyard"],
          count: { type: "all" },
          filter: {
            hasKeyword: "watery-grave",
          },
        },
        duration: "while-in-arena",
      },
    },
  },
});

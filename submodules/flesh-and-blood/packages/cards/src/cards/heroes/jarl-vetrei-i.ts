import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/jarl-vetrei-i.generated.ts";

export const jarlVetreiI = defineCard(fabCardIdentitiesByCanonicalId["9QL68DDb9hCqhWWhgnQgR"], {
  keywords: [
    {
      name: "essence",
      supertypes: ["Earth", "Ice"],
    },
  ],
  abilities: {
    wheneverPlayIceCreateFrostbiteTokenOpponentsExposedHeadChestArmsLegsZone: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Ice"],
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "frostbite",
          controller: "opponent",
          // CR 3.0.1a: first empty equipment zone among head/chest/arms/legs.
          amongExposed: ["equipment-head", "equipment-chest", "equipment-arms", "equipment-legs"],
        },
      },
    },
  },
});

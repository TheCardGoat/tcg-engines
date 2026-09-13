import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/blood-of-the-dracai.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const bloodOfTheDracaiRed = defineCard(
  fabCardIdentitiesByCanonicalId.nqFNHFqP79nMk7TKM9r8T,
  {
    keywords: [legendary],
    abilities: {
      reduceNextDraconicCardCosts: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "pitch",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "pitched-card",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Blood Of The Dracai",
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "modify-numeric",
            property: "cost",
            op: "subtract",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Draconic"],
                },
              },
              count: 3,
            },
          },
        },
      },
    },
  },
);

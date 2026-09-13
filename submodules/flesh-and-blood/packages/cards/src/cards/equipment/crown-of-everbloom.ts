import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crown-of-everbloom.generated.ts";

export const crownOfEverbloom = defineCard(
  fabCardIdentitiesByCanonicalId["trMzKPpJWJGpqnpDTMzbp"],
  {
    keywords: [arcaneBarrier(2)],
    abilities: {
      instantDestroyPutFromArsenalBottomDeckIfDo: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "if-you-do",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "draw",
                count: 1,
                player: "controller",
              },
              {
                type: "create-token",
                token: "spellbane-aegis",
                controller: "controller",
              },
            ],
          },
        },
      },
    },
  },
);

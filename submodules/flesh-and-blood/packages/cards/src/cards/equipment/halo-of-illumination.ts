import { spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/halo-of-illumination.generated.ts";

export const haloOfIllumination = defineCard(
  fabCardIdentitiesByCanonicalId["phPFrDkRwGDrqrwq8M8T6"],
  {
    keywords: [spellvoid(2)],
    abilities: {
      instantDestroyHaloIlluminationPutFromHandIntoHero: {
        kind: "activated",
        abilityType: "instant",
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
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
              },
              to: {
                zone: "soul",
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    supertypes: ["Light"],
                  },
                },
              },
              then: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          ],
        },
      },
    },
  },
);

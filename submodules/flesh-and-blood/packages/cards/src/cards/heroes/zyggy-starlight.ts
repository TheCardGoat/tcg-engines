import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/zyggy-starlight.generated.ts";

export const zyggyStarlight = defineCard(fabCardIdentitiesByCanonicalId["pnwGDgknLbHc96Ghg8f67"], {
  abilities: {
    instantResourceResourceTapDestroyLightningFlowBanishAnotherLightningAuraPermanentNoHoloCountersReturnBanishedAuraArenaHoloCounter:
      {
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
            {
              class: "effect",
              type: "destroy",
              filter: {
                name: "Lightning Flow",
              },
            },
            {
              class: "effect",
              type: "banish",
              from: "arena",
              count: 1,
              filter: {
                typeBox: {
                  supertypes: ["Lightning"],
                  subtypes: ["Aura"],
                },
                lacksCounter: "holo",
              },
              outputBinding: "banished",
            },
          ],
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "banished",
              },
              to: {
                zone: "permanent",
              },
            },
            {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "holo",
              },
              count: 1,
              target: {
                selector: "binding",
                binding: "banished",
              },
            },
          ],
        },
      },
  },
});

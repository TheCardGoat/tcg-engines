import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soul-harvest.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const soulHarvest = definePitchFamily(fabPitchFamilies["soul-harvest"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Levia",
    },
  ],
  abilities: () => ({
    asAdditionalCostPlaySoulHarvestBanishNumber6FromGraveyardGainsNumber1: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 6,
          filter: {},
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "banished-this-way",
          filter: {
            hasKeyword: "blood-debt",
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    soulHarvestHitsHeroTheyBanishAllInTheirSoulLoseLife: {
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
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["soul"],
                count: {
                  type: "all",
                },
              },
              outputBinding: "it",
            },
            {
              type: "lose-life",
              amount: {
                type: "count",
                what: "banished-this-way",
              },
              target: {
                selector: "attack-target",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: soulHarvestBlue } = soulHarvest.cards;

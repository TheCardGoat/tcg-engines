import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soul-reaping.generated.ts";
import { goAgain, legendary } from "../shared/keywords.ts";

export const soulReaping = definePitchFamily(fabPitchFamilies["soul-reaping"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Chane",
    },
  ],
  abilities: () => ({
    banishNumber1MoreFromHandRatherThanPaySoulReapingSResource: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: {
            type: "any-number",
          },
          min: 1,
        },
        optional: true,
        then: {
          type: "gain-resources",
          amount: {
            type: "count",
            what: "banished-this-way",
            filter: {
              hasKeyword: "blood-debt",
            },
          },
        },
      },
    },
    whileSoulReapingAttackingHeroWithNumber1MoreInTheirSoulHas: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          {
            type: "has-status",
            status: "attacking",
          },
          {
            type: "zone-count",
            zone: "soul",
            player: "attack-target",
            comparison: {
              op: "gte",
              value: 1,
            },
          },
        ],
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const { red: soulReapingRed } = soulReaping.cards;

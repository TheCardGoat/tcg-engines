import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/invert-existence.generated.ts";

export const invertExistence = definePitchFamily(fabPitchFamilies["invert-existence"], {
  keywords: [bloodDebt],
  abilities: () => ({
    mayPlayInvertExistenceFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    banishUp2OpposingHeroSGraveyardIfAttack: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["graveyard"],
              count: {
                type: "up-to",
                amount: 2,
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                {
                  type: "compare-amount",
                  amount: {
                    type: "count",
                    what: "banished-this-way",
                    filter: attackActionFilter(),
                  },
                  comparison: { op: "gte", value: 1 },
                },
                {
                  type: "compare-amount",
                  amount: {
                    type: "count",
                    what: "banished-this-way",
                    filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
                  },
                  comparison: { op: "gte", value: 1 },
                },
              ],
            },
            then: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 2,
              target: {
                selector: "opponent",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: invertExistenceBlue } = invertExistence.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/system-failure.generated.ts";

export const systemFailure = definePitchFamily(fabPitchFamilies["system-failure"], {
  abilities: () => ({
    removeAllSteamCountersFromEquipmentItemWeaponNumber2MoreSteamCounters: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-all-counters",
            counter: {
              kind: "named",
              name: "steam",
            },
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["permanent"],
              filter: {
                or: [
                  {
                    typeBox: {
                      types: ["Equipment"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                  },
                  {
                    typeBox: {
                      types: ["Weapon"],
                    },
                  },
                ],
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: { type: "count", what: "counters-removed" },
              comparison: { op: "gte", value: 2 },
            },
            then: {
              type: "deal-damage",
              damageType: "generic",
              amount: 2,
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["hero"],
                filter: {
                  hasStatus: "controller-of-it",
                },
                count: 1,
              },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: systemFailureYellow } = systemFailure.cards;

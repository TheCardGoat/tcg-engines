import { defineSplitLayout } from "../../authoring/layouts.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/instants/null-shock.generated.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/null-shock.generated.ts";

export const nullShock = definePitchFamily(fabPitchFamilies["null-shock"], {
  layouts: {
    yellow: defineSplitLayout(fabCardIdentitiesByCanonicalId["JTrNBd8TcnPmB6KdDmjRN"], {
      left: {
        name: "Null",
        typeText: "Wizard Instant",
        types: ["Wizard", "Instant"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
        ],
        abilities: [
          {
            id: "ifTargetInstantHasCostLessThanTotalArcane",
            text: "",
            kind: "resolution",
            effect: {
              type: "negate",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "any",
                zones: ["stack"],
                filter: {
                  and: [
                    {
                      typeBox: {
                        types: ["Instant"],
                      },
                    },
                    {
                      numeric: [
                        {
                          property: "cost",
                          basis: "base",
                          comparison: {
                            op: "lt",
                            value: {
                              type: "count",
                              what: "damage-dealt",
                              damageType: "arcane",
                              per: "turn",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                count: 1,
              },
            },
          },
        ],
      },
      right: {
        name: "Shock",
        typeText: "Lightning Instant",
        types: ["Instant", "Lightning"],
        traits: [],
        text: "",
        keywords: [],
        abilities: [
          {
            id: "deal1ArcaneDamageAnyTarget",
            text: "",
            kind: "resolution",
            effect: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "object",
                declared: "on-stack",
                player: "any",
                zones: ["hero", "permanent"],
                count: 1,
              },
            },
          },
        ],
      },
    }),
  },
});

export const { yellow: nullShockYellow } = nullShock.cards;

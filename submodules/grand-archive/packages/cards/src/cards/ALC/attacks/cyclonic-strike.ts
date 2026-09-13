import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cyclonicStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3ir1o0qtb3",
  slug: "cyclonic-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3ir1o0qtb3:face:default",
      catalogId: "3ir1o0qtb3",
      name: "Cyclonic Strike",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] (0):  Suppress target ally you don't control. If you do, Cyclonic Strike gets -2 POWER. Activate this ability only once. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase. Activate this ability only while this card is in an intent.)",
      abilities: [
        {
          id: "3ir1o0qtb3-a1",
          kind: "activated",
          text: "[Class Bonus] (0):  Suppress target ally you don't control. If you do, Cyclonic Strike gets -2 POWER. Activate this ability only once. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase. Activate this ability only while this card is in an intent.)",
          activation: "ability",
          functionalZones: ["intent"],
          cost: {
            kind: "pay-reserve",
            amount: 0,
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "keyword-action",
                  action: "suppress",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "subtract",
                    amount: 2,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default cyclonicStrike;

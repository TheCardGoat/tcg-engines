import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const templarOfTheEternal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "peyG8Hfgqt",
  slug: "templar-of-the-eternal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "peyG8Hfgqt:face:default",
      catalogId: "peyG8Hfgqt",
      name: "Templar of the Eternal",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPIRIT"],
      },
      elements: ["CRUX"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Prevent all combat damage that would be dealt to Templar of the Eternal. \n\n[Class Bonus] (2), Return a regalia you control to its owner's material deck: Put a buff counter on Templar of the Eternal, and it gains spellshroud until end of turn.",
      abilities: [
        {
          id: "peyG8Hfgqt-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Prevent all combat damage that would be dealt to Templar of the Eternal.",
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
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
                combatDamage: true,
              },
              operation: {
                kind: "prevent",
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "peyG8Hfgqt-a2",
          kind: "activated",
          text: "[Class Bonus] (2), Return a regalia you control to its owner's material deck: Put a buff counter on Templar of the Eternal, and it gains spellshroud until end of turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "field",
                to: "material-deck",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
                relationship: "controlled-by",
              },
            ],
          },
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
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                amount: 1,
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "spellshroud",
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

export default templarOfTheEternal;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const galahadCourtKnight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eO5wsjwRyQ",
  slug: "galahad-court-knight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eO5wsjwRyQ:face:default",
      catalogId: "eO5wsjwRyQ",
      name: "Galahad, Court Knight",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "(Unique — You can control only one object with this card's name.)\n\n[Class Bonus] Galahad can attack using Sword weapons you control.",
      abilities: [
        {
          id: "eO5wsjwRyQ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Unique — You can control only one object with this card's name.)",
          keyword: {
            name: "unique",
          },
        },
        {
          id: "eO5wsjwRyQ-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Galahad can attack using Sword weapons you control.",
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
              kind: "rule-modification",
              mode: "allow",
              action: "use-weapon-for-attack",
              subject: {
                kind: "source",
              },
              using: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SWORD"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default galahadCourtKnight;

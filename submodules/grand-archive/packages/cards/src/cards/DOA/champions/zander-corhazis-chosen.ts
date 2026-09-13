import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zanderCorhazisChosen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gSNyXOQ4Iw",
  slug: "zander-corhazis-chosen",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gSNyXOQ4Iw:face:default",
      catalogId: "gSNyXOQ4Iw",
      name: "Zander, Corhazi's Chosen",
      lineageName: "Zander",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Zander Lineage (Zander, Corhazi's Chosen must be leveled from a previous level \"Zander\" champion.)\n\nOn Enter: Zander gains stealth and spellshroud until the beginning of your next turn. Put a preparation counter on Zander. (Units with spellshroud can't be targeted by Spells.)",
      abilities: [
        {
          id: "gSNyXOQ4Iw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Zander Lineage (Zander, Corhazi\'s Chosen must be leveled from a previous level "Zander" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Zander",
          },
        },
        {
          id: "gSNyXOQ4Iw-a2",
          kind: "triggered",
          text: "On Enter: Zander gains stealth and spellshroud until the beginning of your next turn. Put a preparation counter on Zander. (Units with spellshroud can't be targeted by Spells.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "until-start-of-turn",
                      whose: "controller",
                    },
                    layer: {
                      layer: "D",
                      modifies: "ability",
                    },
                    change: {
                      kind: "grant-keyword",
                      keyword: {
                        name: "stealth",
                      },
                    },
                  },
                  {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "until-start-of-turn",
                      whose: "controller",
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
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default zanderCorhazisChosen;

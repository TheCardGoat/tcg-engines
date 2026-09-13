import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const restorativeFlame: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ek7r2d7uz4",
  slug: "restorative-flame",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ek7r2d7uz4:face:default",
      catalogId: "ek7r2d7uz4",
      name: "Restorative Flame",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish up to three fire element cards from your graveyard. For each card banished this way, recover 2. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "ek7r2d7uz4-a1",
          kind: "card-resolution",
          text: "Banish up to three fire element cards from your graveyard. For each card banished this way, recover 2. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 3,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["FIRE"],
                    },
                  },
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "banished-cards",
                },
                bindEachAs: "that-card",
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default restorativeFlame;

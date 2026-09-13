import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manufactureCell: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wz9gv4vm4k",
  slug: "manufacture-cell",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wz9gv4vm4k:face:default",
      catalogId: "wz9gv4vm4k",
      name: "Manufacture Cell",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON", "CRAFT"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Summon a Powercell token rested. If you control an Automaton object, draw a card.",
      abilities: [
        {
          id: "wz9gv4vm4k-a1",
          kind: "card-resolution",
          text: "Summon a Powercell token rested. If you control an Automaton object, draw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Powercell",
                controller: "controller",
                bindResultAs: "summoned-token",
                entersWithStates: ["rested"],
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default manufactureCell;

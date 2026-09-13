import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fracturize: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cpvn96659y",
  slug: "fracturize",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cpvn96659y:face:default",
      catalogId: "cpvn96659y",
      name: "Fracturize",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target item or weapon becomes a Cleric Fractal phantasia with reservable and loses all other abilities. (This effect lasts indefinitely.)\n\nFloating Memory",
      abilities: [
        {
          id: "cpvn96659y-a1",
          kind: "card-resolution",
          text: "Target item or weapon becomes a Cleric Fractal phantasia with reservable and loses all other abilities. (This effect lasts indefinitely.)",
          targets: [
            {
              id: "target-object",
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
                filter: {
                  kind: "type",
                  oneOf: ["ITEM", "WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-object",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "set-types",
                  types: ["PHANTASIA"],
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-object",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "subtype",
                    value: "CLERIC",
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-object",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "subtype",
                    value: "FRACTAL",
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-object",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "remove-abilities",
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-object",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "reservable",
                  },
                },
              },
            ],
          },
        },
        {
          id: "cpvn96659y-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default fracturize;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windspireCrest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lzfkc8ntn4",
  slug: "windspire-crest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lzfkc8ntn4:face:default",
      catalogId: "lzfkc8ntn4",
      name: "Windspire Crest",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "[Diao Chan Bonus] (2), REST, Remove two glimmer counters from your champion: Put a buff counter on an ally you control.\n\n(4), Banish Windspire Crest: Draw a card.",
      abilities: [
        {
          id: "lzfkc8ntn4-a1",
          kind: "activated",
          text: "[Diao Chan Bonus] (2), REST, Remove two glimmer counters from your champion: Put a buff counter on an ally you control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "glimmer",
                },
                amount: 2,
              },
            ],
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
                player: "controller",
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
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "lzfkc8ntn4-a2",
          kind: "activated",
          text: "(4), Banish Windspire Crest: Draw a card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default windspireCrest;

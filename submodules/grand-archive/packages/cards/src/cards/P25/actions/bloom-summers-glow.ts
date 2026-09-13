import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bloomSummersGlow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a708z5ethq",
  slug: "bloom-summers-glow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a708z5ethq:face:default",
      catalogId: "a708z5ethq",
      name: "Bloom: Summer's Glow",
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
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Each opponent sacrifices all Flowerbuds. For each Flowerbud sacrificed this way, their controller summons your choice of a Lycoria or a Baihua token.\n\n[Element Bonus] (2), Discard this card from your hand: Empower 2. Draw a card.",
      abilities: [
        {
          id: "a708z5ethq-a1",
          kind: "card-resolution",
          text: "[Class Bonus] Each opponent sacrifices all Flowerbuds. For each Flowerbud sacrificed this way, their controller summons your choice of a Lycoria or a Baihua token.",
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
                kind: "sacrifice",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "each-opponent",
                    filter: {
                      kind: "subtype",
                      oneOf: ["FLOWERBUD"],
                    },
                  },
                },
                bindResultAs: "sacrificed-objects",
              },
              {
                kind: "for-each",
                collection: {
                  binding: "sacrificed-objects",
                  filter: {
                    kind: "subtype",
                    oneOf: ["FLOWERBUD"],
                  },
                },
                bindEachAs: "sacrificed-object",
                effect: {
                  kind: "summon-one-of",
                  chooser: "controller",
                  controller: {
                    controllerOf: "sacrificed-object",
                  },
                  objects: ["Lycoria", "Baihua"],
                },
              },
            ],
          },
        },
        {
          id: "a708z5ethq-a2",
          kind: "activated",
          text: "[Element Bonus] (2), Discard this card from your hand: Empower 2. Draw a card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "discard-self",
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "empower",
                amount: 2,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default bloomSummersGlow;

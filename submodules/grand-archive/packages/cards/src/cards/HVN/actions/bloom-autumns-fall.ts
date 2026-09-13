import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bloomAutumnsFall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pebu7agtcd",
  slug: "bloom-autumns-fall",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pebu7agtcd:face:default",
      catalogId: "pebu7agtcd",
      name: "Bloom: Autumn's Fall",
      cost: {
        kind: "reserve",
        amount: 3,
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
        "[Class Bonus] Each opponent sacrifices all Flowerbuds. For each Flowerbud sacrificed this way, their controller summons your choice of an Acerbica or a Washuru token.\n\n[Element Bonus] (2), Discard this card from your hand: Empower 2. Draw a card.",
      abilities: [
        {
          id: "pebu7agtcd-a1",
          kind: "card-resolution",
          text: "[Class Bonus] Each opponent sacrifices all Flowerbuds. For each Flowerbud sacrificed this way, their controller summons your choice of an Acerbica or a Washuru token.",
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
                  objects: ["Acerbica", "Washuru"],
                },
              },
            ],
          },
        },
        {
          id: "pebu7agtcd-a2",
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

export default bloomAutumnsFall;

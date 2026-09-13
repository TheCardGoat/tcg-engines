import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const invigoratingConcoction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nsjukk5zk4",
  slug: "invigorating-concoction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nsjukk5zk4:face:default",
      catalogId: "nsjukk5zk4",
      name: "Invigorating Concoction",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Brew — One Flower, One Herb (You may sacrifice the listed objects rather than pay this card's reserve cost.)\n\nHindered (This object enters the field rested.)\n\nREST, Sacrifice Invigorating Concoction: Put two buff counters on up to one target ally. Draw a card.",
      abilities: [
        {
          id: "nsjukk5zk4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Flower, One Herb (You may sacrifice the listed objects rather than pay this card's reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Flower",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Herb",
                count: 1,
              },
            ],
          },
        },
        {
          id: "nsjukk5zk4-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "nsjukk5zk4-a3",
          kind: "activated",
          text: "REST, Sacrifice Invigorating Concoction: Put two buff counters on up to one target ally. Draw a card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
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
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "buff",
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

export default invigoratingConcoction;

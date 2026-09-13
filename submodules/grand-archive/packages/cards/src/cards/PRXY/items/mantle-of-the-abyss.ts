import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mantleOfTheAbyss: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1ubrwubSQN",
  slug: "mantle-of-the-abyss",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1ubrwubSQN:face:default",
      catalogId: "1ubrwubSQN",
      name: "Mantle of the Abyss",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ROBE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Alice Bonus] You may sacrifice a Specter ally to activate this card from your material deck.\n\n[Alice Bonus] (3), Banish Mantle of the Abyss: Generate a Rile the Abyss card and put it into your memory.",
      abilities: [
        {
          id: "1ubrwubSQN-a1",
          kind: "card-resolution",
          text: "[Alice Bonus] You may sacrifice a Specter ally to activate this card from your material deck.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "sacrificed-object",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SPECTER"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "sacrifice",
                subject: {
                  kind: "bound",
                  binding: "sacrificed-object",
                },
              },
            },
          },
        },
        {
          id: "1ubrwubSQN-a2",
          kind: "activated",
          text: "[Alice Bonus] (3), Banish Mantle of the Abyss: Generate a Rile the Abyss card and put it into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "generate",
            card: "Rile the Abyss",
            player: "controller",
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default mantleOfTheAbyss;

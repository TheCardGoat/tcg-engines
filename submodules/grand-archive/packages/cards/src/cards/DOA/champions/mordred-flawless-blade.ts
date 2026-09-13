import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mordredFlawlessBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WI2owxIw0z",
  slug: "mordred-flawless-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WI2owxIw0z:face:default",
      catalogId: "WI2owxIw0z",
      name: "Mordred, Flawless Blade",
      lineageName: "Mordred",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 24,
      },
      rulesText:
        "Attack cards in your graveyard have floating memory. (While paying for a memory cost, you may banish a card with floating memory from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "WI2owxIw0z-a1",
          kind: "static",
          staticKind: "effects",
          text: "Attack cards in your graveyard have floating memory. (While paying for a memory cost, you may banish a card with floating memory from your graveyard to pay for 1 of that cost.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ATTACK"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "floating-memory",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default mordredFlawlessBlade;

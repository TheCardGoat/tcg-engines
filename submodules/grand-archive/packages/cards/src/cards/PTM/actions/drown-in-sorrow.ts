import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const drownInSorrow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vA5ZmzZL9I",
  slug: "drown-in-sorrow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vA5ZmzZL9I:face:default",
      catalogId: "vA5ZmzZL9I",
      name: "Drown in Sorrow",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Recover 1 and put a haunt counter on your Phantasmagoria. \n\n[Alice Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "vA5ZmzZL9I-a1",
          kind: "card-resolution",
          text: "Recover 1 and put a haunt counter on your Phantasmagoria.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 1,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "name",
                      value: "Phantasmagoria",
                    },
                  },
                },
                counter: {
                  named: "haunt",
                },
                amount: 1,
              },
            ],
          },
        },
        {
          id: "vA5ZmzZL9I-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
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
        },
      ],
    },
  },
};

export default drownInSorrow;

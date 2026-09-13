import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const varuckanSoulknife: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9ox7u6wzh9",
  slug: "varuckan-soulknife",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9ox7u6wzh9:face:default",
      catalogId: "9ox7u6wzh9",
      name: "Varuckan Soulknife",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] [Element Bonus] You may banish three fire element cards from your graveyard to activate this card from your material deck.\n\n[Class Bonus] On Kill: Put a card named Varuckan Soulknife from your banishment into your material deck.",
      abilities: [
        {
          id: "9ox7u6wzh9-a1",
          kind: "card-resolution",
          text: "[Class Bonus] [Element Bonus] You may banish three fire element cards from your graveyard to activate this card from your material deck.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "banished-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 3,
                },
                candidates: {
                  kind: "card",
                  zones: ["material-deck"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
              },
            },
          },
        },
        {
          id: "9ox7u6wzh9-a2",
          kind: "triggered",
          text: "[Class Bonus] On Kill: Put a card named Varuckan Soulknife from your banishment into your material deck.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "choose",
            selection: {
              id: "chosen-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "name",
                  value: "Varuckan Soulknife",
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "chosen-card",
              },
              from: "banishment",
              destination: {
                zone: "material-deck",
              },
            },
          },
        },
      ],
    },
  },
};

export default varuckanSoulknife;

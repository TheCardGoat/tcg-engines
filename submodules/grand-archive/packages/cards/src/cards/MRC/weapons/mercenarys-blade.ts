import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mercenarysBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k0xhi5jnsl",
  slug: "mercenarys-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k0xhi5jnsl:face:default",
      catalogId: "k0xhi5jnsl",
      name: "Mercenary's Blade",
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
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] You may remove a preparation counter from your champion to activate this card from your material deck. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "k0xhi5jnsl-a1",
          kind: "card-resolution",
          text: "[Class Bonus] You may remove a preparation counter from your champion to activate this card from your material deck. (Apply this effect only if your champion’s class matches this card’s class.)",
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
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "remove-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: "preparation",
              amount: 1,
              bindResultAs: "removed-counters",
            },
          },
        },
      ],
    },
  },
};

export default mercenarysBlade;

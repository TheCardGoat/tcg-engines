import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sparkLink: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PUgqk3lxq6",
  slug: "spark-link",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PUgqk3lxq6:face:default",
      catalogId: "PUgqk3lxq6",
      name: "Spark Link",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Each player draws a card into their memory.\n\n[Level 1+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "PUgqk3lxq6-a1",
          kind: "card-resolution",
          text: "Each player draws a card into their memory.",
          effect: {
            kind: "draw",
            player: "each-player",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "PUgqk3lxq6-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 1+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default sparkLink;

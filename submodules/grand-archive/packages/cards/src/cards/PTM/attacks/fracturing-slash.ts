import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fracturingSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vproiWE55M",
  slug: "fracturing-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vproiWE55M:face:default",
      catalogId: "vproiWE55M",
      name: "Fracturing Slash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Merlin Bonus] On Attack:  You may move up to three sheen counters from among units on the field onto the defender. \n",
      abilities: [
        {
          id: "vproiWE55M-a1",
          kind: "triggered",
          text: "[Merlin Bonus] On Attack:  You may move up to three sheen counters from among units on the field onto the defender.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "move-counters-from-collection",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              to: {
                kind: "event-recipient",
              },
              counter: {
                named: "sheen",
              },
              count: {
                kind: "up-to",
                amount: 3,
              },
              chooser: "controller",
            },
          },
        },
      ],
    },
  },
};

export default fracturingSlash;

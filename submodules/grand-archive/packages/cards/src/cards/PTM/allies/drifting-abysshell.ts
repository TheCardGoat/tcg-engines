import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const driftingAbysshell: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cDp9Ap6ASE",
  slug: "drifting-abysshell",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cDp9Ap6ASE:face:default",
      catalogId: "cDp9Ap6ASE",
      name: "Drifting Abysshell",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPECTER", "ANIMAL", "TURTLE"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText: "[Alice Bonus] On Enter: Put a haunt counter on your Phantasmagoria.",
      abilities: [
        {
          id: "cDp9Ap6ASE-a1",
          kind: "triggered",
          text: "[Alice Bonus] On Enter: Put a haunt counter on your Phantasmagoria.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
                name: "Alice",
              },
            },
          ],
          effect: {
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
        },
      ],
    },
  },
};

export default driftingAbysshell;

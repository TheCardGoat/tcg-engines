import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialSpy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l6gt7lh9v2",
  slug: "imperial-spy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l6gt7lh9v2:face:default",
      catalogId: "l6gt7lh9v2",
      name: "Imperial Spy",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)\n\nOn Kill: Put a preparation counter on your champion.",
      abilities: [
        {
          id: "l6gt7lh9v2-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
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
        },
        {
          id: "l6gt7lh9v2-a2",
          kind: "triggered",
          text: "On Kill: Put a preparation counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default imperialSpy;

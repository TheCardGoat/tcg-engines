import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fortification: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6FGKeLTumW",
  slug: "fortification",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6FGKeLTumW:face:default",
      catalogId: "6FGKeLTumW",
      name: "Fortification",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a bulwark counter on target ally or Siegeable domain. (If combat damage would be dealt to an object with any bulwark counters on it, remove one and prevent that damage instead.)\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "6FGKeLTumW-a1",
          kind: "card-resolution",
          text: "Put a bulwark counter on target ally or Siegeable domain. (If combat damage would be dealt to an object with any bulwark counters on it, remove one and prevent that damage instead.)",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "bulwark",
            amount: 1,
          },
        },
        {
          id: "6FGKeLTumW-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default fortification;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poweredArmsmaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fpvw2ifz1n",
  slug: "powered-armsmaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fpvw2ifz1n:face:default",
      catalogId: "fpvw2ifz1n",
      name: "Powered Armsmaster",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Ranged 3\n\n[Class Bonus] Whenever you sacrifice a Powercell, Powered Armsmaster becomes distant.\n\nOn Death: Summon a Powercell token.",
      abilities: [
        {
          id: "fpvw2ifz1n-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 3",
          keyword: {
            name: "ranged",
            value: 3,
          },
        },
        {
          id: "fpvw2ifz1n-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you sacrifice a Powercell, Powered Armsmaster becomes distant.",
          trigger: {
            kind: "event",
            event: {
              name: "object-sacrificed",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
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
            kind: "set-object-state",
            subject: {
              kind: "source",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "fpvw2ifz1n-a3",
          kind: "triggered",
          text: "On Death: Summon a Powercell token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default poweredArmsmaster;

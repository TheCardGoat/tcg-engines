import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const moonveilAndroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c34iTVRS8h",
  slug: "moonveil-android",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c34iTVRS8h:face:default",
      catalogId: "c34iTVRS8h",
      name: "Moonveil Android",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "CLERIC"],
        subtypes: ["ASSASSIN", "CLERIC", "AUTOMATON"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Whenever you glimpse, Moonveil Android gains stealth until end of turn. \n\n[Class Bonus] Whenever you negate a card activation an opponent controls, put two buff counters on Moonveil Android.",
      abilities: [
        {
          id: "c34iTVRS8h-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever you glimpse, Moonveil Android gains stealth until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "glimpse",
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
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "stealth",
              },
            },
          },
        },
        {
          id: "c34iTVRS8h-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you negate a card activation an opponent controls, put two buff counters on Moonveil Android.",
          trigger: {
            kind: "event",
            event: {
              name: "stack-item-negated",
              actor: "controller",
              itemTypes: ["card-activation"],
              controller: "opponent",
              subject: {
                kind: "event-object",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default moonveilAndroid;

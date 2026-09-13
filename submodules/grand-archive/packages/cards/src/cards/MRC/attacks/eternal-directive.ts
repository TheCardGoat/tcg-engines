import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eternalDirective: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WRDbeFfnar",
  slug: "eternal-directive",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WRDbeFfnar:face:default",
      catalogId: "WRDbeFfnar",
      name: "Eternal Directive",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "AUTOMATON", "COMMAND"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
      },
      rulesText:
        "Command Automaton (An Automaton ally you control performs this attack.)\n\n[Class Bonus] On Attack: Put a buff counter on the attacker.",
      abilities: [
        {
          id: "WRDbeFfnar-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Automaton (An Automaton ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Automaton",
          },
        },
        {
          id: "WRDbeFfnar-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Put a buff counter on the attacker.",
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
              kind: "event-attacker",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default eternalDirective;

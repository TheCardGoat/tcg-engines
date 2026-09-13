import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tempusStalker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xp6qqi6vwf",
  slug: "tempus-stalker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xp6qqi6vwf:face:default",
      catalogId: "xp6qqi6vwf",
      name: "Tempus Stalker",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "TIGER"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Pride 2 (This ally won’t obey you unless your champion is level 2 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)\n\n[Class Bonus] At the beginning of your recollection phase, put a buff counter on Tempus Stalker. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "xp6qqi6vwf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 2 (This ally won’t obey you unless your champion is level 2 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)",
          keyword: {
            name: "pride",
            value: 2,
          },
        },
        {
          id: "xp6qqi6vwf-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, put a buff counter on Tempus Stalker. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
            amount: 1,
          },
        },
      ],
    },
  },
};

export default tempusStalker;

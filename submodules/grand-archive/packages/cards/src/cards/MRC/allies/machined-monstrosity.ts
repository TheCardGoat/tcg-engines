import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const machinedMonstrosity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "214upufooz",
  slug: "machined-monstrosity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "214upufooz:face:default",
      catalogId: "214upufooz",
      name: "Machined Monstrosity",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "AUTOMATON", "BEAST"],
      },
      elements: ["NORM"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "Pride 4 (This ally won’t obey you unless your champion is level 4 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)\n\n[Class Bonus] On Death: Summon a Powercell token rested.",
      abilities: [
        {
          id: "214upufooz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 4 (This ally won’t obey you unless your champion is level 4 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)",
          keyword: {
            name: "pride",
            value: 4,
          },
        },
        {
          id: "214upufooz-a2",
          kind: "triggered",
          text: "[Class Bonus] On Death: Summon a Powercell token rested.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
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
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default machinedMonstrosity;

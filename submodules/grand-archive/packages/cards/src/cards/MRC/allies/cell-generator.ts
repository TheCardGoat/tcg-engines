import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellGenerator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zihslnhzj4",
  slug: "cell-generator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zihslnhzj4:face:default",
      catalogId: "zihslnhzj4",
      name: "Cell Generator",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.) \n\n[Class Bonus] On Foster: Summon two Powercell tokens rested.",
      abilities: [
        {
          id: "zihslnhzj4-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "zihslnhzj4-a2",
          kind: "triggered",
          text: "[Class Bonus] On Foster: Summon two Powercell tokens rested.",
          trigger: {
            kind: "event",
            event: {
              name: "object-fostered",
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
            amount: 2,
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default cellGenerator;

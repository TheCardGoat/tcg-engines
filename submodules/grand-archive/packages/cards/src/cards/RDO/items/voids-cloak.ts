import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const voidsCloak: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wqpsErSeFn",
  slug: "voids-cloak",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wqpsErSeFn:face:default",
      catalogId: "wqpsErSeFn",
      name: "Void's Cloak",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText: "You have spellshroud. (A player with spellshroud can't be targeted by Spells.)",
      abilities: [
        {
          id: "wqpsErSeFn-a1",
          kind: "static",
          staticKind: "effects",
          text: "You have spellshroud. (A player with spellshroud can't be targeted by Spells.)",
          effects: [
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "spellshroud",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default voidsCloak;

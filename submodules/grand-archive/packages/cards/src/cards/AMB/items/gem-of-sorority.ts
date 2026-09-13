import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gemOfSorority: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4dys05p49w",
  slug: "gem-of-sorority",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4dys05p49w:face:default",
      catalogId: "4dys05p49w",
      name: "Gem of Sorority",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Gem of Sorority: Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.) ",
      abilities: [
        {
          id: "4dys05p49w-a1",
          kind: "activated",
          text: "Banish Gem of Sorority: Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default gemOfSorority;

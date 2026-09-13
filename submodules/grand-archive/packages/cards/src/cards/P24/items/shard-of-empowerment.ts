import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shardOfEmpowerment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qqq8j5fxym",
  slug: "shard-of-empowerment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qqq8j5fxym:face:default",
      catalogId: "qqq8j5fxym",
      name: "Shard of Empowerment",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Shard of Empowerment: Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.) ",
      abilities: [
        {
          id: "qqq8j5fxym-a1",
          kind: "activated",
          text: "Banish Shard of Empowerment: Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
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

export default shardOfEmpowerment;

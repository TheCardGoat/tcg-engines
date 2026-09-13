import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gossamerStaff: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gyk90s0hst",
  slug: "gossamer-staff",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gyk90s0hst:face:default",
      catalogId: "gyk90s0hst",
      name: "Gossamer Staff",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "STAFF"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(1), REST: Empower 1. (The next Spell card you activate this turn activates and resolves as if your champion got +1 level.) ",
      abilities: [
        {
          id: "gyk90s0hst-a1",
          kind: "activated",
          text: "(1), REST: Empower 1. (The next Spell card you activate this turn activates and resolves as if your champion got +1 level.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default gossamerStaff;

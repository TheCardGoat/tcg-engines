import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const oathbreakersJustice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f5ooozsikp",
  slug: "oathbreakers-justice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f5ooozsikp:face:default",
      catalogId: "f5ooozsikp",
      name: "Oathbreaker's Justice",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "MAUL"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        durability: 2,
      },
      rulesText: "As an additional cost to use this weapon for an attack, pay (3).",
      abilities: [
        {
          id: "f5ooozsikp-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to use this weapon for an attack, pay (3).",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "use-weapon-for-attack",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "pay-reserve",
                amount: 3,
              },
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

export default oathbreakersJustice;

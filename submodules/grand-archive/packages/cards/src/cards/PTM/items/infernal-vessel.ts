import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const infernalVessel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vgWgu1DUYv",
  slug: "infernal-vessel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vgWgu1DUYv:face:default",
      catalogId: "vgWgu1DUYv",
      name: "Infernal Vessel",
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
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "If a player would recover an amount, they recover X instead, where X is that amount minus 3. (If a player would recover 0 or less, they don't recover.)",
      abilities: [
        {
          id: "vgWgu1DUYv-a1",
          kind: "static",
          staticKind: "effects",
          text: "If a player would recover an amount, they recover X instead, where X is that amount minus 3. (If a player would recover 0 or less, they don't recover.)",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "player-recovered",
              },
              operation: {
                kind: "modify-amount",
                operation: "subtract",
                amount: 3,
                minimumResult: 0,
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

export default infernalVessel;

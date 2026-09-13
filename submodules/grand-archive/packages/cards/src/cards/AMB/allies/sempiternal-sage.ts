import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sempiternalSage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zmoegdo111",
  slug: "sempiternal-sage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zmoegdo111:face:default",
      catalogId: "zmoegdo111",
      name: "Sempiternal Sage",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Preserve (When this ally dies, put it into its owner's material deck preserved. As you materialize, you may instead return a preserved card to your hand.)\n\n[Class Bonus] On Attack: You may recover 3. If you don't, empower 3.",
      abilities: [
        {
          id: "zmoegdo111-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Preserve (When this ally dies, put it into its owner's material deck preserved. As you materialize, you may instead return a preserved card to your hand.)",
          keyword: {
            name: "preserve",
          },
        },
        {
          id: "zmoegdo111-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may recover 3. If you don't, empower 3.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "recover",
              player: "controller",
              amount: 3,
            },
            otherwise: {
              kind: "keyword-action",
              action: "empower",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default sempiternalSage;

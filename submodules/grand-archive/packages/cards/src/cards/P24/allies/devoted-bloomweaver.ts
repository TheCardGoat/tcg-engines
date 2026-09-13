import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const devotedBloomweaver: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yqm3l6lbns",
  slug: "devoted-bloomweaver",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yqm3l6lbns:face:default",
      catalogId: "yqm3l6lbns",
      name: "Devoted Bloomweaver",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Preserve (When this ally dies, put it into its owner's material deck preserved. As you materialize, you may instead return a preserved card to your hand.)\n\n[Class Bonus] On Enter: Empower 2.",
      abilities: [
        {
          id: "yqm3l6lbns-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Preserve (When this ally dies, put it into its owner's material deck preserved. As you materialize, you may instead return a preserved card to your hand.)",
          keyword: {
            name: "preserve",
          },
        },
        {
          id: "yqm3l6lbns-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Empower 2.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "keyword-action",
            action: "empower",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default devotedBloomweaver;

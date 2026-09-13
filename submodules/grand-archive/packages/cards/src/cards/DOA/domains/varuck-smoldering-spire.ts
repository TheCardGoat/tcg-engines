import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const varuckSmolderingSpire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IyM7IBCQeb",
  slug: "varuck-smoldering-spire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IyM7IBCQeb:face:default",
      catalogId: "IyM7IBCQeb",
      name: "Varuck, Smoldering Spire",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CASTLE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Upkeep — Whenever you materialize a card, sacrifice Varuck.\n\nDamage dealt by fire element sources you control can't be prevented.",
      abilities: [
        {
          id: "IyM7IBCQeb-a1",
          kind: "triggered",
          text: "Upkeep — Whenever you materialize a card, sacrifice Varuck.",
          trigger: {
            kind: "event",
            event: {
              name: "card-materialized",
              actor: "controller",
              subject: {
                kind: "event-object",
              },
            },
          },
          effect: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          label: {
            name: "Upkeep",
          },
        },
        {
          id: "IyM7IBCQeb-a2",
          kind: "static",
          staticKind: "effects",
          text: "Damage dealt by fire element sources you control can't be prevented.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "prevent-damage",
              against: {
                kind: "each",
                collection: {
                  zones: ["field", "effects-stack"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
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

export default varuckSmolderingSpire;

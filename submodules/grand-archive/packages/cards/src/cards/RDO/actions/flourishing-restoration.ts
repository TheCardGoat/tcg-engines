import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flourishingRestoration: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "alnjt7DyZL",
  slug: "flourishing-restoration",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "alnjt7DyZL:face:default",
      catalogId: "alnjt7DyZL",
      name: "Flourishing Restoration",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Diao Chan Bonus] You may ignore this card's elemental requirements as you activate it. If you do, it costs 2 more to activate.\n\nRecover 3. Then for each of up to two allies you don't control, recover 3 again.",
      abilities: [
        {
          id: "alnjt7DyZL-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Diao Chan Bonus] You may ignore this card's elemental requirements as you activate it. If you do, it costs 2 more to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "pay-reserve",
                amount: 2,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "alnjt7DyZL-a2",
          kind: "card-resolution",
          text: "Recover 3. Then for each of up to two allies you don't control, recover 3 again.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 3,
              },
              {
                kind: "choose",
                selection: {
                  id: "opposing-allies",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  candidates: {
                    kind: "object",
                    zones: ["field"],
                    relationship: "controlled-by",
                    player: "each-opponent",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                effect: {
                  kind: "for-each",
                  collection: {
                    binding: "opposing-allies",
                  },
                  bindEachAs: "chosen-opposing-ally",
                  effect: {
                    kind: "recover",
                    player: "controller",
                    amount: 3,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default flourishingRestoration;

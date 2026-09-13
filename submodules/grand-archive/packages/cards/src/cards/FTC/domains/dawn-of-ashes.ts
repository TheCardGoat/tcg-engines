import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dawnOfAshes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4coy34bro8",
  slug: "dawn-of-ashes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4coy34bro8:face:default",
      catalogId: "4coy34bro8",
      name: "Dawn of Ashes",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CATACLYSM"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Upkeep — At the beginning of your recollection phase, reveal a card at random from your memory. If that card is not norm element, sacrifice Dawn of Ashes.\n\nNon-norm element cards cost 1 more to activate.",
      abilities: [
        {
          id: "4coy34bro8-a1",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, reveal a card at random from your memory. If that card is not norm element, sacrifice Dawn of Ashes.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "reveal-selection",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                  method: "random",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "reveal-selection",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["NORM"],
                  },
                },
                then: {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
              },
            ],
          },
          label: {
            name: "Upkeep",
          },
        },
        {
          id: "4coy34bro8-a2",
          kind: "static",
          staticKind: "effects",
          text: "Non-norm element cards cost 1 more to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              filter: {
                kind: "not",
                filter: {
                  kind: "element",
                  oneOf: ["NORM"],
                },
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 1,
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

export default dawnOfAshes;

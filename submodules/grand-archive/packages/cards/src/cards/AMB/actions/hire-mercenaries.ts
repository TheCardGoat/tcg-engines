import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hireMercenaries: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8swok9u930",
  slug: "hire-mercenaries",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8swok9u930:face:default",
      catalogId: "8swok9u930",
      name: "Hire Mercenaries",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "This card costs 1 less to activate if an opponent controls one or more allies.\n\nLook at the top two cards of your deck. Put one of those cards into your memory and the other on the bottom of your deck.",
      abilities: [
        {
          id: "8swok9u930-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to activate if an opponent controls one or more allies.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "8swok9u930-a2",
          kind: "card-resolution",
          text: "Look at the top two cards of your deck. Put one of those cards into your memory and the other on the bottom of your deck.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "chosen-card",
                  },
                  destination: {
                    zone: "memory",
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "binding-remainder",
                  binding: "referenced-cards",
                  excluding: "chosen-card",
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    orderChosenBy: "controller",
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

export default hireMercenaries;

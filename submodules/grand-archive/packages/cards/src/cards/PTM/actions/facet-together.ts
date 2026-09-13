import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const facetTogether: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XmsEbk19Iu",
  slug: "facet-together",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XmsEbk19Iu:face:default",
      catalogId: "XmsEbk19Iu",
      name: "Facet Together",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN", "WARRIOR"],
        subtypes: ["ASSASSIN", "WARRIOR", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent's turn.\n\nSacrifice any amount of Memorite objects. Target weapon you control gets +X POWER until the end of your next turn, where X is the amount of objects sacrificed this way. Then put X sheen counters on your Fractured Memories.",
      abilities: [
        {
          id: "XmsEbk19Iu-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's turn.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "turn-player",
                player: "opponent",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "XmsEbk19Iu-a2",
          kind: "card-resolution",
          text: "Sacrifice any amount of Memorite objects. Target weapon you control gets +X POWER until the end of your next turn, where X is the amount of objects sacrificed this way. Then put X sheen counters on your Fractured Memories.",
          targets: [
            {
              id: "target-weapon",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["WEAPON"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "objects-sacrificed",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "sacrificed-memorites",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["MEMORITE"],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "bound",
                    binding: "sacrificed-memorites",
                  },
                  bindResultAs: "sacrificed-memorites-result",
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-weapon",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "until-end-of-next-turn",
                    whose: "controller",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: {
                      kind: "modified-ability-result-amount",
                      metric: "objects-sacrificed",
                    },
                  },
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "mastery",
                    player: "controller",
                    name: "Fractured Memories",
                  },
                  counter: {
                    named: "sheen",
                  },
                  amount: {
                    kind: "modified-ability-result-amount",
                    metric: "objects-sacrificed",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default facetTogether;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seethingIntercession: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5Xfg69S1XX",
  slug: "seething-intercession",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5Xfg69S1XX:face:default",
      catalogId: "5Xfg69S1XX",
      name: "Seething Intercession",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish the top three cards of your deck. For as long as they're banished, you may activate them. As an additional cost to activate each of those cards, deal 2 unpreventable damage to your champion.\n\n[Jin Bonus] If your influence is four or less, the next three cards you activate from banishment this turn cost 1 less to activate.",
      abilities: [
        {
          id: "5Xfg69S1XX-a1",
          kind: "card-resolution",
          text: "Banish the top three cards of your deck. For as long as they're banished, you may activate them. As an additional cost to activate each of those cards, deal 2 unpreventable damage to your champion.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "banished-top-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 3,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "banished-top-cards",
                  },
                  from: "main-deck",
                  destination: {
                    zone: "banishment",
                  },
                },
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "activate",
                subject: {
                  kind: "bound",
                  binding: "banished-top-cards",
                },
                duration: {
                  kind: "while-subjects-in-zone",
                  subjects: {
                    kind: "bound",
                    binding: "banished-top-cards",
                  },
                  zone: "banishment",
                  scope: "per-object",
                },
              },
              {
                kind: "rule-modification",
                mode: "add-cost",
                action: "activate",
                subject: {
                  kind: "bound",
                  binding: "banished-top-cards",
                },
                cost: {
                  kind: "take-damage",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: 2,
                  preventable: false,
                },
                duration: {
                  kind: "while-subjects-in-zone",
                  subjects: {
                    kind: "bound",
                    binding: "banished-top-cards",
                  },
                  zone: "banishment",
                  scope: "per-object",
                },
              },
            ],
          },
        },
        {
          id: "5Xfg69S1XX-a2",
          kind: "card-resolution",
          text: "[Jin Bonus] If your influence is four or less, the next three cards you activate from banishment this turn cost 1 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "player-property",
                  player: "controller",
                  property: "influence",
                },
                operator: "lte",
                right: 4,
              },
            },
            then: {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              fromZone: "banishment",
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              occurrence: {
                count: 3,
                window: "this-turn",
                actorScope: "same-player",
              },
              duration: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default seethingIntercession;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const naiaDivinerOfFortunes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jdmthh88rx",
  slug: "naia-diviner-of-fortunes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jdmthh88rx:face:default",
      catalogId: "jdmthh88rx",
      name: "Naia, Diviner of Fortunes",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Reveal the top three cards from your deck. Banish one of those cards and put the rest into your graveyard. If the banished card is a Spell card, you may activate it as long as you control Naia.",
      abilities: [
        {
          id: "jdmthh88rx-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Reveal the top three cards from your deck. Banish one of those cards and put the rest into your graveyard. If the banished card is a Spell card, you may activate it as long as you control Naia.",
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
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 3,
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
                  id: "banished-card",
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
                    binding: "revealed-cards",
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "banished-card",
                  },
                  from: "main-deck",
                  destination: {
                    zone: "banishment",
                  },
                  bindResultAs: "banished-card",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "binding-remainder",
                  binding: "revealed-cards",
                  excluding: "banished-card",
                },
                from: "main-deck",
                destination: {
                  zone: "graveyard",
                },
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "activate",
                subject: {
                  kind: "bound",
                  binding: "banished-card",
                },
                fromZone: "banishment",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "banished-card",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["SPELL"],
                  },
                },
                duration: {
                  kind: "while-source-on-field",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default naiaDivinerOfFortunes;

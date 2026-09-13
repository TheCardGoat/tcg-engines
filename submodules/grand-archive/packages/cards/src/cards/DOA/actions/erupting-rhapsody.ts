import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eruptingRhapsody: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dBAdWMoPEz",
  slug: "erupting-rhapsody",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dBAdWMoPEz:face:default",
      catalogId: "dBAdWMoPEz",
      name: "Erupting Rhapsody",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL", "HARMONY"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Banish any amount of fire element cards from your graveyard. Your champion gets +1 level until end of turn for each card banished this way.\n\nHarmonize — If you've activated a Melody card this turn, choose any amount of units and deal LV damage split among them.",
      abilities: [
        {
          id: "dBAdWMoPEz-a1",
          kind: "card-resolution",
          text: "Banish any amount of fire element cards from your graveyard. Your champion gets +1 level until end of turn for each card banished this way.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["FIRE"],
                    },
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "level",
                  operation: "add",
                  amount: {
                    kind: "modified-ability-result-amount",
                    metric: "cards-moved",
                  },
                },
              },
            ],
          },
        },
        {
          id: "dBAdWMoPEz-a2",
          kind: "card-resolution",
          text: "Harmonize — If you've activated a Melody card this turn, choose any amount of units and deal LV damage split among them.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["MELODY"],
              },
              minimum: 1,
            },
            then: {
              kind: "distribute",
              amount: {
                kind: "property",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                property: "level",
                basis: "current",
              },
              among: {
                id: "damage-recipients",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "any-number",
                },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
              payload: {
                kind: "damage",
                source: {
                  kind: "source",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default eruptingRhapsody;

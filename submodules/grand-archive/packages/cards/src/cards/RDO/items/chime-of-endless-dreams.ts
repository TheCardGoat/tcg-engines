import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chimeOfEndlessDreams: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6VOzmfit0I",
  slug: "chime-of-endless-dreams",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6VOzmfit0I:face:default",
      catalogId: "6VOzmfit0I",
      name: "Chime of Endless Dreams",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "Hindered\n\nYou don't lose the game for drawing cards while having no cards in your deck.\n\nREST, Banish Chime of Endless Dreams: Shuffle all cards in your graveyard into your deck.",
      abilities: [
        {
          id: "6VOzmfit0I-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "6VOzmfit0I-a2",
          kind: "static",
          staticKind: "effects",
          text: "You don't lose the game for drawing cards while having no cards in your deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "lose-game",
              subject: {
                kind: "player",
                player: "controller",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["main-deck"],
                      player: "controller",
                    },
                  },
                  operator: "eq",
                  right: 0,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "6VOzmfit0I-a3",
          kind: "activated",
          text: "REST, Banish Chime of Endless Dreams: Shuffle all cards in your graveyard into your deck.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "graveyard-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "graveyard-cards",
                  },
                  from: "graveyard",
                  destination: {
                    zone: "main-deck",
                  },
                },
              },
              {
                kind: "shuffle",
                player: "controller",
                zone: "main-deck",
              },
            ],
          },
        },
      ],
    },
  },
};

export default chimeOfEndlessDreams;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mistboundCutthroat: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "C7zFV2K7bL",
  slug: "mistbound-cutthroat",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "C7zFV2K7bL:face:default",
      catalogId: "C7zFV2K7bL",
      name: "Mistbound Cutthroat",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SELKIE"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
        life: 1,
      },
      rulesText:
        "[Level 3+] Whenever another ally card enters your graveyard from your deck, return Mistbound Cutthroat from your graveyard to the field rested.",
      abilities: [
        {
          id: "C7zFV2K7bL-a1",
          kind: "triggered",
          text: "[Level 3+] Whenever another ally card enters your graveyard from your deck, return Mistbound Cutthroat from your graveyard to the field rested.",
          functionalZones: ["graveyard"],
          trigger: {
            kind: "event",
            event: {
              name: "card-moved",
              subject: {
                kind: "event-object",
                owner: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
              from: "main-deck",
              to: "graveyard",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                from: "graveyard",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default mistboundCutthroat;

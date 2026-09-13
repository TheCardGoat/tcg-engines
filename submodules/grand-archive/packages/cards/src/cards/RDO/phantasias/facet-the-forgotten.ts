import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const facetTheForgotten: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "snXzdCvSHL",
  slug: "facet-the-forgotten",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "snXzdCvSHL:face:default",
      catalogId: "snXzdCvSHL",
      name: "Facet the Forgotten",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["ASSASSIN", "MAGE"],
        subtypes: ["ASSASSIN", "MAGE", "ULTIMATE", "SPELL"],
      },
      elements: ["CRUX"],
      stats: {},
      rulesText:
        "[Merlin Bonus] On Enter: Look at target opponent's memory. You may activate a card from among them without paying its costs and ignoring its elemental requirements. If you do, your opponents can't play cards with the same name as the activated card for as long as you control Facet the Forgotten.",
      abilities: [
        {
          id: "snXzdCvSHL-a1",
          kind: "triggered",
          text: "[Merlin Bonus] On Enter: Look at target opponent's memory. You may activate a card from among them without paying its costs and ignoring its elemental requirements. If you do, your opponents can't play cards with the same name as the activated card for as long as you control Facet the Forgotten.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "activated-card",
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
                      binding: "looked-memory",
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "track-characteristic",
                        subject: {
                          kind: "bound",
                          binding: "activated-card",
                        },
                        characteristic: "card-name",
                        trackAs: "activated-card-name",
                      },
                      {
                        kind: "activate-card",
                        subject: {
                          kind: "bound",
                          binding: "activated-card",
                        },
                        payCosts: false,
                        ignoreElementRequirements: true,
                      },
                      {
                        kind: "rule-modification",
                        mode: "forbid",
                        action: "play",
                        subject: {
                          kind: "player",
                          player: "each-opponent",
                        },
                        filter: {
                          kind: "matches-tracked-characteristic",
                          key: "activated-card-name",
                          characteristic: "card-name",
                        },
                        duration: {
                          kind: "while-source-on-field",
                        },
                      },
                    ],
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

export default facetTheForgotten;

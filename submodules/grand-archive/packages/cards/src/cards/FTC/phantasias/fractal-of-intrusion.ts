import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfIntrusion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cfpwakb1k0",
  slug: "fractal-of-intrusion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cfpwakb1k0:face:default",
      catalogId: "cfpwakb1k0",
      name: "Fractal of Intrusion",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: You may banish a card with floating memory from your graveyard. When you do, look at target opponent's memory and discard a card from it.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "cfpwakb1k0-a1",
          kind: "triggered",
          text: "On Enter: You may banish a card with floating memory from your graveyard. When you do, look at target opponent's memory and discard a card from it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "has-keyword",
                      keyword: "floating-memory",
                    },
                  },
                },
              },
              consequence: {
                kind: "sequence",
                effects: [
                  {
                    kind: "look-at",
                    player: "controller",
                    selection: {
                      id: "inspected-cards",
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
                    kind: "discard",
                    player: "controller",
                    selection: {
                      id: "discarded-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                    },
                  },
                ],
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
            },
          },
        },
        {
          id: "cfpwakb1k0-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default fractalOfIntrusion;

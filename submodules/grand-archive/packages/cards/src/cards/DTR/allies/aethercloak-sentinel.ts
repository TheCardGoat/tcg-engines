import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aethercloakSentinel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1mvv1f83ls",
  slug: "aethercloak-sentinel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1mvv1f83ls:face:default",
      catalogId: "1mvv1f83ls",
      name: "Aethercloak Sentinel",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN", "RANGER"],
        subtypes: ["GUARDIAN", "RANGER", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Ranged 4, Spellshroud, Taunt\n\n[Class Bonus] On Enter: You may load an Aethercharge card from your graveyard or hand into an Aetherwing weapon you control. If a card was loaded from your hand this way, draw a card.",
      abilities: [
        {
          id: "1mvv1f83ls-a1",
          kind: "keyword-group",
          text: "Ranged 4, Spellshroud, Taunt",
          keywords: [
            {
              name: "ranged",
              value: 4,
            },
            {
              name: "spellshroud",
            },
            {
              name: "taunt",
            },
          ],
        },
        {
          id: "1mvv1f83ls-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may load an Aethercharge card from your graveyard or hand into an Aetherwing weapon you control. If a card was loaded from your hand this way, draw a card.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "choose",
                  selection: {
                    id: "loaded-card-choice",
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
                      zones: ["graveyard", "hand"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["AETHERCHARGE"],
                      },
                    },
                  },
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "load-host",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        relationship: "controlled-by",
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["WEAPON"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["AETHERWING"],
                            },
                          ],
                        },
                      },
                    },
                    effect: {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "loaded-card-choice",
                      },
                      destination: {
                        zone: "loaded",
                        host: {
                          kind: "bound",
                          binding: "load-host",
                        },
                      },
                      bindResultAs: "loaded-card",
                    },
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-result-origin",
                    binding: "loaded-card",
                    zone: "hand",
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
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

export default aethercloakSentinel;

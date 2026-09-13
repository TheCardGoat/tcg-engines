import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const transcendentalRite: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tAiiMGZJXp",
  slug: "transcendental-rite",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tAiiMGZJXp:face:default",
      catalogId: "tAiiMGZJXp",
      name: "Transcendental Rite",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic\n\nBanish Transcendental Rite: Your champion becomes an Ascendant in addition to its other types. All basic elements are enabled for you until end of turn. ",
      abilities: [
        {
          id: "tAiiMGZJXp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "tAiiMGZJXp-a2",
          kind: "activated",
          text: "Banish Transcendental Rite: Your champion becomes an Ascendant in addition to its other types. All basic elements are enabled for you until end of turn.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "subtype",
                    value: "ASCENDANT",
                  },
                },
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "set-player-state",
                    player: "controller",
                    state: {
                      named: "enabled-element",
                      value: "FIRE",
                    },
                    value: true,
                    duration: {
                      kind: "this-turn",
                    },
                  },
                  {
                    kind: "set-player-state",
                    player: "controller",
                    state: {
                      named: "enabled-element",
                      value: "WATER",
                    },
                    value: true,
                    duration: {
                      kind: "this-turn",
                    },
                  },
                  {
                    kind: "set-player-state",
                    player: "controller",
                    state: {
                      named: "enabled-element",
                      value: "WIND",
                    },
                    value: true,
                    duration: {
                      kind: "this-turn",
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default transcendentalRite;

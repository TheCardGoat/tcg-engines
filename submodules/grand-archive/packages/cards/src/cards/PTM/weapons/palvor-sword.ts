import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const palvorSword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wU3OvTrjEt",
  slug: "palvor-sword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wU3OvTrjEt:face:default",
      catalogId: "wU3OvTrjEt",
      name: "Palvor Sword",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DISTORTION", "SWORD"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 2,
        durability: 2,
      },
      rulesText:
        "[Level 1+]On Enter: Banish all cards in target player's graveyard face down until Palvor Sword leaves the field.",
      abilities: [
        {
          id: "wU3OvTrjEt-a1",
          kind: "triggered",
          text: "[Level 1+]On Enter: Banish all cards in target player's graveyard face down until Palvor Sword leaves the field.",
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
              id: "target-player",
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
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
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
                  right: 1,
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
                  kind: "each",
                  collection: {
                    zones: ["graveyard"],
                    player: {
                      binding: "target-player",
                    },
                  },
                },
                from: "graveyard",
                destination: {
                  zone: "banishment",
                },
                facing: "face-down",
                bindResultAs: "palvor-banished-cards",
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "object-left-field",
                    subject: {
                      kind: "source",
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "palvor-banished-cards",
                  },
                  from: "banishment",
                  destination: {
                    zone: "graveyard",
                  },
                  facing: "face-up",
                },
                limit: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default palvorSword;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shadebloodCoating: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nd8dy77ikm",
  slug: "shadeblood-coating",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nd8dy77ikm:face:default",
      catalogId: "nd8dy77ikm",
      name: "Shadeblood Coating",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ACCESSORY"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        'Banish Shadeblood Coating: Up to three target units you control gain "On Hit: Put a preparation counter on your champion" until end of turn.',
      abilities: [
        {
          id: "nd8dy77ikm-a1",
          kind: "activated",
          text: 'Banish Shadeblood Coating: Up to three target units you control gain "On Hit: Put a preparation counter on your champion" until end of turn.',
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-11n60b1-a1",
                kind: "triggered",
                text: "On Hit: Put a preparation counter on your champion",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-hit",
                    subject: {
                      kind: "source",
                    },
                  },
                },
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                  amount: 1,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default shadebloodCoating;

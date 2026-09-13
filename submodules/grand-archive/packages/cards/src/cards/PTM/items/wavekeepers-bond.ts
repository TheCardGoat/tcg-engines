import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wavekeepersBond: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WWlknyTxGA",
  slug: "wavekeepers-bond",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WWlknyTxGA:face:default",
      catalogId: "WWlknyTxGA",
      name: "Wavekeeper's Bond",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Whenever your champion levels up, recover 2.\n\n[Level 3+] At the beginning of your end phase, you may sacrifice Wavekeeper's Bond. If you do, draw a card into your memory.",
      abilities: [
        {
          id: "WWlknyTxGA-a1",
          kind: "triggered",
          text: "Whenever your champion levels up, recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 2,
          },
        },
        {
          id: "WWlknyTxGA-a2",
          kind: "triggered",
          text: "[Level 3+] At the beginning of your end phase, you may sacrifice Wavekeeper's Bond. If you do, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default wavekeepersBond;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const warriorOfTheFaeRealm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eRcqucBKhX",
  slug: "warrior-of-the-fae-realm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eRcqucBKhX:face:default",
      catalogId: "eRcqucBKhX",
      name: "Warrior of the Fae Realm",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "FAIRY"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Stealth\n\nOn Enter: You may banish a Sword attack card from your hand or memory. If you do, draw a card into your memory. As long as you control Warrior of the Fae Realm, you may activate the banished card on a later turn.",
      abilities: [
        {
          id: "eRcqucBKhX-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "eRcqucBKhX-a2",
          kind: "triggered",
          text: "On Enter: You may banish a Sword attack card from your hand or memory. If you do, draw a card into your memory. As long as you control Warrior of the Fae Realm, you may activate the banished card on a later turn.",
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
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-sword-attack",
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
                      zones: ["hand", "memory"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ACTION"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["SWORD"],
                          },
                        ],
                      },
                    },
                  },
                  bindResultAs: "banished-sword-attack",
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
                {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "turn-begins",
                    },
                  },
                  limit: 1,
                  effect: {
                    kind: "rule-modification",
                    mode: "allow",
                    action: "activate",
                    subject: {
                      kind: "bound",
                      binding: "banished-sword-attack",
                    },
                    fromZone: "banishment",
                    duration: {
                      kind: "while-source-on-field",
                    },
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

export default warriorOfTheFaeRealm;

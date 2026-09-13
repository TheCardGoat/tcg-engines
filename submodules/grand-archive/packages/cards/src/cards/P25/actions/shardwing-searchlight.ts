import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shardwingSearchlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8bRp3n2IAn",
  slug: "shardwing-searchlight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8bRp3n2IAn:face:default",
      catalogId: "8bRp3n2IAn",
      name: "Shardwing Searchlight",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        'Summon a Memorite Shardwing token.\n\n[Sheen 4+] Summon a Memorite Shardwing token.\n\nUntil end of turn, Memorite objects you control gain "On Hit: Put a sheen counter on the hit object."',
      abilities: [
        {
          id: "8bRp3n2IAn-a1",
          kind: "card-resolution",
          text: "Summon a Memorite Shardwing token.",
          effect: {
            kind: "summon",
            object: "Memorite Shardwing",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "8bRp3n2IAn-a2",
          kind: "card-resolution",
          text: "[Sheen 4+] Summon a Memorite Shardwing token.",
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 4,
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Memorite Shardwing",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "8bRp3n2IAn-a3",
          kind: "card-resolution",
          text: 'Until end of turn, Memorite objects you control gain "On Hit: Put a sheen counter on the hit object."',
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["MEMORITE"],
                },
              },
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
                id: "granted-rwp2oq-a1",
                kind: "triggered",
                text: "On Hit: Put a sheen counter on the hit object.",
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
                    kind: "event-recipient",
                  },
                  counter: {
                    named: "sheen",
                  },
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

export default shardwingSearchlight;

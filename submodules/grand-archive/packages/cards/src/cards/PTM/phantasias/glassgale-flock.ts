import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const glassgaleFlock: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KRNYwHCOVM",
  slug: "glassgale-flock",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KRNYwHCOVM:face:default",
      catalogId: "KRNYwHCOVM",
      name: "Glassgale Flock",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Summon a Memorite Shardwing token.\n\n[Merlin Bonus] [Sheen 6+] (2), REST: If you don't control an ally named Memorite Shardwing, summon a Memorite Shardwing  token.",
      abilities: [
        {
          id: "KRNYwHCOVM-a1",
          kind: "triggered",
          text: "On Enter: Summon a Memorite Shardwing token.",
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
            kind: "summon",
            object: "Memorite Shardwing",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "KRNYwHCOVM-a2",
          kind: "activated",
          text: "[Merlin Bonus] [Sheen 6+] (2), REST: If you don't control an ally named Memorite Shardwing, summon a Memorite Shardwing  token.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 6,
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "name",
                        value: "Memorite Shardwing",
                        match: "exact",
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SHARDWING"],
                      },
                    ],
                  },
                },
              },
            },
            then: {
              kind: "summon",
              object: "Memorite Shardwing",
              controller: "controller",
              bindResultAs: "summoned-token",
            },
          },
        },
      ],
    },
  },
};

export default glassgaleFlock;

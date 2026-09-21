import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nicoWhiplashAllure: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5bbae3z4py",
  slug: "nico-whiplash-allure",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5bbae3z4py:face:default",
      catalogId: "5bbae3z4py",
      name: "Nico, Whiplash Allure",
      lineageName: "Nico",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        level: 2,
        life: 25,
      },
      rulesText:
        "Whenever a card with floating memory is banished from your graveyard, put a lash counter on Nico.\n\nOn Champion Hit: You may have that opponent put the top X cards of their deck into their graveyard, where X is the amount of lash counters on Nico.",
      abilities: [
        {
          id: "5bbae3z4py-a1",
          kind: "triggered",
          text: "Whenever a card with floating memory is banished from your graveyard, put a lash counter on Nico.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              from: "graveyard",
              subject: {
                kind: "event-object",
                owner: "controller",
                filter: {
                  kind: "has-keyword",
                  keyword: "floating-memory",
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "lash",
            },
            amount: 1,
          },
        },
        {
          id: "5bbae3z4py-a2",
          kind: "triggered",
          text: "On Champion Hit: You may have that opponent put the top X cards of their deck into their graveyard, where X is the amount of lash counters on Nico.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "lash",
                },
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "mill",
              player: "event-recipient-controller",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "lash",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default nicoWhiplashAllure;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const obsequiousBlow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "macqlgvqo3",
  slug: "obsequious-blow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "macqlgvqo3:face:default",
      catalogId: "macqlgvqo3",
      name: "Obsequious Blow",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 7,
      },
      rulesText:
        "[Ciel Bonus] This card costs 1 less to activate for each omen you have.  \n\nOn Champion Hit: The first card that opponent activates during their next turn costs 2 more to activate. ",
      abilities: [
        {
          id: "macqlgvqo3-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] This card costs 1 less to activate for each omen you have.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "player-property",
                player: "controller",
                property: "omens",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "macqlgvqo3-a2",
          kind: "triggered",
          text: "On Champion Hit: The first card that opponent activates during their next turn costs 2 more to activate.",
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
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "event-recipient-controller",
            },
            costKind: "reserve",
            costOperation: "add",
            amount: 2,
            occurrence: {
              count: 1,
              window: "this-turn",
              actorScope: "same-player",
            },
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              starts: {
                kind: "next-turn",
                whose: "event-recipient-controller",
              },
              expires: {
                kind: "during-next-turn",
                whose: "event-recipient-controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default obsequiousBlow;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimeNexus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "emoydelro8",
  slug: "slime-nexus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "emoydelro8:face:default",
      catalogId: "emoydelro8",
      name: "Slime Nexus",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "COMPONENT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Slime Nexus: The next Slime ally card you activate this turn costs 3 less to activate.",
      abilities: [
        {
          id: "emoydelro8-a1",
          kind: "activated",
          text: "Banish Slime Nexus: The next Slime ally card you activate this turn costs 3 less to activate.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                {
                  kind: "subtype",
                  oneOf: ["SLIME"],
                },
              ],
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 3,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default slimeNexus;

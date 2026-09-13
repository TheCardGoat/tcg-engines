import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sordelleUnmooredException: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ROjhG3L1iy",
  slug: "sordelle-unmoored-exception",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ROjhG3L1iy:face:default",
      catalogId: "ROjhG3L1iy",
      name: "Sordelle, Unmoored Exception",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "DISCORP", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: Summon a Powercell token rested. \n\n(3), REST, Sacrifice a Powercell: Scavenge 6 for an Automaton card.",
      abilities: [
        {
          id: "ROjhG3L1iy-a1",
          kind: "triggered",
          text: "On Enter: Summon a Powercell token rested.",
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
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithStates: ["rested"],
          },
        },
        {
          id: "ROjhG3L1iy-a2",
          kind: "activated",
          text: "(3), REST, Sacrifice a Powercell: Scavenge 6 for an Automaton card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
              },
            ],
          },
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 6,
            filter: {
              kind: "subtype",
              oneOf: ["AUTOMATON"],
            },
          },
        },
      ],
    },
  },
};

export default sordelleUnmooredException;

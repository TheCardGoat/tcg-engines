import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianaDuskstalker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iq4d5vettc",
  slug: "diana-duskstalker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iq4d5vettc:face:default",
      catalogId: "iq4d5vettc",
      name: "Diana, Duskstalker",
      lineageName: "Diana",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Diana Lineage\n\nOn Enter: Diana becomes distant. \n\nOn Champion Hit: Generate a Creeping Torment card and put it on the bottom of the hit champion's lineage. (To generate, add that card from outside of the game.) ",
      abilities: [
        {
          id: "iq4d5vettc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Diana Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Diana",
          },
        },
        {
          id: "iq4d5vettc-a2",
          kind: "triggered",
          text: "On Enter: Diana becomes distant.",
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
            kind: "set-object-state",
            subject: {
              kind: "source",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "iq4d5vettc-a3",
          kind: "triggered",
          text: "On Champion Hit: Generate a Creeping Torment card and put it on the bottom of the hit champion's lineage. (To generate, add that card from outside of the game.)",
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
            kind: "generate",
            card: "Creeping Torment",
            player: "controller",
            destination: {
              zone: "inner-lineage",
              host: {
                kind: "event-recipient",
              },
              placement: {
                kind: "bottom",
              },
            },
          },
        },
      ],
    },
  },
};

export default dianaDuskstalker;

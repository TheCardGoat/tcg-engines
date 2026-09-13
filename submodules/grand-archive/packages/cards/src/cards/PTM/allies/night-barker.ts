import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nightBarker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PiZqM1q9ly",
  slug: "night-barker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PiZqM1q9ly:face:default",
      catalogId: "PiZqM1q9ly",
      name: "Night Barker",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPECTER", "ANIMAL", "DOG"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Death: Return Night Barker from your graveyard to the field. It becomes ephemeral. (If an ephemeral object would leave the field, banish it instead.)",
      abilities: [
        {
          id: "PiZqM1q9ly-a1",
          kind: "triggered",
          text: "On Death: Return Night Barker from your graveyard to the field. It becomes ephemeral. (If an ephemeral object would leave the field, banish it instead.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                from: "graveyard",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default nightBarker;

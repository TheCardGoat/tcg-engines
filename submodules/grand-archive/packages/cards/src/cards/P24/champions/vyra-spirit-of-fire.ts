import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vyraSpiritOfFire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lokqp12mxz",
  slug: "vyra-spirit-of-fire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lokqp12mxz:face:default",
      catalogId: "lokqp12mxz",
      name: "Vyra, Spirit of Fire",
      lineageName: "Vyra",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT"],
      },
      elements: ["FIRE"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText: "On Enter: Draw seven cards.",
      abilities: [
        {
          id: "lokqp12mxz-a1",
          kind: "triggered",
          text: "On Enter: Draw seven cards.",
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
            kind: "draw",
            player: "controller",
            amount: 7,
          },
        },
      ],
    },
  },
};

export default vyraSpiritOfFire;

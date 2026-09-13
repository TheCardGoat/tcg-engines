import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flameboundDraug: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lz5escwkb1",
  slug: "flamebound-draug",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lz5escwkb1:face:default",
      catalogId: "lz5escwkb1",
      name: "Flamebound Draug",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPECTER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 1,
      },
      rulesText:
        "On Enter: Flamebound Draug becomes ephemeral. (If an ephemeral object would leave the field, banish it instead.)",
      abilities: [
        {
          id: "lz5escwkb1-a1",
          kind: "triggered",
          text: "On Enter: Flamebound Draug becomes ephemeral. (If an ephemeral object would leave the field, banish it instead.)",
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
            state: "ephemeral",
            value: true,
          },
        },
      ],
    },
  },
};

export default flameboundDraug;

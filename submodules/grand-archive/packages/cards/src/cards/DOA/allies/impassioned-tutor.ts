import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const impassionedTutor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MECS7RHRZ8",
  slug: "impassioned-tutor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MECS7RHRZ8:face:default",
      catalogId: "MECS7RHRZ8",
      name: "Impassioned Tutor",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText: "On Attack: Your champion gets +1 level until end of turn.",
      abilities: [
        {
          id: "MECS7RHRZ8-a1",
          kind: "triggered",
          text: "On Attack: Your champion gets +1 level until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default impassionedTutor;

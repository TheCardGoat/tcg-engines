import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scatteringGusts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jOqyx96kse",
  slug: "scattering-gusts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jOqyx96kse:face:default",
      catalogId: "jOqyx96kse",
      name: "Scattering Gusts",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Suppress up to two target allies. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase.)\n\n[Class Bonus] Put an enlighten counter on your champion.",
      abilities: [
        {
          id: "jOqyx96kse-a1",
          kind: "card-resolution",
          text: "Suppress up to two target allies. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase.)",
          targets: [
            {
              id: "target-allies",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "suppress",
            player: "controller",
            subject: {
              kind: "bound",
              binding: "target-allies",
            },
          },
        },
        {
          id: "jOqyx96kse-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put an enlighten counter on your champion.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default scatteringGusts;

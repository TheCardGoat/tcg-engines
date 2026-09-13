import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nimueCursedTouch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l52lVIFvpy",
  slug: "nimue-cursed-touch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l52lVIFvpy:face:default",
      catalogId: "l52lVIFvpy",
      name: "Nimue, Cursed Touch",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Whenever you activate an action card that targets an ally, destroy that ally. ",
      abilities: [
        {
          id: "l52lVIFvpy-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate an action card that targets an ally, destroy that ally.",
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
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ACTION"],
                },
              },
              recipient: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "destroy",
            subject: {
              kind: "each",
              collection: {
                binding: "eventRecipient",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default nimueCursedTouch;

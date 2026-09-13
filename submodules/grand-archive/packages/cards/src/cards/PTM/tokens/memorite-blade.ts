import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const memoriteBlade: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "nZFkDcvpaY",
  slug: "memorite-blade",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "nZFkDcvpaY:face:default",
      catalogId: "nZFkDcvpaY",
      name: "Memorite Blade",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "MEMORITE", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        durability: 2,
      },
      rulesText:
        "Whenever you activate a Spell card, Memorite Blade gets +1 POWER. Trigger this ability only once. ",
      abilities: [
        {
          id: "nZFkDcvpaY-a1",
          kind: "triggered",
          text: "Whenever you activate a Spell card, Memorite Blade gets +1 POWER. Trigger this ability only once.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "permanent",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default memoriteBlade;

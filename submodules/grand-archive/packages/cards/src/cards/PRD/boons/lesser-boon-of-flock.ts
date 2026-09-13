import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfFlock: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "94rrVFUJG4",
  slug: "lesser-boon-of-flock",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "94rrVFUJG4:face:default",
      catalogId: "94rrVFUJG4",
      name: "Lesser Boon of Flock",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "As you gain this boon, summon a Fledgling token.\n\nIgnore the elemental requirements of non-advanced element Bird cards you activate.\n",
      abilities: [
        {
          id: "94rrVFUJG4-a1",
          kind: "triggered",
          text: "As you gain this boon, summon a Fledgling token.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Fledgling",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "94rrVFUJG4-a2",
          kind: "static",
          staticKind: "effects",
          text: "Ignore the elemental requirements of non-advanced element Bird cards you activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element-category",
                    value: "non-advanced",
                  },
                  {
                    kind: "subtype",
                    oneOf: ["BIRD"],
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default lesserBoonOfFlock;

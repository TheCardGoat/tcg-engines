import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maidenOfShroudedFog: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wum3f33kay",
  slug: "maiden-of-shrouded-fog",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wum3f33kay:face:default",
      catalogId: "wum3f33kay",
      name: "Maiden of Shrouded Fog",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "APPARITION"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Spellshroud (Units with spellshroud can't be targeted by Spells.)\n\nWhenever you activate a card from your memory, put a buff counter on target phantasia ally you control.",
      abilities: [
        {
          id: "wum3f33kay-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Spellshroud (Units with spellshroud can't be targeted by Spells.)",
          keyword: {
            name: "spellshroud",
          },
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
        },
        {
          id: "wum3f33kay-a2",
          kind: "triggered",
          text: "Whenever you activate a card from your memory, put a buff counter on target phantasia ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
              },
              from: "memory",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["PHANTASIA"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default maidenOfShroudedFog;

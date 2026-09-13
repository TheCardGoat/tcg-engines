import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const devotedMartyr: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p16w5j93mk",
  slug: "devoted-martyr",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p16w5j93mk:face:default",
      catalogId: "p16w5j93mk",
      name: "Devoted Martyr",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\n[Class Bonus] Whenever your champion levels up, you may banish this card from your graveyard. If you do, recover 2.",
      abilities: [
        {
          id: "p16w5j93mk-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "p16w5j93mk-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever your champion levels up, you may banish this card from your graveyard. If you do, recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "recover",
                  player: "controller",
                  amount: 2,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default devotedMartyr;

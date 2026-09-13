import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bombasticSprint: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t4owmcva0f",
  slug: "bombastic-sprint",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t4owmcva0f:face:default",
      catalogId: "t4owmcva0f",
      name: "Bombastic Sprint",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Your champion becomes distant.\n\n[Polkhawk Bonus] The next Ranger action card you activate this turn can be activated as though it had fast activation. ",
      abilities: [
        {
          id: "t4owmcva0f-a1",
          kind: "card-resolution",
          text: "Your champion becomes distant.",
          effect: {
            kind: "set-object-state",
            subject: {
              kind: "champion",
              player: "controller",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "t4owmcva0f-a2",
          kind: "card-resolution",
          text: "[Polkhawk Bonus] The next Ranger action card you activate this turn can be activated as though it had fast activation.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Polkhawk",
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "activate-fast",
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ACTION"],
                },
                {
                  kind: "class",
                  oneOf: ["RANGER"],
                },
              ],
            },
            duration: {
              kind: "for-next-event",
              event: "card-activated",
            },
          },
        },
      ],
    },
  },
};

export default bombasticSprint;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const harmoniousMantra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gnth142db4",
  slug: "harmonious-mantra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gnth142db4:face:default",
      catalogId: "gnth142db4",
      name: "Harmonious Mantra",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Recover 3. If your Shifting Currents face North, recover 3+LV instead. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "gnth142db4-a1",
          kind: "card-resolution",
          text: "Recover 3. If your Shifting Currents face North, recover 3+LV instead. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-state",
              player: "controller",
              state: {
                named: "shifting-currents",
                value: "North",
              },
            },
            then: {
              kind: "recover",
              player: "controller",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  3,
                  {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                ],
              },
            },
            else: {
              kind: "recover",
              player: "controller",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default harmoniousMantra;

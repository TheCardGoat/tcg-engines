import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vestalPriestess: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "12XYNDPi49",
  slug: "vestal-priestess",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "12XYNDPi49:face:default",
      catalogId: "12XYNDPi49",
      name: "Vestal Priestess",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nIntercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nOn Enter: Recover 4.",
      abilities: [
        {
          id: "12XYNDPi49-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "12XYNDPi49-a2",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "12XYNDPi49-a3",
          kind: "triggered",
          text: "On Enter: Recover 4.",
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
            kind: "recover",
            player: "controller",
            amount: 4,
          },
        },
      ],
    },
  },
};

export default vestalPriestess;

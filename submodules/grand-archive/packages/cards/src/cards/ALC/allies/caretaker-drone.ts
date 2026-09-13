import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const caretakerDrone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "urfp66pv4n",
  slug: "caretaker-drone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "urfp66pv4n:face:default",
      catalogId: "urfp66pv4n",
      name: "Caretaker Drone",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.) \n\n[Class Bonus] On Death: Glimpse 4.",
      abilities: [
        {
          id: "urfp66pv4n-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "urfp66pv4n-a2",
          kind: "triggered",
          text: "[Class Bonus] On Death: Glimpse 4.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
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
            kind: "keyword-action",
            action: "glimpse",
            amount: 4,
          },
        },
      ],
    },
  },
};

export default caretakerDrone;

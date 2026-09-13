import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const restorativeSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e8nFGSSvgc",
  slug: "restorative-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e8nFGSSvgc:face:default",
      catalogId: "e8nFGSSvgc",
      name: "Restorative Slash",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
      },
      rulesText:
        "On Attack: Recover 3.  (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "e8nFGSSvgc-a1",
          kind: "triggered",
          text: "On Attack: Recover 3.  (To recover, remove that many damage counters from your champion.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default restorativeSlash;

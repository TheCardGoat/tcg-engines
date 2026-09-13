import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fatestoneOfProgress: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2sn7hlyrkw",
  slug: "fatestone-of-progress",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "2sn7hlyrkw:face:default",
      catalogId: "2sn7hlyrkw",
      name: "Fatestone of Progress",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Guo Jia Bonus] On Enter: Put a quest counter on your champion. (Apply this effect only if your champion is Guo Jia.)\n\n[Guo Jia Bonus] (4): Transform Fatestone of Progress. (Activate this ability only if your champion is Guo Jia.)",
      abilities: [
        {
          id: "2sn7hlyrkw-a1",
          kind: "triggered",
          text: "[Guo Jia Bonus] On Enter: Put a quest counter on your champion. (Apply this effect only if your champion is Guo Jia.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: {
              named: "quest",
            },
            amount: 1,
          },
        },
        {
          id: "2sn7hlyrkw-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (4): Transform Fatestone of Progress. (Activate this ability only if your champion is Guo Jia.)",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 4,
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "transform",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
    flipFace: {
      id: "2sn7hlyrkw:face:flip",
      catalogId: "ig8dv0n7fl",
      name: "Airborne Squirrel",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "SQUIRREL"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default fatestoneOfProgress;

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rangerHealerAlly: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jetWcli3ZL",
  slug: "ranger-healer-ally",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jetWcli3ZL:face:default",
      catalogId: "jetWcli3ZL",
      name: "Balmshot Nurse",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "RANGER"],
        subtypes: ["CLERIC", "RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "REST: Recover 3. Activate this ability only if Balmshot Nurse is distant. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "jetWcli3ZL-a1",
          kind: "activated",
          text: "REST: Recover 3. Activate this ability only if Balmshot Nurse is distant. (To recover, remove that many damage counters from your champion.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          condition: {
            kind: "object-state",
            subject: {
              kind: "source",
            },
            state: "distant",
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

export default rangerHealerAlly;

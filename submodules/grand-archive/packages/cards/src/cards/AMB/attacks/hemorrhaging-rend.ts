import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hemorrhagingRend: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xiazfnm292",
  slug: "hemorrhaging-rend",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xiazfnm292:face:default",
      catalogId: "xiazfnm292",
      name: "Hemorrhaging Rend",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["EXIA"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Damage 20+] Cleave (Attack all units a chosen opponent controls. This attack can't be intercepted. Apply this effect only if there are twenty or more damage counters on your champion.)",
      abilities: [
        {
          id: "xiazfnm292-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Damage 20+] Cleave (Attack all units a chosen opponent controls. This attack can't be intercepted. Apply this effect only if there are twenty or more damage counters on your champion.)",
          keyword: {
            name: "cleave",
          },
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 20,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default hemorrhagingRend;

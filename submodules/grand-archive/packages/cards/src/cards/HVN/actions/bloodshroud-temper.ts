import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bloodshroudTemper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6vzr7yc6vi",
  slug: "bloodshroud-temper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6vzr7yc6vi:face:default",
      catalogId: "6vzr7yc6vi",
      name: "Bloodshroud Temper",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target weapon gains omnishroud until end of turn. (An object with omnishroud can't be targeted by activations, materializations, or triggers.)\n\n[Damage 20+] Put two durability counters on that weapon. (Apply this effect only if there are twenty or more damage counters on your champion.)",
      abilities: [
        {
          id: "6vzr7yc6vi-a1",
          kind: "card-resolution",
          text: "Target weapon gains omnishroud until end of turn. (An object with omnishroud can't be targeted by activations, materializations, or triggers.)",
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
                filter: {
                  kind: "type",
                  oneOf: ["WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "omnishroud",
              },
            },
          },
        },
        {
          id: "6vzr7yc6vi-a2",
          kind: "card-resolution",
          text: "[Damage 20+] Put two durability counters on that weapon. (Apply this effect only if there are twenty or more damage counters on your champion.)",
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
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "durability",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default bloodshroudTemper;

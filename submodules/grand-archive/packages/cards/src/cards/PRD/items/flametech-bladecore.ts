import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flametechBladecore: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aAJliPQT3F",
  slug: "flametech-bladecore",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aAJliPQT3F:face:default",
      catalogId: "aAJliPQT3F",
      name: "FlameTech BladeCore",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "ACCESSORY"],
      },
      elements: ["EXALTED", "FIRE"],
      stats: {},
      rulesText:
        'Sword Weapon Link (This object enters the field linked to target Sword weapon. If the link is broken, sacrifice this object.)\n\n[Lorraine Bonus] Link Shield (If linked object would be destroyed, remove all temporary damage from it and destroy this object instead.)\n\nLinked weapon gets +2POWER and has "Whenever you discard a fire element card, put a durability counter on this weapon."\n',
      abilities: [
        {
          id: "aAJliPQT3F-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Sword Weapon Link (This object enters the field linked to target Sword weapon. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "sword-weapon",
          },
        },
        {
          id: "aAJliPQT3F-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Lorraine Bonus] Link Shield (If linked object would be destroyed, remove all temporary damage from it and destroy this object instead.)",
          keyword: {
            name: "link-shield",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
              },
            },
          ],
        },
        {
          id: "aAJliPQT3F-a3",
          kind: "static",
          staticKind: "effects",
          text: 'Linked weapon gets +2POWER and has "Whenever you discard a fire element card, put a durability counter on this weapon."',
          executionSource: "linked-object",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-1teyj3h-a1",
                  kind: "triggered",
                  text: "Whenever you discard a fire element card, put a durability counter on this weapon.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "card-discarded",
                      actor: "controller",
                      subject: {
                        kind: "event-object",
                        owner: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
                  },
                  effect: {
                    kind: "add-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: "durability",
                    amount: 1,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default flametechBladecore;

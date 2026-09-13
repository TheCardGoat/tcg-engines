import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frostbittenEtui: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bdhjszsj2z",
  slug: "frostbitten-etui",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bdhjszsj2z:face:default",
      catalogId: "bdhjszsj2z",
      name: "Frostbitten Etui",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Level 2+] Banish Frostbitten Etui: Negate all on enter triggers from target ally you don't control unless its controller pays (3).",
      abilities: [
        {
          id: "bdhjszsj2z-a1",
          kind: "activated",
          text: "[Level 2+] Banish Frostbitten Etui: Negate all on enter triggers from target ally you don't control unless its controller pays (3).",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-ally",
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
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "unless-paid",
            player: {
              controllerOf: "target-ally",
            },
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
            otherwise: {
              kind: "negate-triggered-abilities",
              source: {
                kind: "bound",
                binding: "target-ally",
              },
              triggerEvent: "object-entered-field",
            },
          },
        },
      ],
    },
  },
};

export default frostbittenEtui;

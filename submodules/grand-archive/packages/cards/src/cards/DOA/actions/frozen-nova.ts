import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frozenNova: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IyXuaLKjSA",
  slug: "frozen-nova",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IyXuaLKjSA:face:default",
      catalogId: "IyXuaLKjSA",
      name: "Frozen Nova",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nDeal 1 damage to all allies and rest them. Those allies don't wake up during their controller's next wake up phase.",
      abilities: [
        {
          id: "IyXuaLKjSA-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
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
        },
        {
          id: "IyXuaLKjSA-a2",
          kind: "card-resolution",
          text: "Deal 1 damage to all allies and rest them. Those allies don't wake up during their controller's next wake up phase.",
          effect: {
            kind: "choose",
            selection: {
              id: "affected-allies",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "all",
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "affected-allies",
                  },
                  amount: 1,
                },
                {
                  kind: "rest",
                  subject: {
                    kind: "bound",
                    binding: "affected-allies",
                  },
                },
                {
                  kind: "for-each",
                  collection: {
                    binding: "affected-allies",
                  },
                  bindEachAs: "frozen-ally",
                  effect: {
                    kind: "rule-modification",
                    mode: "forbid",
                    action: "wake",
                    subject: {
                      kind: "bound",
                      binding: "frozen-ally",
                    },
                    duration: {
                      kind: "until-end-of-next-phase",
                      phase: "wake-up",
                      whose: {
                        controllerOf: "frozen-ally",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default frozenNova;

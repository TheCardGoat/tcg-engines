import { defineSplitLayout } from "../../authoring/layouts.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/instants/vaporize-shock.generated.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/vaporize-shock.generated.ts";

export const vaporizeShock = definePitchFamily(fabPitchFamilies["vaporize-shock"], {
  layouts: {
    yellow: defineSplitLayout(fabCardIdentitiesByCanonicalId["NMfPbTgbMbP9pnnCKMQD9"], {
      left: {
        name: "Vaporize",
        typeText: "Runeblade Instant",
        types: ["Runeblade", "Instant"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
        ],
        abilities: [
          {
            id: "destroyAuraPermanentCostXLessUpXAura",
            text: "",
            kind: "resolution",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "any",
                    zones: ["permanent"],
                    filter: {
                      typeBox: {
                        subtypes: ["Aura"],
                        excludeMetatypes: ["Token"],
                      },
                      cost: {
                        op: "lte",
                        value: {
                          type: "count",
                          what: "damage-dealt",
                          damageType: "arcane",
                          per: "turn",
                        },
                      },
                    },
                    count: { type: "up-to", amount: 1 },
                  },
                },
                {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "any",
                    zones: ["permanent"],
                    filter: {
                      typeBox: {
                        metatypes: ["Token"],
                        subtypes: ["Aura"],
                      },
                    },
                    count: {
                      type: "up-to",
                      amount: {
                        type: "count",
                        what: "damage-dealt",
                        damageType: "arcane",
                        per: "turn",
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      right: {
        name: "Shock",
        typeText: "Lightning Instant",
        types: ["Lightning", "Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: [
          {
            id: "deal1ArcaneDamageAnyTarget",
            text: "",
            kind: "resolution",
            effect: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "object",
                declared: "on-stack",
                player: "any",
                zones: ["hero", "permanent"],
                count: 1,
              },
            },
          },
        ],
      },
    }),
  },
});

export const { yellow: vaporizeShockYellow } = vaporizeShock.cards;

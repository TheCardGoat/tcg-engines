import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/usurp-the-shadow-throne.generated.ts";
import { bloodDebt, specialization } from "../shared/keywords.ts";

export const usurpTheShadowThrone = definePitchFamily(fabPitchFamilies["usurp-the-shadow-throne"], {
  keywords: [specialization("Viserai"), bloodDebt],
  abilities: () => ({
    permission: {
      kind: "static",
      staticKind: "play",
      functionalZones: ["hand", "banished"],
      condition: { type: "performed-this-turn", event: "usurp", player: "controller" },
      playEffect: { role: "permission", fromZones: ["banished"] },
    },
    discount: {
      kind: "static",
      staticKind: "play",
      functionalZones: ["hand", "banished"],
      condition: { type: "performed-this-turn", event: "usurp", player: "controller" },
      playEffect: {
        role: "cost-reduction",
        cost: { class: "asset", type: "resources", amount: 6 },
      },
    },
    hit: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "turn-face-down",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["banished"],
                count: { type: "all" },
              },
            },
            {
              type: "lose-life",
              amount: { type: "count", what: "turned-face-down-this-way" },
              target: { selector: "attack-target" },
            },
            {
              type: "gain-life",
              amount: { type: "count", what: "turned-face-down-this-way" },
              target: { selector: "controller" },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: usurpTheShadowThroneBlue } = usurpTheShadowThrone.cards;

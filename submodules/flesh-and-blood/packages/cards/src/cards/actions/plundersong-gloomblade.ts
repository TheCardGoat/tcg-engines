import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plundersong-gloomblade.generated.ts";
import { usurp, bloodDebt } from "../shared/keywords.ts";

export const plundersongGloomblade = definePitchFamily(fabPitchFamilies["plundersong-gloomblade"], {
  keywords: [usurp, bloodDebt],
  abilities: () => ({
    banished: {
      kind: "static",
      staticKind: "play",
      playEffect: { role: "permission", fromZones: ["banished"] },
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
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attack-target",
            zones: ["arsenal"],
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: plundersongGloombladeRed } = plundersongGloomblade.cards;

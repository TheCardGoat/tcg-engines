import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cullingsong-gloomblade.generated.ts";
import { usurp, bloodDebt } from "../shared/keywords.ts";

export const cullingsongGloomblade = definePitchFamily(fabPitchFamilies["cullingsong-gloomblade"], {
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
            zones: ["hand"],
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: cullingsongGloombladeRed } = cullingsongGloomblade.cards;

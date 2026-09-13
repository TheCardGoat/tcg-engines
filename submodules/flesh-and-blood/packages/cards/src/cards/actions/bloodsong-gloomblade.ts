import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bloodsong-gloomblade.generated.ts";
import { bloodDebt, usurp } from "../shared/keywords.ts";

export const bloodsongGloomblade = definePitchFamily(fabPitchFamilies["bloodsong-gloomblade"], {
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
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "attack-target",
              zones: ["permanent"],
              filter: { typeBox: { subtypes: ["Aura"] } },
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const { red: bloodsongGloombladeRed } = bloodsongGloomblade.cards;

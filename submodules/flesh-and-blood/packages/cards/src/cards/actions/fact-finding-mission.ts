import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fact-finding-mission.generated.ts";

export const factFindingMission = definePitchFamily(fabPitchFamilies["fact-finding-mission"], {
  abilities: () => ({
    inspectFaceDown: {
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
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: [
                "arsenal",
                "equipment-head",
                "equipment-chest",
                "equipment-arms",
                "equipment-legs",
              ],
              filter: { hasStatus: "face-down" },
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const {
  red: factFindingMissionRed,
  yellow: factFindingMissionYellow,
  blue: factFindingMissionBlue,
} = factFindingMission.cards;

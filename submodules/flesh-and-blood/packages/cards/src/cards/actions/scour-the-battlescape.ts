import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scour-the-battlescape.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const scourTheBattlescape = definePitchFamily(fabPitchFamilies["scour-the-battlescape"], {
  abilities: () => ({
    resolutionOptional: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: 1,
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
        then: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
    triggeredStaticOnPlayEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});

export const {
  red: scourTheBattlescapeRed,
  yellow: scourTheBattlescapeYellow,
  blue: scourTheBattlescapeBlue,
} = scourTheBattlescape.cards;

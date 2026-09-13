import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/torrent-of-tempo.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const torrentOfTempo = definePitchFamily(fabPitchFamilies["torrent-of-tempo"], {
  abilities: () => ({
    triggeredStaticOnHitEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
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
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: torrentOfTempoRed,
  yellow: torrentOfTempoYellow,
  blue: torrentOfTempoBlue,
} = torrentOfTempo.cards;

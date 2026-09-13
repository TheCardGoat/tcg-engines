import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spring-a-leak.generated.ts";
import { boost } from "../shared/keywords.ts";

export const springALeak = definePitchFamily(fabPitchFamilies["spring-a-leak"], {
  keywords: [boost],
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-all-counters",
          counter: {
            kind: "named",
            name: "steam",
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment", "Weapon"],
                subtypes: ["Item"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const {
  red: springALeakRed,
  yellow: springALeakYellow,
  blue: springALeakBlue,
} = springALeak.cards;

import { goAgain, stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scuttle-the-canal.generated.ts";

export const scuttleTheCanal = definePitchFamily(fabPitchFamilies["scuttle-the-canal"], {
  keywords: [stealth],

  abilities: () => ({
    triggerWhenMarkedAttackAttacks: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "marked",
            },
          },
          target: {
            kind: "hero",
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
  red: scuttleTheCanalRed,
  yellow: scuttleTheCanalYellow,
  blue: scuttleTheCanalBlue,
} = scuttleTheCanal.cards;

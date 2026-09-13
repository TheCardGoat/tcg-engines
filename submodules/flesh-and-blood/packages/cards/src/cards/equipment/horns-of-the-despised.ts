import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/horns-of-the-despised.generated.ts";

export const hornsOfTheDespised = defineCard(
  fabCardIdentitiesByCanonicalId["667jCHDNcTc6zNTcjFk8m"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsCrowdBoos: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "crowd-boos",
            target: "controller",
          },
        },
        label: {
          name: "the-crowd-boos",
        },
      },
    },
  },
);

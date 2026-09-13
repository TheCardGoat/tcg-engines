import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/banneret-of-swordsmanship.generated.ts";

export const banneretOfSwordsmanship = definePitchFamily(
  fabPitchFamilies["banneret-of-swordsmanship"],
  {
    abilities: () => ({
      whenIsChargedHeroSSoulCreateFlurryToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "move-zone",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "moved-object",
            },
            to: "soul",
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "flurry",
            controller: "controller",
          },
        },
        label: {
          name: "solflare",
        },
      },
    }),
  },
);

export const { yellow: banneretOfSwordsmanshipYellow } = banneretOfSwordsmanship.cards;

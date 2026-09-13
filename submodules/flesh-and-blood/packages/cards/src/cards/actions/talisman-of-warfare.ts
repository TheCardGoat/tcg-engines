import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/talisman-of-warfare.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const talismanOfWarfare = definePitchFamily(fabPitchFamilies["talisman-of-warfare"], {
  keywords: [goAgain],
  abilities: () => ({
    whenSourceControlDealsExactlyNumber2DamageOpposingHeroDestroyTalismanWarfare: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "deal-damage",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
          amount: {
            op: "eq",
            value: 2,
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["arsenal"],
                player: "any",
                count: {
                  type: "all",
                },
              },
              to: {
                zone: "graveyard",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: talismanOfWarfareYellow } = talismanOfWarfare.cards;

import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shapeless-form.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shapelessForm = definePitchFamily(fabPitchFamilies["shapeless-form"], {
  keywords: [goAgain],
  abilities: () => ({
    wheneverPlayAttackActionWithEphemeralChooseNameGetsChosenName: {
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
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter({ hasKeyword: "ephemeral" }),
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "name-card",
              suggestions: ["your-hand"],
            },
            {
              type: "grant-property",
              property: {
                kind: "name",
                value: "chosen",
              },
              target: {
                selector: "binding",
                binding: "it",
              },
              // The printed grant is unqualified. It stays with this object
              // incarnation instead of expiring merely because combat closes.
              duration: "permanent",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: shapelessFormBlue } = shapelessForm.cards;

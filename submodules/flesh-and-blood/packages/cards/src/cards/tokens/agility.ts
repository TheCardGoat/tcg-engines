import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/agility.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const agility = defineCard(fabCardIdentitiesByCanonicalId.WqTTMjDgKKCp7Lnb7LH6d, {
  abilities: {
    grantGoAgainAtStartOfTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
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
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {},
                events: ["attack"],
              },
            },
          ],
        },
      },
    },
  },
});

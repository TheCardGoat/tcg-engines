import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/genis-wotchuneed.generated.ts";

export const genisWotchuneed = defineCard(fabCardIdentitiesByCanonicalId["Mqj9K8NgJ7LFBwMKWk6L7"], {
  abilities: {
    oncePerTurnActionResourceResourceOtherPutHandBottomDeckDrawCreateSilverTokenGainNoSilverWayDrawGoAgain:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "for-each",
              target: { selector: "each-other-hero" },
              effect: {
                // That hero chooses; ability controller stays Genis ("you create Silver").
                type: "optional",
                chooser: "iteration-subject",
                effect: {
                  type: "move-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "iteration-subject",
                    zones: ["hand"],
                    count: 1,
                  },
                  to: { zone: "deck", position: "bottom" },
                },
                then: {
                  type: "sequence",
                  steps: [
                    { type: "draw", count: 1, player: "iteration-subject" },
                    {
                      type: "create-token",
                      token: "silver",
                      controller: "controller",
                    },
                  ],
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "created-this-way:silver",
                comparison: { op: "eq", value: 0 },
              },
              then: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          ],
        },
      },
  },
});

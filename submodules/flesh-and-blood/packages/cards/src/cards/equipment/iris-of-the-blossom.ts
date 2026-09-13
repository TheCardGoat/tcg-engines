import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/iris-of-the-blossom.generated.ts";

export const irisOfTheBlossom = defineCard(
  fabCardIdentitiesByCanonicalId["MNKMPhrDfjjDqqBJW99jk"],
  {
    keywords: [bladeBreak],
    abilities: {
      instantDiscardSearchDeckWhirlingMistBlossomBanishThen: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "tap-self",
            },
            {
              class: "effect",
              type: "discard",
              count: 1,
            },
          ],
        },
        condition: { type: "performed-this-turn", event: "hit", player: "controller" },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "search",
              zones: ["deck"],
              filter: {
                name: "Whirling Mist Blossom",
              },
              mayFail: true,
              to: {
                zone: "banished",
              },
              // Bind tutored card for "you may play it this turn".
              outputBinding: "it",
            },
            {
              type: "shuffle",
              zone: "deck",
            },
            {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  },
);

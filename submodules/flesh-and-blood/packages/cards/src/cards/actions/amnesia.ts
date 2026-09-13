import { FAB_PLAYER_OWNED_CARD_ZONES } from "@tcg/flesh-and-blood-types";

import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amnesia.generated.ts";

/** Cards and tokens the hit hero owns — dynamic star set, not a snapshot. */
const ownedCardsAndTokens = {
  selector: "object" as const,
  declared: "at-resolution" as const,
  player: "opponent" as const,
  playerRelation: "owner" as const,
  zones: FAB_PLAYER_OWNED_CARD_ZONES,
  count: {
    type: "all" as const,
  },
};

export const amnesia = definePitchFamily(fabPitchFamilies["amnesia"], {
  abilities: () => ({
    whenHitsHeroTokensTheyOwnLoseCanT: {
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
          type: "sequence",
          steps: [
            {
              type: "remove-property",
              property: {
                kind: "name",
                value: "*",
              },
              target: ownedCardsAndTokens,
              duration: "until-start-of-own-next-turn",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "gain-name",
              subject: ownedCardsAndTokens,
              duration: "until-start-of-own-next-turn",
            },
          ],
        },
      },
    },
  }),
});
export const { red: amnesiaRed } = amnesia.cards;

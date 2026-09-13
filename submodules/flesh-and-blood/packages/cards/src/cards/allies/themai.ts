import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/themai.generated.ts";

export const themai = defineCard(fabCardIdentitiesByCanonicalId.HBMfgJPgbmbWzJrRtJCjk, {
  abilities: {
    preventOpponentPlayingCards: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "turn-player",
        who: "self",
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        subject: { selector: "hero", who: "opponent" },
        duration: "while-condition",
      },
    },
    preventOpponentActivatingAbilities: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "turn-player",
        who: "self",
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "activate",
        subject: { selector: "hero", who: "opponent" },
        duration: "while-condition",
      },
    },
  },
});

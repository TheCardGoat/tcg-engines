import { grantKeyword, onHit, plusPower } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/beckoning-mistblade.generated.ts";

/** Printed "your next blue attack this turn". Runtime color is lowercase. */
const nextBlueAttack = {
  next: {
    color: ["blue"],
  },
  // "Attack" is the combat object identity, not the Attack card subtype;
  // a weapon attack made blue by an effect is eligible too.
  events: ["attack"],
} as const;

export const beckoningMistblade = defineCard(
  fabCardIdentitiesByCanonicalId["wcm8kJNcrzDtt6zJm9c9R"],
  {
    abilities: {
      oncePerTurnActionResourceResourceAttackGoAgain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      hitsNextBlueAttackTurnGets1PowerGoAgain: onHit({
        type: "sequence",
        steps: [
          plusPower(1, { appliesTo: nextBlueAttack }),
          grantKeyword(goAgain, { appliesTo: nextBlueAttack }),
        ],
      }),
    },
  },
);

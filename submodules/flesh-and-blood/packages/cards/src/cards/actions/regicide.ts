import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/regicide.generated.ts";

export const regicide = definePitchFamily(fabPitchFamilies["regicide"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Arakni",
    },
  ],
  abilities: () => ({
    hitsRoyalLoseGame: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Royal"],
              },
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-game",
          player: "attack-target",
        },
      },
    },
    combatChainClosesLoseGame: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "combat-chain-close",
          actor: {
            kind: "none",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-game",
          player: "controller",
        },
      },
    },
    regicideCantDefendedSameNameDefendingHerosBanishedZone: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "defend",
        filter: {
          hasStatus: "same-name-as-card-in-defending-heros-banished",
        },
        duration: "permanent",
      },
    },
  }),
});

export const { blue: regicideBlue } = regicide.cards;

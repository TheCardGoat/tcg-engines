import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/mark-of-the-huntsman.generated.ts";

export const markOfTheHuntsman = defineCard(
  fabCardIdentitiesByCanonicalId["M9DL6cPLrKkmDhGpQL7Mg"],
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
        label: {
          name: "mark",
        },
      },
      hitsChooseDestroyMark: {
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
            type: "optional",
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
                  type: "mark",
                  target: {
                    selector: "attack-target",
                  },
                },
              ],
            },
          },
        },
        label: {
          name: "mark",
        },
      },
      attackingMarkedGets1Power: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "has-status",
          status: "attacking-a-marked-hero",
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        label: {
          name: "mark",
        },
      },
    },
  },
);

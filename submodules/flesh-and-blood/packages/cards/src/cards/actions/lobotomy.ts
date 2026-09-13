import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lobotomy.generated.ts";

export const lobotomy = definePitchFamily(fabPitchFamilies["lobotomy"], {
  keywords: [stealth],
  abilities: () => ({
    attacksEquipOrbitoclastInventory: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "equip",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["inventory"],
              filter: {
                name: "Orbitoclast",
              },
              count: 1,
            },
          },
        },
      },
    },
    hitsOrbitoclastLoseAllAbilitiesDuringNextActionPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "control-object",
          filter: {
            name: "Orbitoclast",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "lose-abilities",
          filter: {
            typeBox: {
              types: ["Hero"],
            },
          },
          subject: {
            selector: "attack-target",
          },
          duration: "until-end-of-their-next-turn",
        },
      },
    },
  }),
});

export const { red: lobotomyRed } = lobotomy.cards;

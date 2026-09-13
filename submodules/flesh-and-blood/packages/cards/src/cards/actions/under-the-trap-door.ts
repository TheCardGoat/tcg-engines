import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/under-the-trap-door.generated.ts";
import { stealth } from "../shared/keywords.ts";

export const underTheTrapDoor = definePitchFamily(fabPitchFamilies["under-the-trap-door"], {
  keywords: [stealth],
  abilities: () => ({
    instantDiscardBanishTrapFromGraveyardDoPlayTurnWouldPutInto: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "if-you-do",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              typeBox: {
                subtypes: ["Trap"],
              },
            },
            count: 1,
          },
          outputBinding: "it",
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
            {
              // CR 6.4.9: this-turn standard replacement on the banished trap.
              type: "replacement",
              replacementKind: "standard",
              replaces: {
                name: "move-zone",
                to: "graveyard",
                subject: "self",
              },
              modification: {
                type: "banish",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: underTheTrapDoorBlue } = underTheTrapDoor.cards;

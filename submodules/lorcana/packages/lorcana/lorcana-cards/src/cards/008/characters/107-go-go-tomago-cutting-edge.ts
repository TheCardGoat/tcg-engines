import type { CharacterCard } from "@tcg/lorcana-types";
import { goGoTomagoCuttingEdgeI18n } from "./107-go-go-tomago-cutting-edge.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";

export const goGoTomagoCuttingEdge: CharacterCard = {
  id: "Di2",
  canonicalId: "ci_Di2",
  reprints: ["set8-107"],
  cardType: "character",
  name: "Go Go Tomago",
  version: "Cutting Edge",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  cardNumber: 107,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_85baf02feabb47349db98e61d2437f71",
    tcgPlayer: 631687,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "Evasive",
    },
    {
      title: "ZERO RESISTANCE",
      description:
        "When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Inventor"],
  abilities: [
    shift(4),
    evasive,
    {
      effect: {
        type: "conditional",
        condition: {
          type: "used-shift",
        },
        then: {
          chooser: "CONTROLLER",
          effect: {
            exerted: true,
            facedown: true,
            source: "chosen-character",
            target: "CHOSEN_CHARACTER",
            type: "put-into-inkwell",
          },
          type: "optional",
        },
      },
      id: "1l3-3",
      name: "ZERO RESISTANCE",
      text: "ZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: goGoTomagoCuttingEdgeI18n,
};

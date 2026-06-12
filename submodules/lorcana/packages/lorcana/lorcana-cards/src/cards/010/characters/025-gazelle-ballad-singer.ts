import type { CharacterCard } from "@tcg/lorcana-types";
import { singer } from "../../../helpers/abilities/singer";
import { gazelleBalladSingerI18n } from "./025-gazelle-ballad-singer.i18n";

export const gazelleBalladSinger: CharacterCard = {
  id: "OP1",
  canonicalId: "ci_OP1",
  reprints: ["set10-025"],
  cardType: "character",
  name: "Gazelle",
  version: "Ballad Singer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 25,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 8,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_089f8cf3f74944b5ad3c64b25adc7886",
    tcgPlayer: 658446,
  },
  text: [
    {
      title: "Singer 7",
    },
    {
      title: "CROWD FAVORITE",
      description:
        "When you play this character, you may put a song card from your discard on the top of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    singer(7),
    {
      id: "OP1-2",
      name: "CROWD FAVORITE",
      text: "CROWD FAVORITE When you play this character, you may put a song card from your discard on the top of your deck.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          cardType: "song",
          destination: "top-of-deck",
          target: "CONTROLLER",
          count: 1,
        },
      },
    },
  ],
  i18n: gazelleBalladSingerI18n,
};

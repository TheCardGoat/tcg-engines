import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPansShadowElusivePranksterI18n } from "./047-peter-pans-shadow-elusive-prankster.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const peterPansShadowElusivePrankster: CharacterCard = {
  id: "kjn",
  canonicalId: "ci_kjn",
  slug: "lorcana-ci_kjn",
  printings: [
    {
      id: "set14-047",
      artId: "set14-047",
      setCode: "set14",
      collectorNumber: "47",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-047"],
  cardType: "character",
  name: "Peter Pan's Shadow",
  version: "Elusive Prankster",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "014",
  cardNumber: 47,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Favorite Trick",
      description: "When you play this character, you may exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      id: "kjn-2",
      name: "Favorite Trick",
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
          type: "exert",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
      text: "Favorite Trick When you play this character, you may exert chosen opposing character.",
    },
  ],
  i18n: peterPansShadowElusivePranksterI18n,
};

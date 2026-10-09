import type { CharacterCard } from "@tcg/lorcana-types";
import { archimedesMessengerOwlI18n } from "./058-archimedes-messenger-owl.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const archimedesMessengerOwl: CharacterCard = {
  id: "ONu",
  canonicalId: "ci_ONu",
  slug: "lorcana-ci_ONu",
  printings: [
    {
      id: "set14-058",
      artId: "set14-058",
      setCode: "set14",
      collectorNumber: "58",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-058"],
  cardType: "character",
  name: "Archimedes",
  version: "Messenger Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 58,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_4012002528b34eadbcf056855a3e1412",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "THE INDIGNITY!",
      description:
        "When this character is banished in a challenge, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    rush,
    {
      id: "ONu-2",
      name: "THE INDIGNITY!",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [{ type: "in-challenge" }],
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "THE INDIGNITY! When this character is banished in a challenge, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  i18n: archimedesMessengerOwlI18n,
};

import type { CharacterCard } from "@tcg/lorcana-types";
import { goGoTomagoExtremeTesterI18n } from "./072-go-go-tomago-extreme-tester.i18n";

export const goGoTomagoExtremeTester: CharacterCard = {
  id: "BTW",
  canonicalId: "ci_BTW",
  slug: "lorcana-ci_BTW",
  printings: [
    {
      id: "set14-072",
      artId: "set14-072",
      setCode: "set14",
      collectorNumber: "72",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-072"],
  cardType: "character",
  name: "Go Go Tomago",
  version: "Extreme Tester",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 72,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3b26991f57c24178b9fa26567f742e5a",
  },
  text: [
    {
      title: "GATHERING DATA",
      description:
        "Whenever this character is challenged, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero", "Inventor"],
  abilities: [
    {
      id: "BTW-1",
      name: "GATHERING DATA",
      type: "triggered",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "GATHERING DATA Whenever this character is challenged, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  i18n: goGoTomagoExtremeTesterI18n,
};

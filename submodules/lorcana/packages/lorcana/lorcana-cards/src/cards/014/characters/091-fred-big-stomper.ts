import type { CharacterCard } from "@tcg/lorcana-types";
import { fredBigStomperI18n } from "./091-fred-big-stomper.i18n";

export const fredBigStomper: CharacterCard = {
  id: "4EQ",
  canonicalId: "ci_4EQ",
  slug: "lorcana-ci_4EQ",
  printings: [
    {
      id: "set14-091",
      artId: "set14-091",
      setCode: "set14",
      collectorNumber: "91",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-091"],
  cardType: "character",
  name: "Fred",
  version: "Big Stomper",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 91,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d69a4875b0a24e369a3635c67904cab8",
  },
  text: [
    {
      title: "KAIJU CRUSH",
      description: "When you play this character, you may banish chosen location.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    {
      id: "4EQ-1",
      name: "KAIJU CRUSH",
      type: "triggered",
      text: "KAIJU CRUSH When you play this character, you may banish chosen location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["location"],
          },
        },
      },
    },
  ],
  i18n: fredBigStomperI18n,
};

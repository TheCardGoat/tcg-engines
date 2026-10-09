import type { CharacterCard } from "@tcg/lorcana-types";
import { ernestoDeLaCruzRuthlessMusicianI18n } from "./120-ernesto-de-la-cruz-ruthless-musician.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const ernestoDeLaCruzRuthlessMusician: CharacterCard = {
  id: "OkB",
  canonicalId: "ci_OkB",
  slug: "lorcana-ci_OkB",
  printings: [
    {
      id: "set14-120",
      artId: "set14-120",
      setCode: "set14",
      collectorNumber: "120",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-120"],
  cardType: "character",
  name: "Ernesto de la Cruz",
  version: "Ruthless Musician",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 120,
  rarity: "rare",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_88b54a70ed1c4bbc96dc741952224222",
  },
  text: [
    {
      title: "Singer 8",
    },
    {
      title: "WHATEVER IT TAKES",
      description: "When you play this character, you may banish chosen character with Singer.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    singer(8),
    {
      id: "OkB-1",
      name: "WHATEVER IT TAKES",
      type: "triggered",
      text: "WHATEVER IT TAKES When you play this character, you may banish chosen character with Singer.",
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
            cardTypes: ["character"],
            filter: [
              {
                type: "has-keyword",
                keyword: "Singer",
              },
            ],
          },
        },
      },
    },
  ],
  i18n: ernestoDeLaCruzRuthlessMusicianI18n,
};

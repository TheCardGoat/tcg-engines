import type { CharacterCard } from "@tcg/lorcana-types";
import { colonelHathiOnTheMarchI18n } from "./116-colonel-hathi-on-the-march.i18n";

export const colonelHathiOnTheMarch: CharacterCard = {
  id: "vH4",
  canonicalId: "ci_vH4",
  slug: "lorcana-ci_vH4",
  printings: [
    {
      id: "set13-116",
      artId: "set13-116",
      setCode: "set13",
      collectorNumber: "116",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-116"],
  cardType: "character",
  name: "Colonel Hathi",
  version: "On the March",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "013",
  cardNumber: 116,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Hup, Two, Three, Four",
      description:
        "Whenever this character quests, you may move him to one of your locations for free.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "vH4-1",
      name: "Hup, Two, Three, Four",
      text: "Hup, Two, Three, Four Whenever this character quests, you may move him to one of your locations for free.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-to-location",
          cost: "free",
          includeSelf: true,
          character: "SELF",
          location: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["location"],
          },
        },
      },
    },
  ],
  i18n: colonelHathiOnTheMarchI18n,
};

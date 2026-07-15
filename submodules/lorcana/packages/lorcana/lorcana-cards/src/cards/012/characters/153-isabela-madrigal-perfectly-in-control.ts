import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalPerfectlyInControlI18n } from "./153-isabela-madrigal-perfectly-in-control.i18n";

export const isabelaMadrigalPerfectlyInControl: CharacterCard = {
  id: "45l",
  canonicalId: "ci_45l",
  slug: "lorcana-ci_45l",
  printings: [
    {
      id: "set12-153",
      artId: "set12-153",
      setCode: "set12",
      collectorNumber: "153",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-153"],
  cardType: "character",
  name: "Isabela Madrigal",
  version: "Perfectly in Control",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 153,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_fc677f7c6b3b4781b5772602b566a1df",
    tcgPlayer: "692185",
  },
  text: [
    {
      title: "FEEL BETTER",
      description:
        "When you play this character and whenever she quests, you may move all damage from chosen character of yours to this character.",
    },
    {
      title: "SELF-CARE",
      description: "At the end of your turn, you may remove all damage from this character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "45l-1",
      name: "FEEL BETTER",
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
          type: "move-damage",
          amount: "all",
          from: "CHOSEN_CHARACTER_OF_YOURS",
          to: "SELF",
        },
      },
      text: "FEEL BETTER When you play this character and whenever she quests, you may move all damage from chosen character of yours to this character.",
    },
    {
      id: "45l-2",
      name: "FEEL BETTER",
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
          type: "move-damage",
          amount: "all",
          from: "CHOSEN_CHARACTER_OF_YOURS",
          to: "SELF",
        },
      },
      text: "FEEL BETTER When you play this character and whenever she quests, you may move all damage from chosen character of yours to this character.",
    },
    {
      id: "45l-3",
      name: "SELF-CARE",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: "all",
          target: "SELF",
        },
      },
      text: "SELF-CARE At the end of your turn, you may remove all damage from this character.",
    },
  ],
  i18n: isabelaMadrigalPerfectlyInControlI18n,
};

import type { CharacterCard } from "@tcg/lorcana-types";
import { lordMacintoshWiryAndHighstrungI18n } from "./181-lord-macintosh-wiry-and-high-strung.i18n";

export const lordMacintoshWiryAndHighstrung: CharacterCard = {
  id: "Vqf",
  canonicalId: "ci_Vqf",
  reprints: ["set12-181"],
  cardType: "character",
  name: "Lord Macintosh",
  version: "Wiry and High-Strung",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 181,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_3f2b0324654a4a32a35a775ab667b55a",
  },
  text: [
    {
      title: "TOUGH IT OUT",
      description:
        "This character may enter play exerted to give chosen character Resist +2 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "Vqf-1",
      name: "TOUGH IT OUT",
      type: "static",
      text: "TOUGH IT OUT This character may enter play exerted to give chosen character Resist +2 until the start of your next turn.",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
    {
      id: "Vqf-2",
      name: "TOUGH IT OUT",
      type: "triggered",
      text: "TOUGH IT OUT This character may enter play exerted to give chosen character Resist +2 until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        duration: "until-start-of-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: lordMacintoshWiryAndHighstrungI18n,
};

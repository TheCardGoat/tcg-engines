import type { CharacterCard } from "@tcg/lorcana-types";
import { gantuExperiencedEnforcerI18n } from "./199-gantu-experienced-enforcer.i18n";

export const gantuExperiencedEnforcer: CharacterCard = {
  id: "HlC",
  canonicalId: "ci_HlC",
  reprints: ["set7-199"],
  cardType: "character",
  name: "Gantu",
  version: "Experienced Enforcer",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "007",
  cardNumber: 199,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_9cc5e63998164343909390b767c6d3ae",
    tcgPlayer: 618733,
  },
  text: [
    {
      title: "CLOSE ALL CHANNELS",
      description:
        "When you play this character, characters can't exert to sing songs until the start of your next turn.",
    },
    {
      title: "DON'T GET ANY IDEAS",
      description:
        "Each player pays 2 {I} more to play actions or items. (This doesn't apply to singing songs.)",
    },
  ],
  classifications: ["Storyborn", "Alien", "Captain"],
  abilities: [
    {
      id: "gantu-ee-1",
      name: "CLOSE ALL CHANNELS",
      text: "CLOSE ALL CHANNELS When you play this character, characters can't exert to sing songs until the start of your next turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "ALL_CHARACTERS",
        duration: "until-start-of-next-turn",
      },
    },
    {
      id: "gantu-ee-2",
      name: "DON'T GET ANY IDEAS",
      text: "DON'T GET ANY IDEAS Each player pays 2 more to play actions or items. (This doesn't apply to singing songs.)",
      type: "static",
      effect: {
        type: "cost-increase",
        amount: 2,
        cardType: ["action", "item"],
      },
    },
  ],
  i18n: gantuExperiencedEnforcerI18n,
};

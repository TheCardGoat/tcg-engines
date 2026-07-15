import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaSeaWitchEpicI18n } from "./208-ursula-sea-witch-epic.i18n";

export const ursulaSeaWitchEpic: CharacterCard = {
  id: "gms",
  canonicalId: "ci_1J4",
  slug: "lorcana-ci_1J4",
  printings: [
    {
      id: "set9-208-epic",
      artId: "ci_1J4-epic",
      setCode: "set9",
      collectorNumber: "208",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set3-059", "set9-037"],
  cardType: "character",
  name: "Ursula",
  version: "Sea Witch",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 208,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_48ccbae93afd4032a54bf09f03f6a0c2",
    tcgPlayer: "650145",
  },
  text: [
    {
      title: "YOU'RE TOO LATE",
      description:
        "Whenever this character quests, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "14O-1",
      name: "YOU'RE TOO LATE",
      text: "YOU'RE TOO LATE Whenever this character quests, chosen opposing character can't ready at the start of their next turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        duration: "their-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: ursulaSeaWitchEpicI18n,
};

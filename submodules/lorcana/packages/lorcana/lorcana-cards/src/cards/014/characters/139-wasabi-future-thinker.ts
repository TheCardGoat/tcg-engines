import type { CharacterCard } from "@tcg/lorcana-types";
import { wasabiFutureThinkerI18n } from "./139-wasabi-future-thinker.i18n";

export const wasabiFutureThinker: CharacterCard = {
  id: "bzr",
  canonicalId: "ci_bzr",
  slug: "lorcana-ci_bzr",
  printings: [
    {
      id: "set14-139",
      artId: "set14-139",
      setCode: "set14",
      collectorNumber: "139",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-139"],
  cardType: "character",
  name: "Wasabi",
  version: "Future Thinker",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 139,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5033cd4933af467c94ab06533c036f20",
  },
  text: [
    {
      title: "SAFETY FIRST",
      description:
        "When you play this character, if you removed an ink drop to play him, your other characters gain Resist +1 and Ward until the start of your next turn. (Damage dealt to them is reduced by 1. Opponents can't choose them except to challenge.)",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero", "Inventor"],
  abilities: [
    {
      id: "wasabi-1",
      name: "SAFETY FIRST",
      type: "triggered",
      text: "SAFETY FIRST When you play this character, if you removed an ink drop to play him, your other characters gain Resist +1 and Ward until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "play-context",
        context: "paid-with-ink-drop",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 1,
            duration: "until-start-of-next-turn",
            target: "YOUR_OTHER_CHARACTERS",
          },
          {
            type: "gain-keyword",
            keyword: "Ward",
            duration: "until-start-of-next-turn",
            target: "YOUR_OTHER_CHARACTERS",
          },
        ],
      },
    },
  ],
  i18n: wasabiFutureThinkerI18n,
};

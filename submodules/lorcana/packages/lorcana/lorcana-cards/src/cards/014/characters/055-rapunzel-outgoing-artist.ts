import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelOutgoingArtistI18n } from "./055-rapunzel-outgoing-artist.i18n";

export const rapunzelOutgoingArtist: CharacterCard = {
  id: "SHv",
  canonicalId: "ci_SHv",
  slug: "lorcana-ci_SHv",
  printings: [
    {
      id: "set14-055",
      artId: "set14-055",
      setCode: "set14",
      collectorNumber: "55",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-055"],
  cardType: "character",
  name: "Rapunzel",
  version: "Outgoing Artist",
  inkType: ["amethyst"],
  franchise: "Tangled",
  set: "014",
  cardNumber: 55,
  rarity: "legendary",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Picture Perfect",
      description:
        "Whenever this character quests, you may choose another character and reveal a character card in your hand. If they have the same name, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "rapunzel-1",
      name: "Picture Perfect",
      type: "triggered",
      text: "Picture Perfect Whenever this character quests, you may choose another character and reveal a character card in your hand. If they have the same name, draw a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "select-target",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
            },
            {
              type: "select-target",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["hand"],
                cardTypes: ["character"],
              },
            },
            { type: "reveal", target: "previous-target", amount: 1 },
            {
              type: "conditional",
              condition: { type: "revealed-matches-chosen-name" },
              then: { type: "draw", amount: 1, target: "CONTROLLER" },
            },
          ],
        },
      },
    },
  ],
  i18n: rapunzelOutgoingArtistI18n,
};

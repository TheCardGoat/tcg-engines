import type { LeaderCard } from "@tcg/op-types";
import { eventLeaderMonkeyDLuffyI18n } from "./event-leader-monkey-d-luffy.i18n.ts";

// Internal catalog identity: the official event card has no printed card number.
export const eventLeaderMonkeyDLuffy: LeaderCard = {
  id: "EVENT-LEADER-MONKEY-D-LUFFY",
  canonicalId: "EVENT-LEADER-MONKEY-D-LUFFY",
  slug: "monkey-d-luffy/event-leader",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "EVENT-LEADER-MONKEY-D-LUFFY",
      artId: "EVENT-LEADER-MONKEY-D-LUFFY",
      setCode: "EVENT",
      // Unnumbered official printing; internal catalog ID is not a collector number.
      collectorNumber: "",
      rarity: "P",
      imageUrl:
        "https://en.onepiece-cardgame.com/onepiececg/bccard/en/news/2026/07/22/R1pSUVJg9PtQWvsu/batch_OPCG_card_L.webp",
    },
  ],
  cardType: "leader",
  color: ["red", "green", "blue", "purple", "black", "yellow"],
  rarity: "P",
  setId: "EVENT",
  power: 5000,
  life: 5,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  designatedEventsOnly: true,
  rulesIdentity: { allNames: true, allTraits: true, allAttributes: true },
  effect:
    "This Leader can only be used in designated events according to the rules.\nThis Leader is treated as a card with all card names, types, and attributes according to the rules.",
  i18n: eventLeaderMonkeyDLuffyI18n,
};

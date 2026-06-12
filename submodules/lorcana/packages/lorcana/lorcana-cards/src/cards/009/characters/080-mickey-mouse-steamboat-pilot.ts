import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseSteamboatPilot as canonicalMickeyMouseSteamboatPilot } from "../../001";

export const mickeyMouseSteamboatPilot: CharacterCard = {
  ...canonicalMickeyMouseSteamboatPilot,
  id: "vmJ",
  reprints: ["set1-089", "set9-080"],
  set: "009",
  cardNumber: 80,
  rarity: "common",
  externalIds: {
    lorcast: "crd_d72f9b00497a4ff0ac7ddb0f85da659d",
    tcgPlayer: 651112,
  },
};

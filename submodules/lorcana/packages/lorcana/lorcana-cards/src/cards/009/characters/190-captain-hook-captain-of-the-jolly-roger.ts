import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookCaptainOfTheJollyRoger as canonicalCaptainHookCaptainOfTheJollyRoger } from "../../001";

export const captainHookCaptainOfTheJollyRoger: CharacterCard = {
  ...canonicalCaptainHookCaptainOfTheJollyRoger,
  id: "p5e",
  reprints: ["set1-173", "set9-190"],
  set: "009",
  cardNumber: 190,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_79c990fe5bf14f4bbd075b6f80ad4290",
    tcgPlayer: 650123,
  },
};

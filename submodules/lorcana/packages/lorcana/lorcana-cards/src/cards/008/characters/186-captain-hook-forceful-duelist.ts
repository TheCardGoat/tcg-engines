import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookForcefulDuelist as canonicalCaptainHookForcefulDuelist } from "../../001";

export const captainHookForcefulDuelist: CharacterCard = {
  ...canonicalCaptainHookForcefulDuelist,
  id: "WLW",
  reprints: ["set1-174", "set8-186"],
  set: "008",
  cardNumber: 186,
  rarity: "common",
  externalIds: {
    lorcast: "crd_269551f76e10446cbf947278bf155889",
    tcgPlayer: 631706,
  },
};

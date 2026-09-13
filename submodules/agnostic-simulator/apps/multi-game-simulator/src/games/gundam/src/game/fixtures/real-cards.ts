import {
  gd01AShowOfResolve100,
  gd01Bucue055,
  gd01ExtremeHatred112,
  gd01GundamSandrock028,
  gd01InterceptOrders099,
  gd01SignsOfARevolution104,
  gd01ThePathToVictoryOrDefeat109,
  gd01TheWitchAndTheBride117,
  gd01WingGundamZero024,
  gd02GundamBarbatos1stForm054,
  gd02GundamGusionRebake055,
  gd02GundamKimaris070,
  gd02GundamX053,
  gd04Gundam073,
  gd04GundamKyrios034,
  gd04OverwhelmingPressure109,
  st01AmuroRay010,
  st01AsticassiaSchoolOfTechnologyEarthHouse016,
  st01DemiTrainer008,
  st01Gm005,
  st01Guncannon003,
  st01Gundam001,
  st01GundamMaForm002,
  st01Guntank004,
  st01Resource001,
  st01SulettaMercury011,
  st01WhiteBase015,
  st03Gouf009,
  st03Zaku008,
  st04HawkOfEndymion013,
  st04StrikerPack012,
  st07ArmedIntervention013,
  st08Penelope006,
} from "@tcg/gundam-cards";
import type { Card } from "@tcg/gundam-types";

const MAIN_DECK_FILLERS: readonly Card[] = [
  st01Gm005,
  st01DemiTrainer008,
  st01Guncannon003,
  st01Guntank004,
  st03Zaku008,
  st03Gouf009,
  st01Gundam001,
  st01GundamMaForm002,
  st01AmuroRay010,
  st01SulettaMercury011,
  st01WhiteBase015,
  st01AsticassiaSchoolOfTechnologyEarthHouse016,
];

const SYNTHETIC_NAME_TO_REAL_CARD: Readonly<Record<string, Card>> = {
  "A Show of Resolve": gd01AShowOfResolve100,
  Aggressor: gd02GundamKimaris070,
  "Amuro Ray": st01AmuroRay010,
  "Buff Gundam": st03Zaku008,
  Bulwark: st01Guncannon003,
  "Burst Shield": gd01SignsOfARevolution104,
  "Char's Zaku": st03Zaku008,
  "Colony Base": st01WhiteBase015,
  Dom: st03Gouf009,
  "Enemy Gundam": st01Gundam001,
  GM: st01Gm005,
  "GM Jim": st01Guntank004,
  Gouf: st03Gouf009,
  Guncannon: st01Guncannon003,
  "Guncannon Blocker": st01DemiTrainer008,
  "Gundam Base": st01Gundam001,
  "Gundam FS": gd04GundamKyrios034,
  "Gundam GP01": st01Gundam001,
  "Gundam HM": gd01WingGundamZero024,
  "Gundam Supp": gd02GundamX053,
  "Kamikaze Zaku": st01Gundam001,
  Jet: gd01GundamSandrock028,
  "Optional Draw": gd01ThePathToVictoryOrDefeat109,
  "Recon Gundam": gd02GundamBarbatos1stForm054,
  Receiver: st01Guncannon003,
  "Rested Mock": gd02GundamGusionRebake055,
  "Review Target": st01Gundam001,
  "RX-78-2": st01Gm005,
  "Scout Drone": gd04Gundam073,
  "Shielded Fragile A": st01Gm005,
  "Shielded Fragile B": st01DemiTrainer008,
  "Stand By": gd01InterceptOrders099,
  "Striker Pack": st04StrikerPack012,
  Supporter: gd01Bucue055,
  "Survey the Deck": gd01ThePathToVictoryOrDefeat109,
  "Tactical Draw": st07ArmedIntervention013,
  "The Path to Victory or Defeat": gd01ThePathToVictoryOrDefeat109,
  "The Witch and the Bride": gd01TheWitchAndTheBride117,
  "Tough Mock": st01Gundam001,
  "Trashed Fragile": st01Guntank004,
  "Viewer Mock": st01Guncannon003,
  "White Base": st01WhiteBase015,
  "Zaku II": st01Guncannon003,
};

export function realMainDeckCards(count: number): readonly Card[] {
  return Array.from(
    { length: count },
    (_, index) => MAIN_DECK_FILLERS[index % MAIN_DECK_FILLERS.length]!,
  );
}

export function realResourceCards(count: number): readonly Card[] {
  return Array.from({ length: count }, () => st01Resource001);
}

export function realShieldCards(count: number): readonly Card[] {
  return realMainDeckCards(count);
}

export function resolveVisualFixtureCard(card: Card): Card {
  if (!card.cardNumber.startsWith("TEST-")) {
    return card;
  }

  if (card.type === "resource") {
    return st01Resource001;
  }

  const numberedUnit = /^Unit (\d{2})$/u.exec(card.name);
  if (numberedUnit) {
    const index = Number(numberedUnit[1]) - 1;
    return MAIN_DECK_FILLERS[index % MAIN_DECK_FILLERS.length]!;
  }

  if (card.name === "Supply Drop") {
    return gd01AShowOfResolve100;
  }
  if (card.name === "Strategic Redeployment") {
    return st08Penelope006;
  }
  if (card.name === "Optional Protocol") {
    return gd04OverwhelmingPressure109;
  }
  if (card.name === "Deck Recon") {
    return gd01ThePathToVictoryOrDefeat109;
  }
  if (card.name === "Hawk of Endymion") {
    return st04HawkOfEndymion013;
  }
  if (card.name === "Extreme Hatred") {
    return gd01ExtremeHatred112;
  }

  const resolved = SYNTHETIC_NAME_TO_REAL_CARD[card.name];
  if (!resolved) {
    throw new Error(
      `Gundam visual fixture attempted to render synthetic card ${card.cardNumber} (${card.name})`,
    );
  }
  return resolved;
}

export {
  gd01WingGundamZero024,
  st01AmuroRay010,
  st01AsticassiaSchoolOfTechnologyEarthHouse016,
  st01DemiTrainer008,
  st01Gm005,
  st01Guncannon003,
  st01Gundam001,
  st01Guntank004,
  st01SulettaMercury011,
  st01WhiteBase015,
  st03Gouf009,
};

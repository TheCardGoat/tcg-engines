import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import {
  duringOpponentsTurn,
  ifYouHaveACharacterHere,
} from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { actionCardsInHand } from "@lorcanito/lorcana-engine/abilities/target";
import {
  allOpposingCharacters,
  anyCardTargetYouOwn,
  chosenCharacter,
  chosenCharacterOrLocation,
  chosenOpposingCharacter,
  self,
  thisCard,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  whenChallenged,
  whenThisCharacterBanished,
  whenYouMoveACharacterHere,
} from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { whileYouHaveCharactersHere } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import {
  dealDamageEffect,
  discardACard,
  drawXCards,
  mayBanish,
  moveDamageEffect,
  opponentLoseLore,
  putTopCardOfYourDeckIntoYourInkwellExerted,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

export const galacticCouncilChamber: LorcanitoLocationCard = {
  id: "yrd",
  name: "Galactic Council Chamber",
  title: "Courtroom",
  characteristics: ["location"],
  text: "**FEDERATION DECREE** While you have an Alien or Robot character here, this location can’t be challenged.",
  type: "location",
  abilities: [
    whileYouHaveCharactersHere({
      name: "Federation Decree",
      text: "While you have an Alien or Robot character here, this location can’t be challenged.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
          filters: [
            {
              filter: "characteristics",
              value: ["alien", "robot"],
              conjunction: "or",
            },
          ],
        },
      ],
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "protection",
            from: "challenge",
            target: allOpposingCharacters,
          },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  willpower: 7,
  lore: 1,
  illustrator: "Kaitlin Cuthbertson",
  number: 204,
  set: "006",
  rarity: "common",
  moveCost: 1,
};

export const fairyShipRoyalVessel: LorcanitoLocationCard = {
  id: "bi4",
  name: "Fairy Ship",
  title: "Royal Vessel",
  characteristics: [],
  text: "",
  type: "location",
  abilities: [],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  moveCost: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Kristen Kaluba",
  number: 68,
  set: "006",
  rarity: "common",
};
export const mysticalTreeMamaOdiesHome: LorcanitoLocationCard = {
  id: "ghp",
  missingTestCase: true,
  name: "Mystical Tree",
  title: "Mama Odie's Home",
  characteristics: [],
  text: "NOT BAD At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.\n\nHARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.",
  type: "location",
  abilities: [
    atTheStartOfYourTurn({
      name: "Not Bad",
      text: "At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
        },
      ],
      effects: [
        moveDamageEffect({
          amount: 1,
          from: chosenCharacter,
          to: chosenOpposingCharacter,
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  moveCost: 1,
  willpower: 7,
  illustrator: "Roberto Gatto",
  number: 69,
  set: "006",
  rarity: "rare",
};
export const rescueRangersSubmarineMobileHeadquarters: LorcanitoLocationCard = {
  id: "hwj",
  name: "Rescue Rangers Submarine",
  title: "Mobile Headquarters",
  characteristics: ["location"],
  text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
  type: "location",
  abilities: [
    atTheStartOfYourTurn({
      name: "Planning Session",
      text: "At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
      optional: true,
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
        },
      ],
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  moveCost: 1,
  willpower: 8,
  illustrator: "Geoffrey Boudout",
  number: 169,
  set: "006",
  rarity: "rare",
};

export const sugarRushSpeedwayFinishLine: LorcanitoLocationCard = {
  id: "f7t",
  name: "Sugar Rush Speedway",
  title: "Finish Line",
  characteristics: ["location"],
  text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
  type: "location",
  abilities: [
    whenYouMoveACharacterHere({
      name: "Bring It Home, Little One!",
      text: "When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
      optional: true,
      movingFrom: anyCardTargetYouOwn.filters,
      effects: [mayBanish(thisCard), youGainLore(3), drawXCards(3)],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  willpower: 7,
  moveCost: 6,
  illustrator: "Roberto Gatto",
  number: 35,
  set: "006",
  rarity: "super_rare",
};

export const owlIslandSecludedEntrance: LorcanitoLocationCard = {
  id: "ox9",
  name: "Owl Island",
  title: "Secluded Entrance",
  characteristics: ["location"],
  text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.\nLOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
  type: "location",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Teamwork",
      text: "For each character you have here, you pay 1 {I} less for the first action you play each turn.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
        },
        { type: "played-actions", comparison: { operator: "eq", value: 0 } },
      ],
      effects: [
        {
          type: "attribute",
          attribute: "cost",
          amount: {
            dynamic: true,
            sourceAttribute: "chars-at-location",
          },
          modifier: "subtract",
          duration: "static",
          target: actionCardsInHand,
        },
      ],
    },
    wheneverPlays({
      name: "Lots to Learn",
      text: "Whenever you play a second action in a turn, gain 3 lore.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "owner", value: "self" },
          {
            filter: "turn",
            value: "played",
            targetFilter: [{ filter: "type", value: "action" }],
            comparison: { operator: "eq", value: 2 },
          },
        ],
      },
      effects: [youGainLore(3)],
    }),
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 3,
  willpower: 6,
  moveCost: 1,
  illustrator: "Alex Accorsi",
  number: 102,
  set: "006",
  rarity: "rare",
};
export const flotillaCoconutArmada: LorcanitoLocationCard = {
  id: "twz",
  missingTestCase: true,
  name: "Flotilla",
  title: "Coconut Armada",
  characteristics: ["location"],
  text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
  type: "location",
  abilities: [
    atTheStartOfYourTurn({
      name: "Tiny Thieves",
      text: "At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
      conditions: [ifYouHaveACharacterHere],
      effects: [youGainLore(1), opponentLoseLore(1)],
    }),
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 2,
  willpower: 6,
  moveCost: 2,
  illustrator: "Jiahui Eva Gao",
  number: 135,
  set: "006",
  rarity: "rare",
};
export const instituteOfTechnologyPrestigiousUniversity: LorcanitoLocationCard =
  {
    id: "hsg",
    name: "Institute of Technology",
    title: "Prestigious University",
    characteristics: ["location"],
    text: "WELCOME TO THE LAB Inventor characters get +1 {W} while here.\nPUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.",
    type: "location",
    abilities: [
      atTheStartOfYourTurn({
        name: "Push the Boundaries",
        text: "At the start of your turn, if you have a character here, gain 1 lore.",
        conditions: [ifYouHaveACharacterHere],
        effects: [youGainLore(1)],
      }),
      gainAbilityWhileHere({
        name: "Welcome to the Lab",
        text: "Characters get +1 {W} while here.",
        ability: {
          type: "static",
          ability: "effects",
          effects: [
            {
              type: "attribute",
              attribute: "willpower",
              amount: 1,
              modifier: "add",
              duration: "static",
              target: thisCharacter,
            },
          ],
        },
      }),
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 1,
    moveCost: 1,
    willpower: 5,
    illustrator: "Gabe",
    number: 170,
    set: "006",
    rarity: "common",
  };

export const hundredAcreIslandPoohsHome: LorcanitoLocationCard = {
  id: "qkp",
  missingTestCase: true,
  name: "Hundred Acre Island",
  title: "Pooh's Home",
  characteristics: ["location"],
  text: "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Friends Forever",
      text: "During an opponent's turn, whenever a character is banished here, gain 1 lore.",
      conditions: [duringOpponentsTurn],
      ability: whenThisCharacterBanished({
        name: "Friends Forever",
        text: "During an opponent's turn, whenever a character is banished here, gain 1 lore.",
        effects: [
          {
            type: "lore",
            amount: 1,
            modifier: "add",
            target: self,
          },
        ],
      }),
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  willpower: 5,
  moveCost: 1,
  illustrator: "Andreas Rocha",
  number: 34,
  set: "006",
  rarity: "common",
};
export const skullRockIsolatedFortress: LorcanitoLocationCard = {
  id: "sv6",
  missingTestCase: true,
  name: "Skull Rock",
  title: "Isolated Fortress",
  characteristics: [],
  text: "FAMILIAR GROUND Characters get +1 {S} while here.\nSAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Family Ground",
      text: "Characters get +1 {S} while here.",
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 1,
            modifier: "add",
            duration: "static",
            target: thisCharacter,
          },
        ],
      },
    }),
    atTheStartOfYourTurn({
      name: "Safe Haven",
      text: "At the start of your turn, if you have a Pirate character here, gain 1 lore.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
          filters: [
            {
              filter: "characteristics",
              value: ["pirate"],
            },
          ],
        },
      ],
      effects: [youGainLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  willpower: 6,
  moveCost: 1,
  illustrator: "Nicolas Ky",
  number: 136,
  set: "006",
  rarity: "common",
};

export const treasureMountainAzuriteSeaIsland: LorcanitoLocationCard = {
  id: "nmj",
  name: "Treasure Mountain",
  title: "Azurite Sea Island",
  characteristics: ["location"],
  text: "SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
  type: "location",
  abilities: [
    atTheStartOfYourTurn({
      name: "Secret Weapon",
      text: "At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
      effects: [
        dealDamageEffect(
          {
            dynamic: true,
            sourceAttribute: "chars-at-location",
          },
          chosenCharacterOrLocation,
        ),
      ],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 5,
  lore: 2,
  willpower: 9,
  illustrator: "Sam Nielson",
  number: 203,
  set: "006",
  rarity: "rare",
  moveCost: 2,
};

export const perilousMazeWateryLabyrinth: LorcanitoLocationCard = {
  id: "jrf",
  name: "Perilous Maze",
  title: "Watery Labyrinth",
  characteristics: ["location"],
  text: "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Lost In The Waves",
      text: "Whenever a character is challenged while here, each opponent chooses and discards a card.",
      ability: whenChallenged({
        name: "Lost In The Waves",
        text: "Whenever a character is challenged while here, each opponent chooses and discards a card.",
        responder: "opponent",
        effects: [discardACard],
      }),
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  willpower: 8,
  lore: 1,
  moveCost: 1,
  illustrator: "Matthew Oates",
  number: 101,
  set: "006",
  rarity: "common",
};

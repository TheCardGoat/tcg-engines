// Export all target types for easier imports

export * from "./card-target";
export * from "./player-target";
export * from "./targets";

// Legacy target exports for backward compatibility
export const self: any = {
  type: "card",
  owner: "self",
  filters: [{ filter: "source", value: "self" }],
};

export const thisCharacter: any = {
  type: "card",
  owner: "self",
  filters: [{ filter: "source", value: "self" }],
};

export const chosenCharacter: any = {
  type: "card",
  filters: [],
};

export const chosenOpposingCharacter: any = {
  type: "card",
  owner: "opponent",
  filters: [],
};

export const opposingCharacters: any = {
  type: "card",
  owner: "opponent",
  filters: [],
};

export const eachOpposingCharacter: any = {
  type: "card",
  owner: "opponent",
  filters: [],
};

export const allYourCharacters: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const oneOfYourOtherCharacters: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const targetCard: any = {
  type: "card",
  filters: [],
};

export const anotherChosenCharacterTarget: any = {
  type: "card",
  filters: [],
};

export const anotherChosenCharacter: any = {
  type: "card",
  filters: [],
};
export const itemsYouControl: any = {
  type: "card",
  cardType: "item",
  owner: "self",
  filters: [],
};

export const anotherChosenCharOfYours: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const chosenOpposingDamagedCharacter: any = {
  type: "card",
  owner: "opponent",
  filters: [],
};

export const yourOtherCharacters: any = {
  type: "card",
  owner: "self",
  filters: [],
};
export const chosenItemOfYours: any = {
  type: "card",
  cardType: "item",
  owner: "self",
  filters: [],
};

export const chosenItem: any = {
  type: "card",
  cardType: "item",
  filters: [],
};

export const anyCard: any = {
  type: "card",
  filters: [],
};

export const namedCard: any = {
  type: "card",
  filters: [],
};

export const chosenCharacterOfYours: any = {
  type: "card",
  owner: "self",
  filters: [],
};
export const chosenCharacterOfYoursTarget: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const allOpposingCharacters: any = {
  type: "card",
  owner: "opponent",
  filters: [],
};
export const yourBanishedItems: any = {
  type: "card",
  cardType: "item",
  owner: "self",
  zone: "discard",
};
export const yourLocationCards: any = {
  type: "card",
  cardType: "location",
  owner: "self",
  filters: [],
};

export const withCostXorLess: any = {
  type: "card",
  filters: [],
};

export const opponent: any = {
  type: "player",
  player: "opponent",
};

export const allOtherCharactersHere: any = {
  type: "card",
  owner: "any",
  filters: [],
};
export const chosenItemOfYoursInHand: any = {
  type: "card",
  cardType: "item",
  owner: "self",
  zone: "hand",
  filters: [],
};

export const chosenCharacterOfYoursIncludingSelf: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const chosenLocation: any = {
  type: "card",
  cardType: "location",
  filters: [],
};

export const chosenCharacterNamed: any = {
  type: "card",
  filters: [],
};
export const chosenCharacterOfYoursAtLocation: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const chosenOtherCharacterOfYours: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const chosenHeroCharacter: any = {
  type: "card",
  filters: [],
};

export const chosenCharacterOrLocationTarget: any = {
  type: "card",
  filters: [],
};

export const thisLocation: any = {
  type: "card",
  owner: "self",
  filters: [],
};
export const yourBanishedLocations: any = {
  type: "card",
  cardType: "location",
  owner: "self",
  zone: "discard",
  filters: [],
};

export const targetCardsGains: any = {
  type: "card",
  filters: [],
};

export const chosenDamagedCharacterTarget: any = {
  type: "card",
  status: "damaged",
  filters: [],
};

// More legacy target aliases
export const chosenCharacterOrLocation = chosenCharacterOrLocationTarget;
export const yourCharacters = allYourCharacters;

// Legacy aliases for target variations
export const chosenDamagedCharacter = chosenDamagedCharacterTarget;
export const anotherChosenCharacterOfYours = anotherChosenCharOfYours;
export const yourCharactersNamed = (name: string) => ({
  type: "card",
  owner: "self",
  filters: [
    {
      filter: "attribute",
      value: "name",
      comparison: { operator: "eq", value: name.toLowerCase() },
    },
  ],
});
export const eachOfYourCharacters = yourCharacters;
export const allCharacters = allYourCharacters;
// Legacy aliases with corrected mappings
export const sourceCardTarget = self;
export const sourceTarget = self;
export const chosenExertedCharacterTarget: any = {
  type: "card",
  status: "exerted",
  filters: [],
};

export const chosenYourExertedCharacter: any = {
  type: "card",
  status: "exerted",
  owner: "self",
  filters: [],
};
export const anyNumberOfYourCharacters = allYourCharacters;
export const yourDamagedCharactersFilter: any = {
  type: "card",
  owner: "self",
  status: "damaged",
  filters: [],
};

export const yourDamagedCharacters: any = {
  type: "card",
  owner: "self",
  status: "damaged",
  filters: [],
};
export const chosenCharacterWithStrengthXorLess = chosenCharacter;
export const thisCard = self;
export const chosenItemOrLocation = chosenLocation;
export const eachOpposingReadyCharacter = eachOpposingCharacter;
export const eachOpposingDamagedCharacter = chosenOpposingDamagedCharacter;
export const readyItemsYouControl = itemsYouControl;
export const chosenYourDamagedCharacter = chosenDamagedCharacter;
export const chosenOpposingReadyCharacter = chosenOpposingCharacter;
export const chosenAlienCharacter = chosenCharacter;
export const chosenPirateCharacter: any = {
  type: "card",
  characteristics: ["pirate"],
  filters: [],
};

export const yourOtherLocations: any = {
  type: "card",
  cardType: "location",
  owner: "self",
  filters: [],
};

// Additional legacy targets
export const chosenCardFromYourHand: any = {
  type: "card",
  zone: "hand",
  owner: "self",
  filters: [],
};

export const chosenPlayer: any = {
  type: "player",
};

export const anyTarget: any = {
  type: "card",
  filters: [],
};

export const oneOfYourOpponentsCharactersItemsOrLocations: any = {
  type: "card",
  owner: "opponent",
  filters: [],
};

export const anyCardTargetYouOwn: any = {
  type: "card",
  owner: "self",
  filters: [],
};
export const actionCardsInHand: any = {
  type: "card",
  cardType: "action",
  zone: "hand",
  filters: [],
};

export const chosenCharacterCharacteristic: any = {
  type: "card",
  filters: [],
};

export const topCardOfYourDeck: any = {
  type: "card",
  zone: "deck",
  owner: "self",
  filters: [],
};

export const yourFloodbornCharsThatHaveACardUnder: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const eachCharacterInPlay: any = {
  type: "card",
  zone: "play",
  filters: [],
};

export const withStrengthXorMore: any = {
  type: "card",
  filters: [],
};
export const allYourCharacteristicCharacters: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const allYourCharactersWithAnSpecificAbility: any = {
  type: "card",
  owner: "self",
  filters: [],
};

export const parentsTarget: any = {
  type: "card",
  filters: [],
};

export const eachOtherCharacterInPlay: any = {
  type: "card",
  zone: "play",
  filters: [],
};

export const allOpposingItems: any = {
  type: "card",
  cardType: "item",
  owner: "opponent",
  filters: [],
};

export const allOpposingLocations: any = {
  type: "card",
  cardType: "location",
  owner: "opponent",
  filters: [],
};

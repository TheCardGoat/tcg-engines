// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   Type ActivatedAbility,
//   ChallengerAbility,
//   ExertCharCost,
//   Type GainAbilityStaticAbility,
//   Type ResolutionAbility,
//   ResistAbility,
//   YourOtherCharactersGet,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { forEachItemYouHaveInPlay } from "@lorcanito/lorcana-engine/abilities/amounts";
// Import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// Import { yourDamagedCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// Import {
//   AnyTarget,
//   ChosenCharacter,
//   ChosenCharacterOfYours,
//   ChosenDamagedCharacter,
//   EachOfYourCharacters,
//   OneOfYourOpponentsCharactersItemsOrLocations,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverIsReturnedToHand } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import {
//   BanishChosenItem,
//   DrawACard,
//   EnterPlaysExerted,
//   MayBanish,
//   MillOpponentXCards,
//   MoveToLocation,
//   ReadyAndCantQuest,
//   RemoveDamageEffect,
//   ReturnChosenCharacterWithStrength,
//   RevealTopOfDeckPutInHandOrDeck,
//   YouGainLore,
//   YouMayDrawThenChooseAndDiscard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const noRoomNoRoom: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "ink", amount: 1 }, { type: "exert" }],
//   Name: "No Room, No Room",
//   Text: "{E}, 1 {I} – Each opponent puts the top card of their deck into their discard.",
//   Effects: millOpponentXCards(1),
// };
// Export const makeARescue: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "ink", amount: 3 }, { type: "exert" }],
//   Name: "Make A Rescue",
//   Text: "Return a Pirate character card from your discard to your hand.",
//   Effects: [
//     {
//       Type: "move",
//       To: "hand",
//       Target: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: ["character"] },
//           { filter: "characteristics", value: ["pirate"] },
//           { filter: "zone", value: "discard" },
//         ],
//       },
//     },
//   ],
// };
// Export const faithAndTrust: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "ink", amount: 2 }, { type: "exert" }],
//   Effects: [
//     {
//       Type: "ability",
//       Ability: "evasive",
//       Modifier: "add",
//       Duration: "next_turn",
//       Until: true,
//       Target: chosenCharacter,
//     },
//     {
//       Type: "ability",
//       Ability: "custom",
//       CustomAbility: challengerAbility(2),
//       Modifier: "add",
//       Duration: "next_turn",
//       Until: true,
//       Target: chosenCharacter,
//     },
//   ],
// };
// Export const glitteringAccess: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "ink", amount: 1 }, { type: "exert" }, { type: "banish" }],
//   Effects: readyAndCantQuest(chosenCharacterOfYours),
// };
// Export const thereYouGo: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "banish" }],
//   ResolveEffectsIndividually: true,
//   Effects: [removeDamageEffect(2, eachOfYourCharacters, true), drawACard],
// };
// Export const resourceAllocation: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
//   Effects: [returnChosenCharacterWithStrength(2, "lte")],
// };
// Export const tenThousandMedicalProcedures: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "exert" }],
//   Effects: [
//     {
//       Type: "modal",
//       // TODO: Get rid of target
//       Target: chosenCharacter,
//       Modes: [
//         {
//           Id: "1",
//           Text: "Remove up to 1 damage from chosen character.",
//           Effects: [removeDamageEffect(1, chosenCharacter, true)],
//         },
//         {
//           Id: "2",
//           Text: "If you have a Robot character in play, remove up to 3 damage from chosen character.",
//           Effects: [removeDamageEffect(3, chosenCharacter, true)],
//         },
//       ],
//     },
//   ],
// };
// Export const spycraft: ActivatedAbility = {
//   ...youMayDrawThenChooseAndDiscard,
//   Type: "activated",
//   Costs: [{ type: "exert" }],
// };
// Export const handleWithCare: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//   Effects: [
//     {
//       Type: "ability",
//       Ability: "bodyguard",
//       Modifier: "add",
//       Duration: "next_turn",
//       Until: true,
//       Target: chosenCharacter,
//     },
//   ],
// };
// Export const happyFace: ResolutionAbility = {
//   Type: "resolution",
//   Name: "Happy Face",
//   Text: "This item enters play exerted.",
//   Effects: [enterPlaysExerted],
// };
// Export const destroy: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "exert" }, { type: "banish" }],
//   Name: "Destroy!",
//   Text: "Choose one:\n* Banish chosen item.\n* Banish chosen damaged character.",
//   Effects: [
//     {
//       Type: "modal",
//       Target: anyTarget,
//       Modes: [
//         {
//           Id: "1",
//           Text: "Banish chosen item.",
//           Effects: [banishChosenItem],
//         },
//         {
//           Id: "2",
//           Text: "Banish chosen damaged character.",
//           Effects: [mayBanish(chosenDamagedCharacter)],
//         },
//       ],
//     },
//   ],
// };
// Export const limitlessApplications: ResolutionAbility = {
//   Type: "resolution",
//   Name: "Inspired Tech",
//   Text: "When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
//   Effects: [
//     {
//       Type: "attribute",
//       Attribute: "strength",
//       Amount: forEachItemYouHaveInPlay,
//       Modifier: "subtract",
//       Duration: "turn",
//       Target: chosenCharacter,
//     },
//   ],
// };
// Export const makeItSings: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "banish" }, { type: "ink", amount: 1 }],
//   Name: "Make It Sing",
//   Text: "1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.",
//   Effects: [
//     {
//       Type: "attribute",
//       Attribute: "singCost",
//       Amount: 3,
//       Modifier: "add",
//       Duration: "turn",
//       Target: chosenCharacter,
//     },
//   ],
// };
// Export const iMadeHer: ActivatedAbility = {
//   Type: "activated",
//   Name: "I Made Her",
//   Text: "{E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
//   Costs: [exertCharCost(1)],
//   Effects: [
//     {
//       Type: "attribute",
//       Attribute: "strength",
//       Amount: 2,
//       Modifier: "subtract",
//       Duration: "next_turn",
//       Until: true,
//       Target: chosenCharacter,
//     },
//   ],
// };
// Export const backFools = wheneverIsReturnedToHand({
//   Name: "Back, Fools!",
//   Text: "Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
//   Target: oneOfYourOpponentsCharactersItemsOrLocations,
//   From: "play",
//   Effects: [youGainLore(1)],
// });
// Export const giveThemAShow = atTheStartOfYourTurn({
//   Name: "Give 'Em A Show",
//   Text: "At the start of your turn, you may move a character of yours to a location for free.",
//   Optional: true,
//   Effects: [moveToLocation(chosenCharacterOfYours)],
// });
// Export const takeItForASpin: ActivatedAbility = {
//   Type: "activated",
//   Name: "Take It For A Spin",
//   Text: "2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
//   Costs: [{ type: "ink", amount: 2 }],
//   Effects: [
//     {
//       Type: "ability",
//       Ability: "evasive",
//       Duration: "next_turn",
//       Until: true,
//       Modifier: "add",
//       Target: chosenCharacter,
//     },
//   ],
// };
// Export const aSuitableWeapon = yourOtherCharactersGet({
//   Name: "A Suitable Weapon",
//   Text: "Your damaged characters get +1 {S}.",
//   Effects: [
//     {
//       Type: "attribute",
//       Attribute: "strength",
//       Amount: 1,
//       Modifier: "add",
//       Target: yourDamagedCharacters,
//     },
//   ],
// });
// Export const simboulOfRoyalty: GainAbilityStaticAbility = {
//   Type: "static",
//   Ability: "gain-ability",
//   Name: "Symbol of Royalty",
//   Text: "Your Prince and King characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
//   GainedAbility: resistAbility(1),
//   Target: {
//     Type: "card",
//     Value: "all",
//     ExcludeSelf: true,
//     Filters: [
//       { filter: "zone", value: "play" },
//       { filter: "type", value: "character" },
//       { filter: "owner", value: "self" },
//       {
//         Filter: "characteristics",
//         Conjunction: "or",
//         Value: ["prince", "king"],
//       },
//     ],
//   },
// };
// Export const royalSearch: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//   Name: "Royal Search",
//   Text: "{E}, 2 {I} – Reveal the top card of your deck. If it’s a Prince or King character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
//   Effects: revealTopOfDeckPutInHandOrDeck({
//     Mode: "top",
//     TutorFilters: [
//       { filter: "type", value: "character" },
//       { filter: "owner", value: "self" },
//       {
//         Filter: "characteristics",
//         Conjunction: "or",
//         Value: ["prince", "king"],
//       },
//     ],
//   }),
// };
//

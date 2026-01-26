// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import type {
  ActionAbilityDefinition,
  ActivatedAbilityDefinition,
  KeywordAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 008 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Tiana - Natural Talent: should parse card text", () => {
    const text =
      "Singer 6 (This character counts as cost 6 to sing songs.)\nCAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Perdita - On the Lookout: should parse card text", () => {
    const text =
      "KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rhino - One-Sixteenth Wolf: should parse card text", () => {
    const text =
      "TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Colonel - Old Sheepdog: should parse card text", () => {
    const text =
      "WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pua - Protective Pig: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nFREE FRUIT When this character is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tramp - Dapper Rascal: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Tramp.)\nPLAY IT COOL During an opponent’s turn, whenever one of your characters is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Wreck-It Ralph - Big Lug: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Wreck-It Ralph.)\nBACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Patch - Playful Pup: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nPUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rolly - Chubby Puppy: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nADORABLE ANTICS When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Perdita - Determined Mother: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Perdita.)\nQUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pluto - Tried and True: should parse card text", () => {
    const text =
      "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rhino - Power Hamster: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Rhino.)\nEPIC BALL OF AWESOME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("She's Your Person: should parse card text", () => {
    const text =
      "Choose one:\n- Remove up to 3 damage from chosen character.\n- Remove up to 3 damage from each of your characters with Bodyguard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Only So Much Room: should parse card text", () => {
    const text =
      "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Trials and Tribulations: should parse card text", () => {
    const text =
      "Chosen character gets -4 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Nephews' Piggy Bank: should parse card text", () => {
    const text =
      "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.\nPAYOFF {E} – Chosen character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Palace Guard - Spectral Sentry: should parse card text", () => {
    const text =
      "Vanish (When an opponent chooses this character for an action, banish them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Royal Guard - Octopus Soldier: should parse card text", () => {
    const text =
      "HEAVILY ARMED Whenever you draw a card, this character gains Challenger +1 this turn. (They get +1 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Yelana - Northuldra Leader: should parse card text", () => {
    const text =
      "WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ryder - Fleet-Footed Infiltrator: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pinocchio - Strings Attached: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nGOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Nero - Fearsome Crocodile: should parse card text", () => {
    const text =
      "AND MEAN {E} — Move 1 damage counter from this character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Yzma - On Edge: should parse card text", () => {
    const text =
      "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Sultan - Royal Apparition: should parse card text", () => {
    const text =
      "Vanish (When an opponent chooses this character for an action, banish them.)\nCOMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("They Never Come Back: should parse card text", () => {
    const text =
      "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pull the Lever!: should parse card text", () => {
    const text =
      "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Scarab: should parse card text", () => {
    const text =
      "SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tramp - Observant Guardian: should parse card text", () => {
    const text =
      "HOW DO I GET IN? When you play this character, chosen character gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tipo - Junior Chipmunk: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Raya - Infiltration Expert: should parse card text", () => {
    const text =
      "UNCONVENTIONAL TACTICS Whenever this character quests, you may pay 2 {I} to ready another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rapunzel - High Climber: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nWRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Queen of Hearts - Haughty Monarch: should parse card text", () => {
    const text =
      "COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Stopped Chaos in Its Tracks: should parse card text", () => {
    const text =
      "Sing Together 8 Return up to 2 chosen characters with 3 {S} or less each to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Wrong Lever!: should parse card text", () => {
    const text =
      "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Undermine: should parse card text", () => {
    const text =
      "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Walk the Plank!: should parse card text", () => {
    const text =
      'Your Pirate characters gain "{E} — Banish chosen damaged character" this turn.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Vanellope Von Schweetz - Spunky Speedster: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Dodo - Outlandish Storyteller: should parse card text", () => {
    const text =
      "EXTRAORDINARY SITUATION This character gets +1 {S} for each 1 damage on him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Thumper - Young Bunny: should parse card text", () => {
    const text = "YOU CAN DO IT! {E} — Chosen character gets +3 this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Wreck-It Ralph - Back Seat Driver: should parse card text", () => {
    const text =
      "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tinker Bell - Insistent Fairy: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Coachman - Greedy Deceiver: should parse card text", () => {
    const text =
      "WILD RIDE While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Prince John - Fraidy-Cat: should parse card text", () => {
    const text =
      "HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Nothing We Won't Do: should parse card text", () => {
    const text =
      "Sing Together 8 Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Twitterpated: should parse card text", () => {
    const text =
      "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Sword of Shan-Yu: should parse card text", () => {
    const text =
      "WORTHY WEAPON {E}, {E} one of your characters — Ready chosen character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sir Pellinore - Seasoned Knight: should parse card text", () => {
    const text =
      "CODE OF HONOR Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Olaf - Recapping the Story: should parse card text", () => {
    const text =
      "ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Wasabi - Always Prepared: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Wardrobe - Perceptive Friend: should parse card text", () => {
    const text =
      "I HAVE JUST THE THING! , Choose and discard an item card — Draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Nani - Heist Mastermind: should parse card text", () => {
    const text =
      "STICK TO THE PLAN {E} — Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\nIT'S UP TO YOU, LILO Your characters named Lilo gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Stitch - Experiment 626: should parse card text", () => {
    const text =
      "SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell facedown and exerted.\nSTEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play this character for free and he enters play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ratigan - Greedy Genius: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nTIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Roquefort - Lock Expert: should parse card text", () => {
    const text =
      "SAFEKEEPING Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pouncing Practice: should parse card text", () => {
    const text =
      "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Television Set: should parse card text", () => {
    const text =
      "IS IT ON YET? {E}, 1 {I} —  Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Prince Achmed - Rival Suitor: should parse card text", () => {
    const text =
      "UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Toby Turtle - Wary Friend: should parse card text", () => {
    const text =
      "HARD SHELL While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Zipper - Flying Ranger: should parse card text", () => {
    const text =
      "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Vinnie - Green Pigeon: should parse card text", () => {
    const text =
      "LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Nathaniel Flint - Notorious Pirate: should parse card text", () => {
    const text =
      "PREDATORY INSTINCT You can't play this character unless an opposing character was damaged this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Vincenzo Santorini - The Explosives Expert: should parse card text", () => {
    const text =
      "I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Namaari - Single-Minded Rival: should parse card text", () => {
    const text =
      "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.\nEXTREME FOCUS This character gets +1 {S} for each card in your discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Stitch - Alien Troublemaker: should parse card text", () => {
    const text =
      "I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Quick Shot: should parse card text", () => {
    const text = "Deal 1 damage to chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });
});

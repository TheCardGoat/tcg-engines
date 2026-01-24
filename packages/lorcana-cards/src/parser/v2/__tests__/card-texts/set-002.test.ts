import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 002 Card Text Parser Tests", () => {
  it.skip("Bashful - Hopeless Romantic: should parse card text", () => {
    const text =
      "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Christopher Robin - Adventurer: should parse card text", () => {
    const text =
      "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cinderella - Ballroom Sensation: should parse card text", () => {
    const text = "Singer 3 (This character counts as cost 3 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Doc - Leader of the Seven Dwarfs: should parse card text", () => {
    const text =
      "SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Dopey - Always Playful: should parse card text", () => {
    const text =
      "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gaston - Baritone Bully: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Grand Duke - Advisor to the King: should parse card text", () => {
    const text =
      "YES, YOUR MAJESTY Your Prince, Princess, King, and Queen characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Grumpy - Bad-Tempered: should parse card text", () => {
    const text =
      "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Happy - Good-Natured: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("King Louie - Jungle VIP: should parse card text", () => {
    const text =
      "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mickey Mouse - Friendly Face: should parse card text", () => {
    const text =
      "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mufasa - Betrayed Leader: should parse card text", () => {
    const text =
      "THE SUN WILL SET When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mulan - Reflecting: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Mulan.)\nHONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Nana - Darling Family Pet: should parse card text", () => {
    const text =
      "NURSEMAID Whenever you play a Floodborn character, you may remove all damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rapunzel - Gifted Artist: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Rapunzel.)\nLET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sleepy - Nodding Off: should parse card text", () => {
    const text = "YAWN! This character enters play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sneezy - Very Allergic: should parse card text", () => {
    const text =
      "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Snow White - Lost in the Forest: should parse card text", () => {
    const text =
      "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Snow White - Unexpected Houseguest: should parse card text", () => {
    const text =
      "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Snow White - Well Wisher: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Snow White.)\nWISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Queen - Commanding Presence: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)\nWHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Hold Still: should parse card text", () => {
    const text = "Remove up to 4 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Last Stand: should parse card text", () => {
    const text = "Banish chosen character who was challenged this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Painting the Roses Red: should parse card text", () => {
    const text = "Up to 2 chosen characters get -1 {S} this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Zero to Hero: should parse card text", () => {
    const text =
      "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Dragon Gem: should parse card text", () => {
    const text =
      "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sleepy's Flute: should parse card text", () => {
    const text =
      "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Arthur - Wizard's Apprentice: should parse card text", () => {
    const text =
      "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Blue Fairy - Rewarding Good Deeds: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Dr. Facilier - Savvy Opportunist: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Fairy Godmother - Mystic Armorer: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)\nFORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Fairy Godmother - Pure Heart: should parse card text", () => {
    const text =
      "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("HeiHei - Persistent Presence: should parse card text", () => {
    const text =
      "HE'S BACK! When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jiminy Cricket - Pinocchio's Conscience: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nTHAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Madam Mim - Fox: should parse card text", () => {
    const text =
      "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.\nRush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Madam Mim - Purple Dragon: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nI WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Madam Mim - Rival of Merlin: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Madam Mim.)\nGRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Madam Mim - Snake: should parse card text", () => {
    const text =
      "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Merlin - Crab: should parse card text", () => {
    const text =
      "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Merlin - Goat: should parse card text", () => {
    const text =
      "HERE I COME! When you play this character and when he leaves play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Merlin - Rabbit: should parse card text", () => {
    const text =
      "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Merlin - Shapeshifter: should parse card text", () => {
    const text =
      "BATTLE OF WITS Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Merlin - Squirrel: should parse card text", () => {
    const text =
      "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pinocchio - On the Run: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pinocchio.)\nLISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pinocchio - Talkative Puppet: should parse card text", () => {
    const text =
      "TELLING LIES When you play this character, you may exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Yzma - Scary Beyond All Reason: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Yzma.)\nCRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gruesome and Grim: should parse card text", () => {
    const text =
      "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Legend of the Sword in the Stone: should parse card text", () => {
    const text =
      "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Binding Contract: should parse card text", () => {
    const text =
      "FOR ALL ETERNITY {E}, {E} one of your characters — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Croquet Mallet: should parse card text", () => {
    const text =
      "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Perplexing Signposts: should parse card text", () => {
    const text =
      "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Sorcerer's Spellbook: should parse card text", () => {
    const text = "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Beast - Relentless: should parse card text", () => {
    const text =
      "SECOND WIND Whenever an opposing character is damaged, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Belle - Bookworm: should parse card text", () => {
    const text =
      "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Belle - Hidden Archer: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nTHORNY ARROWS Whenever this character is challenged, the challenging character's player discards all cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bucky - Squirrel Squeak Tutor: should parse card text", () => {
    const text =
      "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cheshire Cat - From the Shadows: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)\nEvasive (Only characters with Evasive can challenge this character.)\nWICKED SMILE {E} — Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Dr. Facilier - Fortune Teller: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nYOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Flynn Rider - His Own Biggest Fan: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)\nEvasive (Only characters with Evasive can challenge this character.)\nONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gaston - Scheming Suitor: should parse card text", () => {
    const text =
      "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lucifer - Cunning Cat: should parse card text", () => {
    const text =
      "MOUSE CATCHER When you play this character, each opponent chooses and discards either 2 cards or 1 action card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pain - Underworld Imp: should parse card text", () => {
    const text =
      "COMING, YOUR MOST LUGUBRIOUSNESS While this character has 5 {S} or more, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Panic - Underworld Imp: should parse card text", () => {
    const text =
      "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pete - Bad Guy: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nTAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.\nWHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Prince John - Greediest of All: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nI SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Queen of Hearts - Quick-Tempered: should parse card text", () => {
    const text =
      "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ratigan - Criminal Mastermind: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ray - Easygoing Firefly: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Queen - Disguised Peddler: should parse card text", () => {
    const text =
      "A PERFECT DISGUISE {E}, Choose and discard a character card — Gain lore equal to the discarded character's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bibbidi Bobbidi Boo: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand to play another character with the same cost or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bounce: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand to return another chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Hypnotize: should parse card text", () => {
    const text = "Each opponent chooses and discards a card. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pack Tactics: should parse card text", () => {
    const text =
      "Gain 1 lore for each damaged character opponents have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ring the Bell: should parse card text", () => {
    const text = "Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ratigan's Marvelous Trap: should parse card text", () => {
    const text =
      "SNAP! BOOM! TWANG! Banish this item — Each opponent loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Donald Duck - Not Again!: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPHOOEY! This character gets +1 {L} for each 1 damage on him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Felicia - Always Hungry: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Fidget - Ratigan's Henchman: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Honest John - Not That Honest: should parse card text", () => {
    const text =
      "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lady Tremaine - Imperious Queen: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)\nPOWER TO RULE AT LAST When you play this character, each opponent chooses and banishes one of their characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lady Tremaine - Overbearing Matriarch: should parse card text", () => {
    const text =
      "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Minnie Mouse - Stylish Surfer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Minnie Mouse - Wide-Eyed Diver: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Minnie Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nUNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mother Gothel - Withered and Wicked: should parse card text", () => {
    const text =
      "WHAT HAVE YOU DONE?! This character enters play with 3 damage.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mulan - Soldier in Training: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Namaari - Nemesis: should parse card text", () => {
    const text =
      "THIS SHOULDN'T TAKE LONG {E}, Banish this character — Banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ratigan - Very Large Mouse: should parse card text", () => {
    const text =
      "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Raya - Leader of Heart: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Raya.)\nCHAMPION OF KUMANDRA Whenever this character challenges a damaged character, she takes no damage from the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Scar - Vicious Cheater: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nDADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tigger - One of a Kind: should parse card text", () => {
    const text =
      "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tuk Tuk - Wrecking Ball: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Go the Distance: should parse card text", () => {
    const text =
      "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Teeth and Ambitions: should parse card text", () => {
    const text =
      "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Most Diabolical Scheme: should parse card text", () => {
    const text = "Banish chosen Villain of yours to banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("What Did You Call Me?: should parse card text", () => {
    const text = "Chosen damaged character gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Peter Pan's Dagger: should parse card text", () => {
    const text = "Your characters with Evasive get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sword in the Stone: should parse card text", () => {
    const text =
      "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Basil - Great Mouse Detective: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Basil.)\nTHERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Basil - Of Baker Street: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cogsworth - Grandfather Clock: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)\nWard (Opponents can't choose this character except to challenge.)\nUNWIND Your other characters gain Resist +1 (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cogsworth - Talking Clock: should parse card text", () => {
    const text =
      "WAIT A MINUTE Your characters with Reckless gain “{E} — Gain 1 lore.”";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cruella De Vil - Perfectly Wretched: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cruella De Vil.)\nOH, NO YOU DON'T Whenever this character quests, chosen opposing character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Duke Weaselton - Small-Time Crook: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gaston - Intellectual Powerhouse: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gaston.)\nDEVELOPED BRAIN When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Hiram Flaversham - Toymaker: should parse card text", () => {
    const text =
      "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("James - Role Model: should parse card text", () => {
    const text =
      "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mrs. Judson - Housekeeper: should parse card text", () => {
    const text =
      "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Nick Wilde - Wily Fox: should parse card text", () => {
    const text =
      "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Noi - Orphaned Thief: should parse card text", () => {
    const text =
      "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward. (Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sisu - Divine Water Dragon: should parse card text", () => {
    const text =
      "I TRUST YOU Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Nokk - Water Spirit: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Falling Down the Rabbit Hole: should parse card text", () => {
    const text =
      "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Launch: should parse card text", () => {
    const text =
      "Banish chosen item of yours to deal 5 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Nothing to Hide: should parse card text", () => {
    const text = "Each opponent reveals their hand. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Fang Crossbow: should parse card text", () => {
    const text =
      "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.\nSTAY BACK! {E}, Banish this item — Banish chosen Dragon character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gumbo Pot: should parse card text", () => {
    const text =
      "THE BEST I'VE EVER TASTED {E} — Remove 1 damage each from up to 2 chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Maurice's Workshop: should parse card text", () => {
    const text =
      "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pawpsicle: should parse card text", () => {
    const text =
      "JUMBO POP When you play this item, you may draw a card.\nTHAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sardine Can: should parse card text", () => {
    const text =
      "FLIGHT CABIN Your exerted characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Beast - Forbidding Recluse: should parse card text", () => {
    const text =
      "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Beast - Selfless Protector: should parse card text", () => {
    const text =
      "SHIELD ANOTHER Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Beast - Tragic Hero: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Beast.)\nIT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Chief Bogo - Respected Officer: should parse card text", () => {
    const text =
      "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cinderella - Knight in Training: should parse card text", () => {
    const text =
      "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cinderella - Stouthearted: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cinderella.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nTHE SINGING SWORD Whenever you play a song, this character may challenge ready characters this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Hercules - Divine Hero: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Hercules.)\nResist +2 (Damage dealt to this character is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jafar - Dreadnought: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jafar.)\nNOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kronk - Junior Chipmunk: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nSCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Li Shang - Archery Instructor: should parse card text", () => {
    const text =
      "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Magic Broom - Industrial Model: should parse card text", () => {
    const text =
      "MAKE IT SHINE When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Namaari - Morning Mist: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBLADES This character can challenge ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Queen of Hearts - Capricious Monarch: should parse card text", () => {
    const text =
      "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Huntsman - Reluctant Enforcer: should parse card text", () => {
    const text =
      "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Prince - Never Gives Up: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tiana - Celebrating Princess: should parse card text", () => {
    const text =
      "Resist +2 (Damage dealt to this character is reduced by 2.)\nWHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Charge!: should parse card text", () => {
    const text =
      "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Let the Storm Rage On: should parse card text", () => {
    const text = "Deal 2 damage to chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pick a Fight: should parse card text", () => {
    const text = "Chosen character can challenge ready characters this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Last Cannon: should parse card text", () => {
    const text =
      "ARM YOURSELF 1 {I}, Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mouse Armor: should parse card text", () => {
    const text =
      "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Weight Set: should parse card text", () => {
    const text =
      "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });
});

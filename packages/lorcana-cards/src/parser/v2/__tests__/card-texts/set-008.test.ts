import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 008 Card Text Parser Tests", () => {
  it.skip("Louie - One Cool Duck: should parse card text", () => {
    const text =
      "SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Huey - Reliable Leader: should parse card text", () => {
    const text =
      "I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Goofy - Groundbreaking Chef: should parse card text", () => {
    const text =
      "PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Antonio Madrigal - Friend to All: should parse card text", () => {
    const text =
      "OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Minnie Mouse - Daring Defender: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTRUE VALOR This character gets +1 {S} for each 1 damage on her.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ludwig Von Drake - All-Around Expert: should parse card text", () => {
    const text =
      "SUPERIOR MIND When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.\nLASTING LEGACY When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tiana - Natural Talent: should parse card text", () => {
    const text =
      "Singer 6 (This character counts as cost 6 to sing songs.)\nCAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mirabel Madrigal - Curious Child: should parse card text", () => {
    const text =
      "YOU ARE A WONDER When you play this character, you may reveal a song card in your hand to gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lady - Family Dog: should parse card text", () => {
    const text =
      "SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jim Dear - Beloved Husband: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gene - Niceland Resident: should parse card text", () => {
    const text =
      "I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.";
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

  it.skip("Darling Dear - Beloved Wife: should parse card text", () => {
    const text =
      "HOW SWEET When you play this character, chosen character gets +2 {L} this turn.";
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

  it.skip("Chief Bogo - Commanding Officer: should parse card text", () => {
    const text =
      "SENDING BACKUP During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.";
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

  it.skip("Bruno Madrigal - Singing Seer: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)\nBRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kaa - Hypnotizing Python: should parse card text", () => {
    const text =
      "LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)";
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

  it.skip("King Candy - Sugar Rush Nightmare: should parse card text", () => {
    const text =
      "A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.";
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

  it.skip("Bolt - Down but Not Out: should parse card text", () => {
    const text =
      "NONE OF YOUR POWERS ARE WORKING This character enters play exerted.";
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

  it.skip("Antonio's Jaguar - Faithful Companion: should parse card text", () => {
    const text =
      "YOU WANT TO GO WHERE? When you play this character, if you have a character named Antonio Madrigal in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Calhoun - Hard-Nosed Leader: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLOOT DROP When this character is banished, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lady - Decisive Dog: should parse card text", () => {
    const text =
      "PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.\nTAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Alma Madrigal - Accepting Grandmother: should parse card text", () => {
    const text =
      "THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Clawhauser - Front Desk Officer: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSinger 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Joey - Blue Pigeon: should parse card text", () => {
    const text =
      "I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Donald Duck - Coin Collector: should parse card text", () => {
    const text =
      'HERE, PIGGY, PIGGY For each item named The Nephews\' Piggy Bank you have in play, you pay 2 {I} less to play this character.\nMONEY EVERYWHERE When you play this character, your other characters gain "{E} – Draw a card" this turn.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Dalmatian Puppy - Tail Wagger: should parse card text", () => {
    const text =
      "WHERE DID THEY ALL COME FROM? You may have up to 99 copies of Dalmatian Puppy – Tail Wagger in your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Candy Drift: should parse card text", () => {
    const text =
      "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.";
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

  it.skip("It Means No Worries: should parse card text", () => {
    const text =
      "Sing Together 9 Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.";
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

  it.skip("Druun - Ravenous Plague: should parse card text", () => {
    const text =
      "Challenger +4 (While challenging, this character gets +4 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Madame Medusa - Deceiving Partner: should parse card text", () => {
    const text =
      "DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player’s hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Hades - Ruthless Tyrant: should parse card text", () => {
    const text =
      "SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lena Sabrewing - Pure Energy: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Abu - Illusory Pachyderm: should parse card text", () => {
    const text =
      "Vanish (When an opponent chooses this character for an action, banish them.)\nGRASPING TRUNK Whenever this character quests, gain lore equal to the {L} of chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bruno Madrigal - Single-Minded: should parse card text", () => {
    const text =
      "STANDING TALL When you play this character, chosen opposing character can't ready at the start of their next turn.";
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

  it.skip("Kuzco - Bored Royal: should parse card text", () => {
    const text =
      "LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Megara - Part of the Plan: should parse card text", () => {
    const text =
      "CONTENTIOUS ALLIANCE While you have a character named Hades in play, this character gains Challenger +2. (They get +2 {S} while challenging.)";
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

  it.skip("Elsa - Fierce Protector: should parse card text", () => {
    const text =
      "ICE OVER 1 {I} , Choose and discard a card — Exert chosen opposing character.";
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

  it.skip("Jiminy Cricket - Level-Headed and Wise: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bambi - Little Prince: should parse card text", () => {
    const text =
      "SAY HELLO When you play this character, gain 1 lore.\nKIND OF BASHFUL When an opponent plays a character, return this character to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Monstro - Infamous Whale: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nFULL BREACH Choose and discard a card – Ready this character. He can't quest for the rest of this turn.";
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

  it.skip("Magica De Spell - Shadow Form: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nDANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kuzco - Impulsive Llama: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Kuzco.)\nWHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.";
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

  it.skip("Madam Mim - Rhino: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Madam Mim.)\nMAKE WAY, COMING THROUGH! When you play this character, banish her or return another chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mother Gothel - Knows What's Best: should parse card text", () => {
    const text =
      'LOOK WHAT YOU\'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +1 {S} while challenging.)';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Blue Fairy - Guiding Light: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Anna - Magical Mission: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nCOORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.";
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

  it.skip("Jafar - High Sultan of Lorcana: should parse card text", () => {
    const text =
      "DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Camilo Madrigal - Center Stage: should parse card text", () => {
    const text =
      "ENCORE! ENCORE! When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Flower - Shy Skunk: should parse card text", () => {
    const text =
      "LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Forest Duel: should parse card text", () => {
    const text =
      'Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +2 {S} while challenging.)';
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

  it.skip("Fantastical and Magical: should parse card text", () => {
    const text =
      "Sing Together 9 For each character that sang this song, draw a card and gain 1 lore.";
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

  it.skip("Into the Unknown: should parse card text", () => {
    const text =
      "Put chosen exerted character into their player's inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Everybody's Got a Weakness: should parse card text", () => {
    const text =
      "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.";
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

  it.skip("Ice Spikes: should parse card text", () => {
    const text =
      "HOLD STILL When you play this item, exert chosen opposing character.\nIT'S STUCK {E}, 1 {I} – Exert chosen opposing item. It can’t ready at the start of its next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Basil - Undercover Detective: should parse card text", () => {
    const text =
      "INCAPACITATE When you play this character, you may return chosen character to their player's hand.\nINTERFERE Whenever this character quests, chosen opponent discards a card at random.";
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

  it.skip("Chaca - Junior Chipmunk: should parse card text", () => {
    const text =
      "IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
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

  it.skip("Bill the Lizard - Chimney Sweep: should parse card text", () => {
    const text =
      "NOTHING TO IT While another character in play has damage, this character gains Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("March Hare - Hare-Brained Eccentric: should parse card text", () => {
    const text =
      "LIGHT THE CANDLES When you play this character, you may deal 2 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Fred - Major Science Enthusiast: should parse card text", () => {
    const text =
      "SPITTING FIRE! When you play this character, you may banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mad Dog - Karnage's First Mate: should parse card text", () => {
    const text =
      "ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Louis - Endearing Alligator: should parse card text", () => {
    const text =
      "SENSITIVE SOUL This character enters play exerted.\nFRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Chip - Quick Thinker: should parse card text", () => {
    const text =
      "I’LL HANDLE THIS When you play this character, chosen opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Fred - Giant-Sized: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Fred.)\nI LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gadget Hackwrench - Quirky Scientist: should parse card text", () => {
    const text =
      "GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.";
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

  it.skip("Flynn Rider - Breaking and Entering: should parse card text", () => {
    const text =
      "THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Dormouse - Easily Agitated: should parse card text", () => {
    const text =
      "VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Alice - Clumsy as Can Be: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Alice.)\nACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.";
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

  it.skip("Hiro Hamada - Intuitive Thinker: should parse card text", () => {
    const text = "LOOK FOR A NEW ANGLE {E} — Ready chosen Floodborn character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Go Go Tomago - Cutting Edge: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Go Go Tomago.)\nEvasive (Only characters with Evasive can challenge this character.)\nZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Don Karnage - Air Pirate Leader: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSCORNFUL TAUNT Whenever you play an action that isn’t a song, chosen opposing character gains Reckless during their next turn. (They can’t quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Captain Hook - The Pirate King: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nGIVE ’EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Maui - Stubborn Trickster: should parse card text", () => {
    const text =
      "I'M NOT FINISHED YET When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Honey Lemon - Costumed Catalyst: should parse card text", () => {
    const text =
      "LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jock - Attentive Uncle: should parse card text", () => {
    const text =
      "VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Archimedes - Resourceful Owl: should parse card text", () => {
    const text =
      "YOU DON'T NEED THAT When you play this character, you may banish chosen item.\nNOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("He Who Steals and Runs Away: should parse card text", () => {
    const text = "Banish chosen item. Draw a card.";
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

  it.skip("Chem Purse: should parse card text", () => {
    const text =
      "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jeweled Collar: should parse card text", () => {
    const text =
      "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gloyd Orangeboar - Fierce Competitor: should parse card text", () => {
    const text =
      "PUMPKIN SPICE When you play this character, each opponent loses 1 lore and you gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gyro Gearloose - Eccentric Inventor: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nI'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.";
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

  it.skip("Brutus - Fearsome Crocodile: should parse card text", () => {
    const text =
      "SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.";
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

  it.skip("Alice - Courageous Keyholder: should parse card text", () => {
    const text =
      "THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lumiere - Nimble Candelabra: should parse card text", () => {
    const text =
      "QUICK-STEP While you have an item card in your discard, this character gains Evasive. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gaston - Arrogant Showoff: should parse card text", () => {
    const text =
      "BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mushu - Fast-Talking Dragon: should parse card text", () => {
    const text =
      "LET'S GET THIS SHOW ON THE ROAD {E} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cri-Kee - Part of the Team: should parse card text", () => {
    const text =
      "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Figaro - Tuxedo Cat: should parse card text", () => {
    const text = "PLAYFULNESS Opposing items enter play exerted.";
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

  it.skip("Lilo - Causing an Uproar: should parse card text", () => {
    const text =
      "STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.\nRAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("LeFou - Cake Thief: should parse card text", () => {
    const text =
      "ALL FOR ME {E}, Banish one of your items — Chosen opponent loses 1 lore and you gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lumiere - Fired Up: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lumiere.)\nEvasive, Ward\nSACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.";
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

  it.skip("Mulan - Charging Ahead: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nLONG RANGE This character can challenge ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mushu - Your Worst Nightmare: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mushu.)\nALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn. (They can challenge the turn they’re played. They can’t quest and must challenge if able. They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mr. Snoops - Betrayed Partner: should parse card text", () => {
    const text =
      "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Faline - Playful Fawn: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.";
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

  it.skip("Get Out!: should parse card text", () => {
    const text =
      "Banish chosen character, then return an item card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Light the Fuse: should parse card text", () => {
    const text =
      "Deal 1 damage to chosen character for each exerted character you have in play.";
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

  it.skip("Most Everyone's Mad Here: should parse card text", () => {
    const text =
      "Gain lore equal to the damage on chosen character, then banish them.";
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

  it.skip("Anita Radcliffe - Dog Lover: should parse card text", () => {
    const text =
      "I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
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

  it.skip("Anna - Trusting Sister: should parse card text", () => {
    const text =
      "WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.";
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

  it.skip("Go Go Tomago - Mechanical Engineer: should parse card text", () => {
    const text =
      "NEED THIS! When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.";
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

  it.skip("Mrs. Potts - Head Housekeeper: should parse card text", () => {
    const text = "CLEAN UP {E}, Banish one of your items — Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jasmine - Resourceful Infiltrator: should parse card text", () => {
    const text =
      "JUST WHAT YOU NEED When you play this character, you may give another chosen character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Little Sister - Responsible Rabbit: should parse card text", () => {
    const text =
      "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.";
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

  it.skip("Arthur - Determined Squire: should parse card text", () => {
    const text = "NO MORE BOOKS Skip your turn's Draw step.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bernard - Over-Prepared: should parse card text", () => {
    const text =
      "GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Aladdin - Vigilant Guard: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jasmine - Steady Strategist: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jasmine.)\nALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.";
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

  it.skip("Geppetto - Skilled Craftsman: should parse card text", () => {
    const text =
      "SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Heads Held High: should parse card text", () => {
    const text =
      "Sing Together 6 Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.";
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

  it.skip("Down in New Orleans: should parse card text", () => {
    const text =
      "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.";
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

  it.skip("Belle's Favorite Book: should parse card text", () => {
    const text =
      "CHAPTER THREE {E}, Banish one of your other items — Put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Atlantean Crystal: should parse card text", () => {
    const text =
      "SHIELDING LIGHT {E}, 2 {I} — Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bobby - Purple Pigeon: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Magic Carpet - Phantom Rug: should parse card text", () => {
    const text =
      "Vanish (When an opponent chooses this character for an action, banish them.)\nSPECTRAL FORCE Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)";
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

  it.skip("Dumptruck - Karnage's Second Mate: should parse card text", () => {
    const text =
      "LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Captain Hook - Forceful Duelist: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("General Li - Head of the Imperial Army: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Monterey Jack - Defiant Protector: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Genie - Satisfied Dragon: should parse card text", () => {
    const text =
      "BUG CATCHER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
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

  it.skip("Iago - Out of Reach: should parse card text", () => {
    const text =
      "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.";
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

  it.skip("Mickey Mouse - Giant Mouse: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.";
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

  it.skip("Desperate Plan: should parse card text", () => {
    const text =
      "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Beyond the Horizon: should parse card text", () => {
    const text =
      "Sing Together 7 Choose any number of players. They discard their hands and draw 3 cards each.";
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

  it.skip("Hamster Ball: should parse card text", () => {
    const text =
      "ROLL WITH THE PUNCHES {E}, 1 {I} — Chosen character with no damage gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });
});

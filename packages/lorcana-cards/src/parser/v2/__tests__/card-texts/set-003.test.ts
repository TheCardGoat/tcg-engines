import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 003 Card Text Parser Tests", () => {
  it.skip("Baloo - von Bruinwald XIII: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLET'S MAKE LIKE A TREE When this character is banished, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bernard - Brand-New Agent: should parse card text", () => {
    const text =
      "I'LL CHECK IT OUT At the end of your turn, if this character is exerted, you may ready another chosen character of yours.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Chernabog - Evildoer: should parse card text", () => {
    const text =
      "THE POWER OF EVIL For each character card in your discard, you pay 1 {I} less to play this character.\nSUMMON THE SPIRITS When you play this character, shuffle all character cards from your discard into your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Joshua Sweet - The Doctor: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kida - Protector of Atlantis: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Kida.)\nPERHAPS WE CAN SAVE OUR FUTURE When you play this character, all characters get -3 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lucky - The 15th Puppy: should parse card text", () => {
    const text =
      "GOOD AS NEW {E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.\nPUPPY LOVE Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Minnie Mouse - Musical Artist: should parse card text", () => {
    const text =
      "Singer 3 (This character counts as cost 3 to sing songs.)\nENTOURAGE Whenever you play a character with Bodyguard, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Miss Bianca - Rescue Aid Society Agent: should parse card text", () => {
    const text = "Singer 4 (This character counts as cost 4 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Patch - Intimidating Pup: should parse card text", () => {
    const text =
      "BARK {E} — Chosen character gets -2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Perdita - Devoted Mother: should parse card text", () => {
    const text =
      "COME ALONG, CHILDREN When you play this character and whenever she quests, you may play a character with cost 2 or less from your discard for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Piglet - Pooh Pirate Captain: should parse card text", () => {
    const text =
      "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rolly - Hungry Pup: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("99 Puppies: should parse card text", () => {
    const text =
      "Whenever one of your characters quests this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Boss's Orders: should parse card text", () => {
    const text =
      "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Quick Patch: should parse card text", () => {
    const text = "Remove up to 3 damage from chosen location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Bare Necessities: should parse card text", () => {
    const text =
      "Chosen opponent reveals their hand and discards a non-character card of your choice.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cleansing Rainwater: should parse card text", () => {
    const text =
      "ANCIENT POWER Banish this item — Remove up to 2 damage from each of your characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Heart of Atlantis: should parse card text", () => {
    const text =
      "LIFE GIVER {E} — You pay 2 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Wildcat's Wrench: should parse card text", () => {
    const text = "REBUILD {E} — Remove up to 2 damage from chosen location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pride Lands - Pride Rock: should parse card text", () => {
    const text =
      "WE ARE ALL CONNECTED Characters get +2 {W} while here.\nLION HOME If you have a Prince or King character here, you pay 1 {I} less to play characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tiana's Palace - Jazz Restaurant: should parse card text", () => {
    const text = "NIGHT OUT Characters can't be challenged while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Alice - Tea Alchemist: should parse card text", () => {
    const text =
      "CURIOUSER AND CURIOUSER {E} — Exert chosen opposing character and all other opposing characters with the same name.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Chernabog's Followers - Creatures of Evil: should parse card text", () => {
    const text =
      "RESTLESS SOULS Whenever this character quests, you may banish them to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Diablo - Faithful Pet: should parse card text", () => {
    const text =
      "LOOKING FOR AURORA Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Hydros - Ice Titan: should parse card text", () => {
    const text = "BLIZZARD {E} — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Iago - Pretty Polly: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jafar - Striking Illusionist: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jafar.)\nEvasive (Only characters with Evasive can challenge this character.)\nPOWER BEYOND MEASURE During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lena Sabrewing - Rebellious Teenager: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Magic Broom - Dancing Duster: should parse card text", () => {
    const text =
      "POWER CLEAN When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Magic Broom - Swift Cleaner: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nCLEAN THIS, CLEAN THAT When you play this character, you may shuffle all Broom cards from your discard into your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Magic Broom - The Big Sweeper: should parse card text", () => {
    const text =
      "CLEAN SWEEP While this character is at a location, it gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Magic Carpet - Flying Rug: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nFIND THE WAY {E} — Move a character of yours to a location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Magica De Spell - The Midas Touch: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Magica De Spell.)\nALL MINE Whenever this character quests, gain lore equal to the cost of one of your items in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Magica De Spell - Thieving Sorceress: should parse card text", () => {
    const text =
      "TELEKINESIS {E} — Return chosen item with cost equal to or less than this character's {S} to its player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Maleficent - Mistress of All Evil: should parse card text", () => {
    const text =
      "DARK KNOWLEDGE Whenever this character quests, you may draw a card DIVINATION During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pua - Potbellied Buddy: should parse card text", () => {
    const text =
      "ALWAYS THERE When this character is banished, you may shuffle this card into your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Stratos - Tornado Titan: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nCYCLONE {E} — Gain lore equal to the number of Titan characters you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Treasure Guardian - Protector of the Cave: should parse card text", () => {
    const text =
      "WHO DISTURBS MY SLUMBER? This character can't challenge or quest unless it is at a location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Bestow a Gift: should parse card text", () => {
    const text =
      "Move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("It Calls Me: should parse card text", () => {
    const text =
      "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Boss is on a Roll: should parse card text", () => {
    const text =
      "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Lamp: should parse card text", () => {
    const text =
      "GOOD OR EVIL Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Sorcerer's Hat: should parse card text", () => {
    const text =
      "INCREDIBLE ENERGY {E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Queen's Castle - Mirror Chamber: should parse card text", () => {
    const text =
      "USING THE MIRROR At the start of your turn, for each character you have here, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Sorcerer's Tower - Wondrous Workspace: should parse card text", () => {
    const text =
      "BROOM CLOSET Your characters named Magic Broom may move here for free.\nMAGICAL POWER Characters get +1 {L} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Cubby - Mighty Lost Boy: should parse card text", () => {
    const text =
      "THE BEAR Whenever this character moves to a location, he gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Don Karnage - Prince of Pirates: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Flotsam - Riffraff: should parse card text", () => {
    const text = "EERIE PAIR Your characters named Jetsam get +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Friar Tuck - Priest of Nottingham: should parse card text", () => {
    const text =
      "YOU THIEVING SCOUNDREL When you play this character, the player or players with the most cards in their hand chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Helga Sinclair - Femme Fatale: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Helga Sinclair.)\nTHIS CHANGES EVERYTHING Whenever this character quests, you may deal 3 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Helga Sinclair - Vengeful Partner: should parse card text", () => {
    const text =
      "NOTHING PERSONAL When this character is challenged and banished, banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jetsam - Riffraff: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nEERIE PAIR Your characters named Flotsam gain Ward.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kit Cloudkicker - Tough Guy: should parse card text", () => {
    const text =
      "SKYSURFING When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lyle Tiberius Rourke - Cunning Mercenary: should parse card text", () => {
    const text =
      "WELL, NOW YOU KNOW When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)\nTHANKS FOR VOLUNTEERING Whenever one of your other characters is banished, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Milo Thatch - King of Atlantis: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Milo Thatch.)\nTAKE THEM BY SURPRISE When this character is banished, return all opposing characters to their players' hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Morph - Space Goo: should parse card text", () => {
    const text =
      "MIMICRY You may play any character with Shift on this character as if this character had any name.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Peter Pan - Lost Boy Leader: should parse card text", () => {
    const text =
      "I CAME TO LISTEN TO THE STORIES Once per turn, when this character moves to a location, gain lore equal to that location's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Prince John - Phony King: should parse card text", () => {
    const text =
      "COLLECT TAXES Whenever this character quests, each opponent with more lore than you loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sir Hiss - Aggravating Asp: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Skippy - Energetic Rabbit: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Stitch - Covert Agent: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nHIDE While this character is at a location, he gains Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ursula - Deceiver of All: should parse card text", () => {
    const text =
      "WHAT A DEAL Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Zazu - Steward of the Pride Lands: should parse card text", () => {
    const text =
      "IT'S TIME TO GO! While this character is at a location, he gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Has Set My Heaaaaaaart . . .: should parse card text", () => {
    const text = "Banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("I Will Find My Way: should parse card text", () => {
    const text =
      "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Strike a Good Match: should parse card text", () => {
    const text = "Draw 2 cards, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Airfoil: should parse card text", () => {
    const text =
      "I GOT TO BE GOING {E} — If you've played 2 or more actions this turn, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Robin's Bow: should parse card text", () => {
    const text =
      "FOREST'S GIFT {E} — Deal 1 damage to chosen damaged character or location.\nA BIT OF A LARK Whenever a character of yours named Robin Hood quests, you may ready this item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Starlight Vial: should parse card text", () => {
    const text =
      "EFFICIENT ENERGY {E} — You pay 2 {I} less for the next action you play this turn.\nTRAP 2 {I}, Banish this item — Draw 2 cards, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Fang - River City: should parse card text", () => {
    const text =
      "SURROUNDED BY WATER Characters gain Ward and Evasive while here. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kuzco's Palace - Home of the Emperor: should parse card text", () => {
    const text =
      "CITY WALLS Whenever a character is challenged and banished while here, banish the challenging character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Captain Hook - Master Swordsman: should parse card text", () => {
    const text =
      "NEMESIS During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.\nMAN-TO-MAN Characters named Peter Pan lose Evasive and can't gain Evasive.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Della Duck - Unstoppable Mom: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("HeiHei - Accidental Explorer: should parse card text", () => {
    const text =
      "MINDLESS WANDERING Once per turn, when this character moves to a location, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Hydra - Deadly Serpent: should parse card text", () => {
    const text =
      "WATCH THE TEETH Whenever this character is dealt damage, deal that much damage to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jim Hawkins - Space Traveler: should parse card text", () => {
    const text =
      "THIS IS IT! When you play this character, you may play a location with cost 4 or less for free.\nTAKE THE HELM Whenever you play a location, this character may move there for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kakamora - Menacing Sailor: should parse card text", () => {
    const text =
      "PLUNDER When you play this character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Madame Medusa - The Boss: should parse card text", () => {
    const text =
      "THAT TERRIBLE WOMAN When you play this character, banish chosen opposing character with 3 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Maui - Soaring Demigod: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)\nIN MA BELLY Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Milo Thatch - Spirited Scholar: should parse card text", () => {
    const text =
      "I'M YOUR MAN! While this character is at a location, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Moana - Born Leader: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Moana.)\nWELCOME TO MY BOAT Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Peter Pan - Never Land Hero: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nOVER HERE, TINK While you have a character named Tinker Bell in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Peter Pan - Pirate's Bane: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Peter Pan.)\nEvasive (Only characters with Evasive can challenge this character.)\nYOU'RE NEXT! Whenever he challenges a Pirate character, this character takes no damage from the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Prince Eric - Expert Helmsman: should parse card text", () => {
    const text =
      "SURPRISE MANEUVER When this character is banished, you may banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Scroop - Backstabber: should parse card text", () => {
    const text = "BRUTE While this character has damage, he gets +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Slightly - Lost Boy: should parse card text", () => {
    const text =
      "THE FOX If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Stitch - Little Rocket: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Trigger - Not-So-Sharp Shooter: should parse card text", () => {
    const text = "OLD BETSY Your characters named Nutsy get +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Divebomb: should parse card text", () => {
    const text =
      "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("I've Got a Dream: should parse card text", () => {
    const text =
      "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("On Your Feet! Now!: should parse card text", () => {
    const text =
      "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Voyage: should parse card text", () => {
    const text =
      "Move up to 2 characters of yours to the same location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Maui's Fish Hook: should parse card text", () => {
    const text =
      "IT'S MAUI TIME! If you have a character named Maui in play, you may use this item's Shapeshift ability for free.\nSHAPESHIFT {E}, 2 {I} — Choose one:\n• Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)\n• Chosen character gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sumerian Talisman: should parse card text", () => {
    const text =
      "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Jolly Roger - Hook's Ship: should parse card text", () => {
    const text =
      "LOOK ALIVE, YOU SWABS! Characters gain Rush while here. (They can challenge the turn they're played.)\nALL HANDS ON DECK! Your Pirate characters may move here for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("RLS Legacy - Solar Galleon: should parse card text", () => {
    const text =
      "THIS IS OUR SHIP Characters gain Evasive while here. (Only characters with Evasive can challenge them.)\nHEAVE TOGETHER NOW If you have a character here, you pay 2 {I} less to move a character of yours here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Audrey Ramirez - The Engineer: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nSPARE PARTS Whenever this character quests, ready one of your items.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Captain Amelia - First in Command: should parse card text", () => {
    const text =
      "DISCIPLINE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Flintheart Glomgold - Lone Cheater: should parse card text", () => {
    const text =
      "THEY'LL NEVER SEE IT COMING! During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gramma Tala - Keeper of Ancient Stories: should parse card text", () => {
    const text =
      "THERE WAS ONLY OCEAN When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gramma Tala - Spirit of the Ocean: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Gramma Tala.)\nDO YOU KNOW WHO YOU ARE? Whenever a card is put into your inkwell, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gyro Gearloose - Gadget Whiz: should parse card text", () => {
    const text =
      "NOW TRY TO KEEP UP {E} — Put an item card from your discard on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kit Cloudkicker - Navigator: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Kit Cloudkicker.)\nWard (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kit Cloudkicker - Spunky Bear Cub: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rufus - Orphanage Cat: should parse card text", () => {
    const text =
      "TOO OLD TO BE CHASING MICE When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Scrooge McDuck - Richest Duck in the World: should parse card text", () => {
    const text =
      "I'M GOING HOME! During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nI DIDN'T GET RICH BY BEING STUPID During your turn, whenever this character banishes another character in a challenge, you may play an item for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Scrooge McDuck - Uncle Moneybags: should parse card text", () => {
    const text =
      "TREASURE FINDER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Tinker Bell - Very Clever Fairy: should parse card text", () => {
    const text =
      "I CAN USE THAT Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Wendy Darling - Authority on Peter Pan: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Distract: should parse card text", () => {
    const text = "Chosen character gets -2 {S} this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Friend Like Me: should parse card text", () => {
    const text =
      "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("How Far I'll Go: should parse card text", () => {
    const text =
      "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Repair: should parse card text", () => {
    const text =
      "Remove up to 3 damage from one of your locations or characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lucky Dime: should parse card text", () => {
    const text =
      "NUMBER ONE {E}, 2 {I} — Choose a character of yours and gain lore equal to their {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Scrooge's Top Hat: should parse card text", () => {
    const text =
      "BUSINESS EXPERTISE {E} — You pay 1 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Vault Door: should parse card text", () => {
    const text =
      "SEALED AWAY Your locations and characters at locations gain Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Belle's House - Maurice's Workshop: should parse card text", () => {
    const text =
      "LABORATORY If you have a character here, you pay 1 {I} less to play items.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gustav the Giant - Terror of the Kingdom: should parse card text", () => {
    const text =
      "ALL TIED UP This character enters play exerted and can't ready at the start of your turn.\nBREAK FREE During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Hades - Hotheaded Ruler: should parse card text", () => {
    const text = "CALL THE TITANS {E} — Ready your Titan characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Helga Sinclair - Right-Hand Woman: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kida - Royal Warrior: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Little John - Resourceful Outlaw: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Little John.)\nOKAY, BIG SHOT While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Little John - Robin's Pal: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nDISGUISED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lythos - Rock Titan: should parse card text", () => {
    const text =
      "Resist +2 (Damage dealt to this character is reduced by 2.)\nSTONE SKIN {E} — Chosen character gains Resist +2 this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mickey Mouse - Stalwart Explorer: should parse card text", () => {
    const text =
      "LET'S TAKE A LOOK This character gets +1 {S} for each location you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Minnie Mouse - Funky Spelunker: should parse card text", () => {
    const text =
      "JOURNEY While this character is at a location, she gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mr. Smee - Bumbling Mate: should parse card text", () => {
    const text =
      "OH DEAR, DEAR, DEAR At the end of your turn, if this character is exerted and you don't have a Captain character in play, deal 1 damage to this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pyros - Lava Titan: should parse card text", () => {
    const text =
      "ERUPTION During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Razoul - Palace Guard: should parse card text", () => {
    const text =
      "LOOKY HERE While this character has no damage, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Sheriff of Nottingham - Corrupt Official: should parse card text", () => {
    const text =
      "TAXES SHOULD HURT Whenever you discard a card, you may deal 1 damage to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Simba - Fighting Prince: should parse card text", () => {
    const text =
      "STEP DOWN OR FIGHT When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Simba - Rightful King: should parse card text", () => {
    const text =
      "TRIUMPHANT STANCE During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Thaddeus E. Klang - Metallic Leader: should parse card text", () => {
    const text =
      "MY TEETH ARE SHARPER Whenever this character quests while at a location, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("And Then Along Came Zeus: should parse card text", () => {
    const text = "Deal 5 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Ba-Boom!: should parse card text", () => {
    const text = "Deal 2 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Olympus Would Be That Way: should parse card text", () => {
    const text =
      "Your characters get +3 {S} while challenging a location this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rise of the Titans: should parse card text", () => {
    const text = "Banish chosen location or item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Captain Hook's Rapier: should parse card text", () => {
    const text =
      "GET THOSE SCURVY BRATS! During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.\nLET'S HAVE AT IT! Your characters named Captain Hook gain Challenger +1. (They get +1 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Gizmosuit: should parse card text", () => {
    const text =
      "CYBERNETIC ARMOR Banish this item — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Map of Treasure Planet: should parse card text", () => {
    const text =
      "KEY TO THE PORTAL {E} — You pay 1 {I} less for the next location you play this turn.\nSHOW THE WAY You pay 1 {I} less to move your characters to a location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Bayou - Mysterious Swamp: should parse card text", () => {
    const text =
      "SHOW ME THE WAY Whenever a character quests while here, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });
});

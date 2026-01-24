import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 002 Card Text Parser Tests", () => {
  it.skip("Bashful - Hopeless Romantic: should parse card text", () => {
    const text =
      "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("OH, GOSH!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "OH, GOSH!",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-quest",
          condition: expect.objectContaining({
            type: "unless",
            condition: expect.objectContaining({
              type: "have-character",
              classification: "Seven Dwarfs",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Christopher Robin - Adventurer: should parse card text", () => {
    const text =
      "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("WE'LL ALWAYS BE TOGETHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WE'LL ALWAYS BE TOGETHER",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "ready",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
          condition: expect.objectContaining({
            type: "character-count",
            count: 2,
            comparison: "or-more",
          }),
          effect: expect.objectContaining({
            type: "gain-lore",
            amount: 2,
          }),
        }),
      }),
    );
  });

  it.skip("Cinderella - Ballroom Sensation: should parse card text", () => {
    const text = "Singer 3 (This character counts as cost 3 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 3,
      }),
    );
  });

  it.skip("Doc - Leader of the Seven Dwarfs: should parse card text", () => {
    const text =
      "SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("SHARE AND SHARE ALIKE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SHARE AND SHARE ALIKE",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "cost-reduction",
          amount: 1,
          cardType: "character",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Dopey - Always Playful: should parse card text", () => {
    const text =
      "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("ODD ONE OUT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ODD ONE OUT",
        trigger: expect.objectContaining({
          timing: "when",
          event: "banish",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: expect.objectContaining({
            controller: "you",
            classification: "Seven Dwarfs",
            excludeSelf: true,
          }),
          duration: "until-start-of-next-turn",
        }),
      }),
    );
  });

  it.skip("Gaston - Baritone Bully: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Singer",
        value: 5,
      }),
    );
  });

  it.skip("Grand Duke - Advisor to the King: should parse card text", () => {
    const text =
      "YES, YOUR MAJESTY Your Prince, Princess, King, and Queen characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("YES, YOUR MAJESTY");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "YES, YOUR MAJESTY",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: expect.objectContaining({
            controller: "you",
            classifications: ["Prince", "Princess", "King", "Queen"],
          }),
        }),
      }),
    );
  });

  it.skip("Grumpy - Bad-Tempered: should parse card text", () => {
    const text =
      "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("THERE'S TROUBLE A-BREWIN'");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "THERE'S TROUBLE A-BREWIN'",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: expect.objectContaining({
            controller: "you",
            classification: "Seven Dwarfs",
            excludeSelf: true,
          }),
        }),
      }),
    );
  });

  it.skip("Happy - Good-Natured: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("King Louie - Jungle VIP: should parse card text", () => {
    const text =
      "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("LAY IT ON THE LINE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LAY IT ON THE LINE",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "banish",
          on: expect.objectContaining({
            cardType: "character",
            excludeSelf: true,
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "remove-damage",
            amount: 2,
            upTo: true,
            target: "SELF",
          }),
        }),
      }),
    );
  });

  it.skip("Mickey Mouse - Friendly Face: should parse card text", () => {
    const text =
      "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("GLAD YOU'RE HERE!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GLAD YOU'RE HERE!",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "cost-reduction",
          amount: 3,
          cardType: "character",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Mufasa - Betrayed Leader: should parse card text", () => {
    const text =
      "THE SUN WILL SET When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("THE SUN WILL SET");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THE SUN WILL SET",
        trigger: expect.objectContaining({
          timing: "when",
          event: "banish",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "reveal-and-conditional",
            reveal: expect.objectContaining({
              source: "deck",
              count: 1,
            }),
            condition: expect.objectContaining({
              type: "card-type",
              cardType: "character",
            }),
            ifTrue: expect.objectContaining({
              type: "play-for-free",
              enterExerted: true,
            }),
            ifFalse: expect.objectContaining({
              type: "put-on-deck",
              position: "top",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Mulan - Reflecting: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Mulan.)\nHONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 2 },
      }),
    );

    // Second ability: HONOR TO THE ANCESTORS
    expect(result.abilities[1].name).toBe("HONOR TO THE ANCESTORS");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HONOR TO THE ANCESTORS",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "reveal-and-conditional",
            reveal: expect.objectContaining({
              source: "deck",
              count: 1,
            }),
            condition: expect.objectContaining({
              type: "card-type",
              cardType: "song",
            }),
            ifTrue: expect.objectContaining({
              type: "play-for-free",
            }),
            ifFalse: expect.objectContaining({
              type: "put-on-deck",
              position: "top",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Nana - Darling Family Pet: should parse card text", () => {
    const text =
      "NURSEMAID Whenever you play a Floodborn character, you may remove all damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("NURSEMAID");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NURSEMAID",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            classification: "Floodborn",
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "remove-damage",
            amount: "all",
            target: "CHOSEN_CHARACTER",
          }),
        }),
      }),
    );
  });

  it.skip("Rapunzel - Gifted Artist: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Rapunzel.)\nLET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 3 },
      }),
    );

    // Second ability: LET YOUR POWER SHINE
    expect(result.abilities[1].name).toBe("LET YOUR POWER SHINE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LET YOUR POWER SHINE",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "remove-damage",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      }),
    );
  });

  it.skip("Sleepy - Nodding Off: should parse card text", () => {
    const text = "YAWN! This character enters play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("YAWN!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "YAWN!",
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "enters-play-exerted",
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Sneezy - Very Allergic: should parse card text", () => {
    const text =
      "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("AH-CHOO!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "AH-CHOO!",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            or: [
              "SELF",
              expect.objectContaining({
                controller: "you",
                classification: "Seven Dwarfs",
              }),
            ],
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "modify-stat",
            stat: "strength",
            modifier: -1,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          }),
        }),
      }),
    );
  });

  it.skip("Snow White - Lost in the Forest: should parse card text", () => {
    const text =
      "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("I WON'T HURT YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I WON'T HURT YOU",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "remove-damage",
            amount: 2,
            upTo: true,
            target: "CHOSEN_CHARACTER",
          }),
        }),
      }),
    );
  });

  it.skip("Snow White - Unexpected Houseguest: should parse card text", () => {
    const text =
      "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("HOW DO YOU DO?");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "HOW DO YOU DO?",
        effect: expect.objectContaining({
          type: "cost-reduction",
          amount: 1,
          target: expect.objectContaining({
            cardType: "character",
            classification: "Seven Dwarfs",
          }),
        }),
      }),
    );
  });

  it.skip("Snow White - Well Wisher: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Snow White.)\nWISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 4 },
      }),
    );

    // Second ability: WISHES COME TRUE
    expect(result.abilities[1].name).toBe("WISHES COME TRUE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WISHES COME TRUE",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "return-from-discard",
            cardType: "character",
            target: "CONTROLLER",
          }),
        }),
      }),
    );
  });

  it.skip("The Queen - Commanding Presence: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)\nWHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 2 },
      }),
    );

    // Second ability: WHO IS THE FAIREST?
    expect(result.abilities[1].name).toBe("WHO IS THE FAIREST?");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WHO IS THE FAIREST?",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "compound",
          effects: [
            expect.objectContaining({
              type: "modify-stat",
              stat: "strength",
              modifier: -4,
              target: "CHOSEN_OPPOSING_CHARACTER",
              duration: "this-turn",
            }),
            expect.objectContaining({
              type: "modify-stat",
              stat: "strength",
              modifier: 4,
              target: "CHOSEN_CHARACTER",
              duration: "this-turn",
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Hold Still: should parse card text", () => {
    const text = "Remove up to 4 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "remove-damage",
          amount: 4,
          upTo: true,
          target: "CHOSEN_CHARACTER",
        }),
      }),
    );
  });

  it.skip("Last Stand: should parse card text", () => {
    const text = "Banish chosen character who was challenged this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "banish",
          target: expect.objectContaining({
            selector: "chosen",
            cardType: "character",
            condition: expect.objectContaining({
              type: "was-challenged-this-turn",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Painting the Roses Red: should parse card text", () => {
    const text = "Up to 2 chosen characters get -1 {S} this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "modify-stat",
              stat: "strength",
              modifier: -1,
              target: expect.objectContaining({
                selector: "chosen",
                count: 2,
                upTo: true,
                cardType: "character",
              }),
              duration: "this-turn",
            }),
            expect.objectContaining({
              type: "draw",
              amount: 1,
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Zero to Hero: should parse card text", () => {
    const text =
      "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "cost-reduction",
          amount: expect.objectContaining({
            type: "count",
            target: expect.objectContaining({
              controller: "you",
              cardType: "character",
              zone: "play",
            }),
          }),
          cardType: "character",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Dragon Gem: should parse card text", () => {
    const text =
      "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("BRING BACK TO LIFE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "BRING BACK TO LIFE",
        cost: expect.objectContaining({
          exert: true,
          ink: 3,
        }),
        effect: expect.objectContaining({
          type: "return-from-discard",
          cardType: "character",
          filter: expect.objectContaining({
            hasKeyword: "Support",
          }),
          target: "CONTROLLER",
        }),
      }),
    );
  });

  it.skip("Sleepy's Flute: should parse card text", () => {
    const text =
      "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("A SILLY SONG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "A SILLY SONG",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "conditional",
          condition: expect.objectContaining({
            type: "played-this-turn",
            cardType: "song",
          }),
          effect: expect.objectContaining({
            type: "gain-lore",
            amount: 1,
          }),
        }),
      }),
    );
  });

  it.skip("Arthur - Wizard's Apprentice: should parse card text", () => {
    const text =
      "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("STUDENT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "STUDENT",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "cost-effect",
            cost: expect.objectContaining({
              type: "return-to-hand",
              target: expect.objectContaining({
                controller: "you",
                excludeSelf: true,
              }),
            }),
            effect: expect.objectContaining({
              type: "gain-lore",
              amount: 2,
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Blue Fairy - Rewarding Good Deeds: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: ETHEREAL GLOW
    expect(result.abilities[1].name).toBe("ETHEREAL GLOW");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ETHEREAL GLOW",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            classification: "Floodborn",
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      }),
    );
  });

  it.skip("Dr. Facilier - Savvy Opportunist: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Fairy Godmother - Mystic Armorer: should parse card text", () => {
    const text = `Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)
FORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +3 {S} while challenging.)`;
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 2 },
      }),
    );

    // Second ability: FORGET THE COACH, HERE'S A SWORD
    expect(result.abilities[1].name).toBe("FORGET THE COACH, HERE'S A SWORD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FORGET THE COACH, HERE'S A SWORD",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "compound",
          effects: [
            expect.objectContaining({
              type: "gain-keyword",
              keyword: "Challenger",
              value: 3,
              target: "YOUR_CHARACTERS",
              duration: "this-turn",
            }),
            expect.objectContaining({
              type: "gain-ability",
              ability: expect.objectContaining({
                type: "triggered",
                trigger: expect.objectContaining({
                  event: "banish-in-challenge",
                }),
                effect: expect.objectContaining({
                  type: "return-to-hand",
                  target: "SELF",
                }),
              }),
              target: "YOUR_CHARACTERS",
              duration: "this-turn",
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Fairy Godmother - Pure Heart: should parse card text", () => {
    const text =
      "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("JUST LEAVE IT TO ME");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "JUST LEAVE IT TO ME",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            name: "Cinderella",
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "exert",
            target: "CHOSEN_CHARACTER",
          }),
        }),
      }),
    );
  });

  it.skip("HeiHei - Persistent Presence: should parse card text", () => {
    const text =
      "HE'S BACK! When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("HE'S BACK!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HE'S BACK!",
        trigger: expect.objectContaining({
          timing: "when",
          event: "banish-in-challenge",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Jiminy Cricket - Pinocchio's Conscience: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nTHAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: THAT STILL, SMALL VOICE
    expect(result.abilities[1].name).toBe("THAT STILL, SMALL VOICE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THAT STILL, SMALL VOICE",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional",
          condition: expect.objectContaining({
            type: "have-character",
            name: "Pinocchio",
          }),
          effect: expect.objectContaining({
            type: "optional",
            effect: expect.objectContaining({
              type: "draw",
              amount: 1,
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Madam Mim - Fox: should parse card text", () => {
    const text =
      "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.\nRush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CHASING THE RABBIT
    expect(result.abilities[0].name).toBe("CHASING THE RABBIT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CHASING THE RABBIT",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "choice",
          choices: [
            expect.objectContaining({
              type: "banish",
              target: "SELF",
            }),
            expect.objectContaining({
              type: "return-to-hand",
              target: expect.objectContaining({
                controller: "you",
                excludeSelf: true,
              }),
            }),
          ],
        }),
      }),
    );

    // Second ability: Rush
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );
  });

  it.skip("Madam Mim - Purple Dragon: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nI WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: I WIN, I WIN!
    expect(result.abilities[1].name).toBe("I WIN, I WIN!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I WIN, I WIN!",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "choice",
          choices: [
            expect.objectContaining({
              type: "banish",
              target: "SELF",
            }),
            expect.objectContaining({
              type: "return-to-hand",
              target: expect.objectContaining({
                selector: "chosen",
                count: 2,
                controller: "you",
                excludeSelf: true,
              }),
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Madam Mim - Rival of Merlin: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Madam Mim.)\nGRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 3 },
      }),
    );

    // Second ability: GRUESOME AND GRIM
    expect(result.abilities[1].name).toBe("GRUESOME AND GRIM");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "GRUESOME AND GRIM",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "play-for-free",
              filter: expect.objectContaining({
                cardType: "character",
                maxCost: 4,
              }),
            }),
            expect.objectContaining({
              type: "gain-keyword",
              keyword: "Rush",
              target: "PLAYED_CARD",
            }),
            expect.objectContaining({
              type: "delayed",
              timing: "end-of-turn",
              effect: expect.objectContaining({
                type: "banish",
                target: "PLAYED_CARD",
              }),
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Madam Mim - Snake: should parse card text", () => {
    const text =
      "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("JUST YOU WAIT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "JUST YOU WAIT",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "choice",
          choices: [
            expect.objectContaining({
              type: "banish",
              target: "SELF",
            }),
            expect.objectContaining({
              type: "return-to-hand",
              target: expect.objectContaining({
                controller: "you",
                excludeSelf: true,
              }),
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Merlin - Crab: should parse card text", () => {
    const text =
      "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("READY OR NOT!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "READY OR NOT!",
        trigger: expect.objectContaining({
          timing: "when",
          events: ["play", "leaves-play"],
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Challenger",
          value: 3,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Merlin - Goat: should parse card text", () => {
    const text =
      "HERE I COME! When you play this character and when he leaves play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("HERE I COME!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HERE I COME!",
        trigger: expect.objectContaining({
          timing: "when",
          events: ["play", "leaves-play"],
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Merlin - Rabbit: should parse card text", () => {
    const text =
      "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("HOPPITY HIP!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HOPPITY HIP!",
        trigger: expect.objectContaining({
          timing: "when",
          events: ["play", "leaves-play"],
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      }),
    );
  });

  it.skip("Merlin - Shapeshifter: should parse card text", () => {
    const text =
      "BATTLE OF WITS Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("BATTLE OF WITS");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BATTLE OF WITS",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "return-to-hand",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            excludeSelf: true,
          }),
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          target: "SELF",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Merlin - Squirrel: should parse card text", () => {
    const text =
      "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("LOOK BEFORE YOU LEAP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LOOK BEFORE YOU LEAP",
        trigger: expect.objectContaining({
          timing: "when",
          events: ["play", "leaves-play"],
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "look",
              source: "deck",
              position: "top",
              count: 1,
            }),
            expect.objectContaining({
              type: "put-on-deck",
              position: "choice",
              options: ["top", "bottom"],
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Pinocchio - On the Run: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pinocchio.)\nLISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 3 },
      }),
    );

    // Second ability: LISTEN TO YOUR CONSCIENCE
    expect(result.abilities[1].name).toBe("LISTEN TO YOUR CONSCIENCE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LISTEN TO YOUR CONSCIENCE",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "return-to-hand",
            target: expect.objectContaining({
              selector: "chosen",
              cardTypes: ["character", "item"],
              maxCost: 3,
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Pinocchio - Talkative Puppet: should parse card text", () => {
    const text =
      "TELLING LIES When you play this character, you may exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("TELLING LIES");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TELLING LIES",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "exert",
            target: "CHOSEN_OPPOSING_CHARACTER",
          }),
        }),
      }),
    );
  });

  it.skip("Yzma - Scary Beyond All Reason: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Yzma.)\nCRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 4 },
      }),
    );

    // Second ability: CRUEL IRONY
    expect(result.abilities[1].name).toBe("CRUEL IRONY");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CRUEL IRONY",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "shuffle-into-deck",
              target: expect.objectContaining({
                selector: "chosen",
                cardType: "character",
                excludeSelf: true,
              }),
            }),
            expect.objectContaining({
              type: "draw",
              amount: 2,
              target: "TARGET_OWNER",
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Gruesome and Grim: should parse card text", () => {
    const text =
      "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "play-for-free",
              filter: expect.objectContaining({
                cardType: "character",
                maxCost: 4,
              }),
            }),
            expect.objectContaining({
              type: "gain-keyword",
              keyword: "Rush",
              target: "PLAYED_CARD",
            }),
            expect.objectContaining({
              type: "delayed",
              timing: "end-of-turn",
              effect: expect.objectContaining({
                type: "banish",
                target: "PLAYED_CARD",
              }),
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Legend of the Sword in the Stone: should parse card text", () => {
    const text =
      "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Challenger",
          value: 3,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Binding Contract: should parse card text", () => {
    const text =
      "FOR ALL ETERNITY {E}, {E} one of your characters — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("FOR ALL ETERNITY");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "FOR ALL ETERNITY",
        cost: expect.objectContaining({
          exert: true,
          exertCharacter: true,
        }),
        effect: expect.objectContaining({
          type: "exert",
          target: "CHOSEN_CHARACTER",
        }),
      }),
    );
  });

  it.skip("Croquet Mallet: should parse card text", () => {
    const text =
      "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("HURTLING HEDGEHOG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "HURTLING HEDGEHOG",
        cost: expect.objectContaining({
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Rush",
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Perplexing Signposts: should parse card text", () => {
    const text =
      "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("TO WONDERLAND");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "TO WONDERLAND",
        cost: expect.objectContaining({
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "return-to-hand",
          target: expect.objectContaining({
            selector: "chosen",
            controller: "you",
            cardType: "character",
          }),
        }),
      }),
    );
  });

  it.skip("The Sorcerer's Spellbook: should parse card text", () => {
    const text = "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("KNOWLEDGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "KNOWLEDGE",
        cost: expect.objectContaining({
          exert: true,
          ink: 1,
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: 1,
        }),
      }),
    );
  });

  it.skip("Beast - Relentless: should parse card text", () => {
    const text =
      "SECOND WIND Whenever an opposing character is damaged, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("SECOND WIND");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SECOND WIND",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "damage",
          on: expect.objectContaining({
            controller: "opponent",
            cardType: "character",
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "ready",
            target: "SELF",
          }),
        }),
      }),
    );
  });

  it.skip("Belle - Bookworm: should parse card text", () => {
    const text =
      "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("USE YOUR IMAGINATION");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "USE YOUR IMAGINATION",
        condition: expect.objectContaining({
          type: "hand-count",
          controller: "opponent",
          count: 0,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 2,
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Belle - Hidden Archer: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nTHORNY ARROWS Whenever this character is challenged, the challenging character's player discards all cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 3 },
      }),
    );

    // Second ability: THORNY ARROWS
    expect(result.abilities[1].name).toBe("THORNY ARROWS");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THORNY ARROWS",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "challenge",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "discard",
          amount: "all",
          target: "CHALLENGER_OWNER",
        }),
      }),
    );
  });

  it.skip("Bucky - Squirrel Squeak Tutor: should parse card text", () => {
    const text =
      "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("SQUEAK");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SQUEAK",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            classification: "Floodborn",
          }),
        }),
        effect: expect.objectContaining({
          type: "conditional",
          condition: expect.objectContaining({
            type: "used-shift",
          }),
          effect: expect.objectContaining({
            type: "discard",
            amount: 1,
            target: "EACH_OPPONENT",
            chosenBy: "TARGET",
          }),
        }),
      }),
    );
  });

  it.skip("Cheshire Cat - From the Shadows: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)\nEvasive (Only characters with Evasive can challenge this character.)\nWICKED SMILE {E} — Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 5 },
      }),
    );

    // Second ability: Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Third ability: WICKED SMILE
    expect(result.abilities[2].name).toBe("WICKED SMILE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "WICKED SMILE",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "banish",
          target: expect.objectContaining({
            selector: "chosen",
            cardType: "character",
            condition: expect.objectContaining({
              type: "damaged",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Dr. Facilier - Fortune Teller: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nYOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: YOU'RE IN MY WORLD
    expect(result.abilities[1].name).toBe("YOU'RE IN MY WORLD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOU'RE IN MY WORLD",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-quest",
          target: "CHOSEN_OPPOSING_CHARACTER",
          duration: "next-turn",
        }),
      }),
    );
  });

  it.skip("Flynn Rider - His Own Biggest Fan: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)\nEvasive (Only characters with Evasive can challenge this character.)\nONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 2 },
      }),
    );

    // Second ability: Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Third ability: ONE LAST, BIG SCORE
    expect(result.abilities[2].name).toBe("ONE LAST, BIG SCORE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "ONE LAST, BIG SCORE",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: expect.objectContaining({
            type: "for-each",
            count: expect.objectContaining({
              type: "cards-in-hand",
              controller: "opponents",
            }),
            modifier: -1,
          }),
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Gaston - Scheming Suitor: should parse card text", () => {
    const text =
      "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("YES, I'M INTIMIDATING");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "YES, I'M INTIMIDATING",
        condition: expect.objectContaining({
          type: "hand-count",
          controller: "opponents",
          count: 0,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Lucifer - Cunning Cat: should parse card text", () => {
    const text =
      "MOUSE CATCHER When you play this character, each opponent chooses and discards either 2 cards or 1 action card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("MOUSE CATCHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MOUSE CATCHER",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "for-each-opponent",
          effect: expect.objectContaining({
            type: "choice",
            chosenBy: "TARGET",
            choices: [
              expect.objectContaining({
                type: "discard",
                amount: 2,
              }),
              expect.objectContaining({
                type: "discard",
                amount: 1,
                filter: expect.objectContaining({
                  cardType: "action",
                }),
              }),
            ],
          }),
        }),
      }),
    );
  });

  it.skip("Pain - Underworld Imp: should parse card text", () => {
    const text =
      "COMING, YOUR MOST LUGUBRIOUSNESS While this character has 5 {S} or more, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("COMING, YOUR MOST LUGUBRIOUSNESS");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "COMING, YOUR MOST LUGUBRIOUSNESS",
        condition: expect.objectContaining({
          type: "stat-threshold",
          stat: "strength",
          value: 5,
          comparison: "or-more",
          target: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 2,
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Panic - Underworld Imp: should parse card text", () => {
    const text =
      "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("I CAN HANDLE IT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I CAN HANDLE IT",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "conditional-modifier",
          baseEffect: expect.objectContaining({
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          }),
          condition: expect.objectContaining({
            type: "named",
            name: "Pain",
          }),
          modifiedEffect: expect.objectContaining({
            type: "modify-stat",
            stat: "strength",
            modifier: 4,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          }),
        }),
      }),
    );
  });

  it.skip("Pete - Bad Guy: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nTAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.\nWHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Ward
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Second ability: TAKE THAT!
    expect(result.abilities[1].name).toBe("TAKE THAT!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TAKE THAT!",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "action",
          }),
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "SELF",
          duration: "this-turn",
        }),
      }),
    );

    // Third ability: WHO'S NEXT?
    expect(result.abilities[2].name).toBe("WHO'S NEXT?");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "WHO'S NEXT?",
        condition: expect.objectContaining({
          type: "stat-threshold",
          stat: "strength",
          value: 7,
          comparison: "or-more",
          target: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 2,
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Prince John - Greediest of All: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nI SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Second ability: I SENTENCE YOU
    expect(result.abilities[1].name).toBe("I SENTENCE YOU");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I SENTENCE YOU",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "discard",
          on: expect.objectContaining({
            controller: "opponent",
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "draw",
            amount: expect.objectContaining({
              type: "for-each",
              count: "DISCARDED_COUNT",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Queen of Hearts - Quick-Tempered: should parse card text", () => {
    const text =
      "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("ROYAL RAGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ROYAL RAGE",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 1,
          target: expect.objectContaining({
            selector: "chosen",
            controller: "opponent",
            cardType: "character",
            condition: expect.objectContaining({
              type: "damaged",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Ratigan - Criminal Mastermind: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Ray - Easygoing Firefly: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("The Queen - Disguised Peddler: should parse card text", () => {
    const text =
      "A PERFECT DISGUISE {E}, Choose and discard a character card — Gain lore equal to the discarded character's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("A PERFECT DISGUISE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "A PERFECT DISGUISE",
        cost: expect.objectContaining({
          exert: true,
          discard: expect.objectContaining({
            cardType: "character",
            amount: 1,
          }),
        }),
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: expect.objectContaining({
            type: "equal-to-stat",
            stat: "lore",
            target: "DISCARDED_CARD",
          }),
        }),
      }),
    );
  });

  it.skip("Bibbidi Bobbidi Boo: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand to play another character with the same cost or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "cost-effect",
          cost: expect.objectContaining({
            type: "return-to-hand",
            target: expect.objectContaining({
              selector: "chosen",
              controller: "you",
              cardType: "character",
            }),
          }),
          effect: expect.objectContaining({
            type: "play-for-free",
            filter: expect.objectContaining({
              cardType: "character",
              maxCost: "RETURNED_CARD_COST",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Bounce: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand to return another chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "cost-effect",
          cost: expect.objectContaining({
            type: "return-to-hand",
            target: expect.objectContaining({
              selector: "chosen",
              controller: "you",
              cardType: "character",
            }),
          }),
          effect: expect.objectContaining({
            type: "return-to-hand",
            target: expect.objectContaining({
              selector: "chosen",
              cardType: "character",
              excludeSelf: true,
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Hypnotize: should parse card text", () => {
    const text = "Each opponent chooses and discards a card. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "discard",
              amount: 1,
              target: "EACH_OPPONENT",
              chosenBy: "TARGET",
            }),
            expect.objectContaining({
              type: "draw",
              amount: 1,
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Pack Tactics: should parse card text", () => {
    const text =
      "Gain 1 lore for each damaged character opponents have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-lore",
          amount: expect.objectContaining({
            type: "for-each",
            count: expect.objectContaining({
              type: "character-count",
              controller: "opponents",
              condition: expect.objectContaining({
                type: "damaged",
              }),
            }),
            multiplier: 1,
          }),
        }),
      }),
    );
  });

  it.skip("Ring the Bell: should parse card text", () => {
    const text = "Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "banish",
          target: expect.objectContaining({
            selector: "chosen",
            cardType: "character",
            condition: expect.objectContaining({
              type: "damaged",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Ratigan's Marvelous Trap: should parse card text", () => {
    const text =
      "SNAP! BOOM! TWANG! Banish this item — Each opponent loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("SNAP! BOOM! TWANG!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "SNAP! BOOM! TWANG!",
        cost: expect.objectContaining({
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "lose-lore",
          amount: 2,
          target: "EACH_OPPONENT",
        }),
      }),
    );
  });

  it.skip("Donald Duck - Not Again!: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPHOOEY! This character gets +1 {L} for each 1 damage on him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Second ability: PHOOEY!
    expect(result.abilities[1].name).toBe("PHOOEY!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "PHOOEY!",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: expect.objectContaining({
            type: "for-each",
            count: expect.objectContaining({
              type: "damage-on",
              target: "SELF",
            }),
            multiplier: 1,
          }),
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Felicia - Always Hungry: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Reckless",
      }),
    );
  });

  it.skip("Fidget - Ratigan's Henchman: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Honest John - Not That Honest: should parse card text", () => {
    const text =
      "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("EASY STREET");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "EASY STREET",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            classification: "Floodborn",
          }),
        }),
        effect: expect.objectContaining({
          type: "lose-lore",
          amount: 1,
          target: "EACH_OPPONENT",
        }),
      }),
    );
  });

  it.skip("Lady Tremaine - Imperious Queen: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)\nPOWER TO RULE AT LAST When you play this character, each opponent chooses and banishes one of their characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 4 },
      }),
    );

    // Second ability: POWER TO RULE AT LAST
    expect(result.abilities[1].name).toBe("POWER TO RULE AT LAST");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "POWER TO RULE AT LAST",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "for-each-opponent",
          effect: expect.objectContaining({
            type: "banish",
            target: expect.objectContaining({
              selector: "chosen",
              controller: "TARGET",
              cardType: "character",
            }),
            chosenBy: "TARGET",
          }),
        }),
      }),
    );
  });

  it.skip("Lady Tremaine - Overbearing Matriarch: should parse card text", () => {
    const text =
      "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("NOT FOR YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NOT FOR YOU",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "for-each-opponent",
          condition: expect.objectContaining({
            type: "lore-comparison",
            comparison: "more-than",
            compareTo: "you",
          }),
          effect: expect.objectContaining({
            type: "lose-lore",
            amount: 1,
          }),
        }),
      }),
    );
  });

  it.skip("Minnie Mouse - Stylish Surfer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );
  });

  it.skip("Minnie Mouse - Wide-Eyed Diver: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Minnie Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nUNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 2 },
      }),
    );

    // Second ability: Evasive
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Evasive",
      }),
    );

    // Third ability: UNDERSEA ADVENTURE
    expect(result.abilities[2].name).toBe("UNDERSEA ADVENTURE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "UNDERSEA ADVENTURE",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "action",
          }),
          condition: expect.objectContaining({
            type: "second-in-turn",
          }),
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "lore",
          modifier: 2,
          target: "SELF",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Mother Gothel - Withered and Wicked: should parse card text", () => {
    const text =
      "WHAT HAVE YOU DONE?! This character enters play with 3 damage.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("WHAT HAVE YOU DONE?!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "WHAT HAVE YOU DONE?!",
        effect: expect.objectContaining({
          type: "enters-play-with",
          damage: 3,
        }),
      }),
    );
  });

  it.skip("Mulan - Soldier in Training: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );
  });

  it.skip("Namaari - Nemesis: should parse card text", () => {
    const text =
      "THIS SHOULDN'T TAKE LONG {E}, Banish this character — Banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("THIS SHOULDN'T TAKE LONG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "THIS SHOULDN'T TAKE LONG",
        cost: expect.objectContaining({
          exert: true,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "banish",
          target: "CHOSEN_CHARACTER",
        }),
      }),
    );
  });

  it.skip("Ratigan - Very Large Mouse: should parse card text", () => {
    const text =
      "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("THIS IS MY KINGDOM");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THIS IS MY KINGDOM",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "exert",
              target: expect.objectContaining({
                selector: "chosen",
                controller: "opponent",
                cardType: "character",
                condition: expect.objectContaining({
                  type: "stat-threshold",
                  stat: "strength",
                  value: 3,
                  comparison: "or-less",
                }),
              }),
            }),
            expect.objectContaining({
              type: "ready",
              target: expect.objectContaining({
                selector: "chosen",
                controller: "you",
                cardType: "character",
              }),
            }),
            expect.objectContaining({
              type: "restriction",
              restriction: "cant-quest",
              target: "CHOSEN_CHARACTER",
              duration: "this-turn",
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Raya - Leader of Heart: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Raya.)\nCHAMPION OF KUMANDRA Whenever this character challenges a damaged character, she takes no damage from the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 4 },
      }),
    );

    // Second ability: CHAMPION OF KUMANDRA
    expect(result.abilities[1].name).toBe("CHAMPION OF KUMANDRA");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CHAMPION OF KUMANDRA",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "challenge",
          on: "SELF",
          condition: expect.objectContaining({
            type: "target-is",
            target: "CHALLENGED_CHARACTER",
            condition: expect.objectContaining({
              type: "damaged",
            }),
          }),
        }),
        effect: expect.objectContaining({
          type: "prevent-damage",
          target: "SELF",
          source: "challenge",
        }),
      }),
    );
  });

  it.skip("Scar - Vicious Cheater: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nDADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Rush",
      }),
    );

    // Second ability: DADDY ISN'T HERE TO SAVE YOU
    expect(result.abilities[1].name).toBe("DADDY ISN'T HERE TO SAVE YOU");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DADDY ISN'T HERE TO SAVE YOU",
        condition: expect.objectContaining({
          type: "your-turn",
        }),
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "banish-in-challenge",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "sequence",
            steps: [
              expect.objectContaining({
                type: "ready",
                target: "SELF",
              }),
              expect.objectContaining({
                type: "restriction",
                restriction: "cant-quest",
                target: "SELF",
                duration: "this-turn",
              }),
            ],
          }),
        }),
      }),
    );
  });

  it.skip("Tigger - One of a Kind: should parse card text", () => {
    const text =
      "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("ENERGETIC");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ENERGETIC",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "action",
          }),
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "SELF",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Tuk Tuk - Wrecking Ball: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Reckless",
      }),
    );
  });

  it.skip("Go the Distance: should parse card text", () => {
    const text =
      "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "ready",
              target: expect.objectContaining({
                selector: "chosen",
                controller: "you",
                cardType: "character",
                condition: expect.objectContaining({
                  type: "damaged",
                }),
              }),
            }),
            expect.objectContaining({
              type: "restriction",
              restriction: "cant-quest",
              target: "CHOSEN_CHARACTER",
              duration: "this-turn",
            }),
            expect.objectContaining({
              type: "draw",
              amount: 1,
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Teeth and Ambitions: should parse card text", () => {
    const text =
      "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "cost-effect",
          cost: expect.objectContaining({
            type: "deal-damage",
            amount: 2,
            target: expect.objectContaining({
              selector: "chosen",
              controller: "you",
              cardType: "character",
            }),
          }),
          effect: expect.objectContaining({
            type: "deal-damage",
            amount: 2,
            target: expect.objectContaining({
              selector: "chosen",
              cardType: "character",
              excludeSelf: true,
            }),
          }),
        }),
      }),
    );
  });

  it.skip("The Most Diabolical Scheme: should parse card text", () => {
    const text = "Banish chosen Villain of yours to banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "cost-effect",
          cost: expect.objectContaining({
            type: "banish",
            target: expect.objectContaining({
              selector: "chosen",
              controller: "you",
              classification: "Villain",
            }),
          }),
          effect: expect.objectContaining({
            type: "banish",
            target: "CHOSEN_CHARACTER",
          }),
        }),
      }),
    );
  });

  it.skip("What Did You Call Me?: should parse card text", () => {
    const text = "Chosen damaged character gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: expect.objectContaining({
            selector: "chosen",
            cardType: "character",
            condition: expect.objectContaining({
              type: "damaged",
            }),
          }),
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Peter Pan's Dagger: should parse card text", () => {
    const text = "Your characters with Evasive get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          target: expect.objectContaining({
            controller: "you",
            cardType: "character",
            hasKeyword: "Evasive",
          }),
        }),
      }),
    );
  });

  it.skip("Sword in the Stone: should parse card text", () => {
    const text =
      "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: expect.objectContaining({
            type: "for-each",
            count: expect.objectContaining({
              type: "damage-on",
              target: "CHOSEN_CHARACTER",
            }),
            multiplier: 1,
          }),
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Basil - Great Mouse Detective: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Basil.)\nTHERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 5 },
      }),
    );

    // Second ability: THERE'S ALWAYS A CHANCE
    expect(result.abilities[1].name).toBe("THERE'S ALWAYS A CHANCE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THERE'S ALWAYS A CHANCE",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        condition: expect.objectContaining({
          type: "used-shift",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "draw",
            amount: 2,
          }),
        }),
      }),
    );
  });

  it.skip("Basil - Of Baker Street: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Support",
      }),
    );
  });

  it.skip("Cogsworth - Grandfather Clock: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)\nWard (Opponents can't choose this character except to challenge.)\nUNWIND Your other characters gain Resist +1 (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 3 },
      }),
    );

    // Second ability: Ward
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );

    // Third ability: UNWIND
    expect(result.abilities[2].name).toBe("UNWIND");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "UNWIND",
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
          target: expect.objectContaining({
            controller: "you",
            cardType: "character",
            excludeSelf: true,
          }),
        }),
      }),
    );
  });

  it.skip("Cogsworth - Talking Clock: should parse card text", () => {
    const text = `WAIT A MINUTE Your characters with Reckless gain "{E} — Gain 1 lore."`;
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("WAIT A MINUTE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "WAIT A MINUTE",
        effect: expect.objectContaining({
          type: "grant-ability",
          ability: expect.objectContaining({
            type: "activated",
            cost: expect.objectContaining({
              exert: true,
            }),
            effect: expect.objectContaining({
              type: "gain-lore",
              amount: 1,
            }),
          }),
          target: expect.objectContaining({
            controller: "you",
            cardType: "character",
            hasKeyword: "Reckless",
          }),
        }),
      }),
    );
  });

  it.skip("Cruella De Vil - Perfectly Wretched: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cruella De Vil.)\nOH, NO YOU DON'T Whenever this character quests, chosen opposing character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 3 },
      }),
    );

    // Second ability: OH, NO YOU DON'T
    expect(result.abilities[1].name).toBe("OH, NO YOU DON'T");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OH, NO YOU DON'T",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: -2,
          target: "CHOSEN_OPPOSING_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Duke Weaselton - Small-Time Crook: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );
  });

  it.skip("Gaston - Intellectual Powerhouse: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gaston.)\nDEVELOPED BRAIN When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 4 },
      }),
    );

    // Second ability: DEVELOPED BRAIN
    expect(result.abilities[1].name).toBe("DEVELOPED BRAIN");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "DEVELOPED BRAIN",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "look",
              source: "deck",
              position: "top",
              count: 3,
            }),
            expect.objectContaining({
              type: "optional",
              effect: expect.objectContaining({
                type: "put-into-hand",
                count: 1,
              }),
            }),
            expect.objectContaining({
              type: "put-on-deck",
              position: "bottom",
              order: "any",
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Hiram Flaversham - Toymaker: should parse card text", () => {
    const text =
      "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("ARTIFICER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ARTIFICER",
        trigger: expect.objectContaining({
          timing: "when",
          events: ["play", "quest"],
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "cost-effect",
            cost: expect.objectContaining({
              type: "banish",
              target: expect.objectContaining({
                controller: "you",
                cardType: "item",
              }),
            }),
            effect: expect.objectContaining({
              type: "draw",
              amount: 2,
            }),
          }),
        }),
      }),
    );
  });

  it.skip("James - Role Model: should parse card text", () => {
    const text =
      "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("NEVER, EVER LOSE SIGHT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NEVER, EVER LOSE SIGHT",
        trigger: expect.objectContaining({
          timing: "when",
          event: "banish",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "put-into-inkwell",
            target: "SELF",
            exerted: true,
          }),
        }),
      }),
    );
  });

  it.skip("Mrs. Judson - Housekeeper: should parse card text", () => {
    const text =
      "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("TIDY UP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TIDY UP",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            classification: "Floodborn",
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "put-into-inkwell",
            source: "deck",
            position: "top",
            exerted: true,
          }),
        }),
      }),
    );
  });

  it.skip("Nick Wilde - Wily Fox: should parse card text", () => {
    const text =
      "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("IT'S CALLED A HUSTLE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IT'S CALLED A HUSTLE",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "return-from-discard",
            target: expect.objectContaining({
              cardType: "item",
              name: "Pawpsicle",
            }),
            destination: "hand",
          }),
        }),
      }),
    );
  });

  it.skip("Noi - Orphaned Thief: should parse card text", () => {
    const text =
      "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward. (Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("HIDE AND SEEK");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "HIDE AND SEEK",
        condition: expect.objectContaining({
          type: "have-card",
          cardType: "item",
          controller: "you",
        }),
        effect: expect.objectContaining({
          type: "gain-keywords",
          keywords: [{ keyword: "Resist", value: 1 }, { keyword: "Ward" }],
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Sisu - Divine Water Dragon: should parse card text", () => {
    const text =
      "I TRUST YOU Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("I TRUST YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I TRUST YOU",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "look",
              source: "deck",
              position: "top",
              count: 2,
            }),
            expect.objectContaining({
              type: "optional",
              effect: expect.objectContaining({
                type: "put-into-hand",
                count: 1,
              }),
            }),
            expect.objectContaining({
              type: "put-on-deck",
              position: "bottom",
              order: "any",
            }),
          ],
        }),
      }),
    );
  });

  it.skip("The Nokk - Water Spirit: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Ward",
      }),
    );
  });

  it.skip("Falling Down the Rabbit Hole: should parse card text", () => {
    const text =
      "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "for-each-player",
          effect: expect.objectContaining({
            type: "put-into-inkwell",
            target: expect.objectContaining({
              selector: "chosen",
              controller: "TARGET",
              cardType: "character",
            }),
            chosenBy: "TARGET",
            exerted: true,
          }),
        }),
      }),
    );
  });

  it.skip("Launch: should parse card text", () => {
    const text =
      "Banish chosen item of yours to deal 5 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "cost-effect",
          cost: expect.objectContaining({
            type: "banish",
            target: expect.objectContaining({
              selector: "chosen",
              controller: "you",
              cardType: "item",
            }),
          }),
          effect: expect.objectContaining({
            type: "deal-damage",
            amount: 5,
            target: "CHOSEN_CHARACTER",
          }),
        }),
      }),
    );
  });

  it.skip("Nothing to Hide: should parse card text", () => {
    const text = "Each opponent reveals their hand. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "reveal-hand",
              target: "EACH_OPPONENT",
            }),
            expect.objectContaining({
              type: "draw",
              amount: 1,
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Fang Crossbow: should parse card text", () => {
    const text =
      "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.\nSTAY BACK! {E}, Banish this item — Banish chosen Dragon character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CAREFUL AIM
    expect(result.abilities[0].name).toBe("CAREFUL AIM");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "CAREFUL AIM",
        cost: expect.objectContaining({
          exert: true,
          ink: 2,
        }),
        effect: expect.objectContaining({
          type: "modify-stat",
          stat: "strength",
          modifier: -2,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );

    // Second ability: STAY BACK!
    expect(result.abilities[1].name).toBe("STAY BACK!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "STAY BACK!",
        cost: expect.objectContaining({
          exert: true,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "banish",
          target: expect.objectContaining({
            selector: "chosen",
            cardType: "character",
            classification: "Dragon",
          }),
        }),
      }),
    );
  });

  it.skip("Gumbo Pot: should parse card text", () => {
    const text =
      "THE BEST I'VE EVER TASTED {E} — Remove 1 damage each from up to 2 chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("THE BEST I'VE EVER TASTED");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "THE BEST I'VE EVER TASTED",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
          amount: 1,
          target: expect.objectContaining({
            selector: "chosen",
            cardType: "character",
            count: 2,
            upTo: true,
          }),
        }),
      }),
    );
  });

  it.skip("Maurice's Workshop: should parse card text", () => {
    const text =
      "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("LOOKING FOR THIS?");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LOOKING FOR THIS?",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "item",
            excludeSelf: true,
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "cost-effect",
            cost: expect.objectContaining({
              ink: 1,
            }),
            effect: expect.objectContaining({
              type: "draw",
              amount: 1,
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Pawpsicle: should parse card text", () => {
    const text =
      "JUMBO POP When you play this item, you may draw a card.\nTHAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: JUMBO POP
    expect(result.abilities[0].name).toBe("JUMBO POP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "JUMBO POP",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      }),
    );

    // Second ability: THAT'S REDWOOD
    expect(result.abilities[1].name).toBe("THAT'S REDWOOD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "THAT'S REDWOOD",
        cost: expect.objectContaining({
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: "CHOSEN_CHARACTER",
        }),
      }),
    );
  });

  it.skip("Sardine Can: should parse card text", () => {
    const text =
      "FLIGHT CABIN Your exerted characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("FLIGHT CABIN");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FLIGHT CABIN",
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Ward",
          target: expect.objectContaining({
            controller: "you",
            cardType: "character",
            condition: expect.objectContaining({
              type: "exerted",
            }),
          }),
        }),
      }),
    );
  });

  it.skip("Beast - Forbidding Recluse: should parse card text", () => {
    const text =
      "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("YOU'RE NOT WELCOME HERE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOU'RE NOT WELCOME HERE",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "deal-damage",
            amount: 1,
            target: "CHOSEN_CHARACTER",
          }),
        }),
      }),
    );
  });

  it.skip("Beast - Selfless Protector: should parse card text", () => {
    const text =
      "SHIELD ANOTHER Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("SHIELD ANOTHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SHIELD ANOTHER",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "would-be-dealt-damage",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            excludeSelf: true,
          }),
        }),
        effect: expect.objectContaining({
          type: "redirect-damage",
          target: "SELF",
          amount: "ALL",
        }),
      }),
    );
  });

  it.skip("Beast - Tragic Hero: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Beast.)\nIT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 3 },
      }),
    );

    // Second ability: IT'S BETTER THIS WAY
    expect(result.abilities[1].name).toBe("IT'S BETTER THIS WAY");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "IT'S BETTER THIS WAY",
        trigger: expect.objectContaining({
          timing: "at",
          event: "start-turn",
          on: "YOU",
        }),
        effect: expect.objectContaining({
          type: "conditional",
          condition: expect.objectContaining({
            type: "no-damage",
            target: "SELF",
          }),
          thenEffect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
          elseEffect: expect.objectContaining({
            type: "modify-stat",
            stat: "strength",
            modifier: 4,
            target: "SELF",
            duration: "this-turn",
          }),
        }),
      }),
    );
  });

  it.skip("Chief Bogo - Respected Officer: should parse card text", () => {
    const text =
      "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("INSUBORDINATION!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "INSUBORDINATION!",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            classification: "Floodborn",
          }),
        }),
        effect: expect.objectContaining({
          type: "deal-damage",
          amount: 1,
          target: "EACH_OPPOSING_CHARACTER",
        }),
      }),
    );
  });

  it.skip("Cinderella - Knight in Training: should parse card text", () => {
    const text =
      "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("HAVE COURAGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "HAVE COURAGE",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "sequence",
            steps: [
              expect.objectContaining({
                type: "draw",
                amount: 1,
              }),
              expect.objectContaining({
                type: "discard",
                amount: 1,
                chosenBy: "you",
              }),
            ],
          }),
        }),
      }),
    );
  });

  it.skip("Cinderella - Stouthearted: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cinderella.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nTHE SINGING SWORD Whenever you play a song, this character may challenge ready characters this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 5 },
      }),
    );

    // Second ability: Resist +2
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 2,
      }),
    );

    // Third ability: THE SINGING SWORD
    expect(result.abilities[2].name).toBe("THE SINGING SWORD");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "THE SINGING SWORD",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "action",
            subtype: "song",
          }),
        }),
        effect: expect.objectContaining({
          type: "gain-ability",
          ability: expect.objectContaining({
            type: "challenge-ready",
          }),
          target: "SELF",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Hercules - Divine Hero: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Hercules.)\nResist +2 (Damage dealt to this character is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 4 },
      }),
    );

    // Second ability: Resist +2
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 2,
      }),
    );
  });

  it.skip("Jafar - Dreadnought: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jafar.)\nNOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Shift",
        cost: { ink: 2 },
      }),
    );

    // Second ability: NOW WHERE WERE WE?
    expect(result.abilities[1].name).toBe("NOW WHERE WERE WE?");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "NOW WHERE WERE WE?",
        condition: expect.objectContaining({
          type: "your-turn",
        }),
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "banish-in-challenge",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      }),
    );
  });

  it.skip("Kronk - Junior Chipmunk: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nSCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Resist +1
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 1,
      }),
    );

    // Second ability: SCOUT LEADER
    expect(result.abilities[1].name).toBe("SCOUT LEADER");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SCOUT LEADER",
        condition: expect.objectContaining({
          type: "your-turn",
        }),
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "banish-in-challenge",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          }),
        }),
      }),
    );
  });

  it.skip("Li Shang - Archery Instructor: should parse card text", () => {
    const text =
      "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("ARCHERY LESSON");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "ARCHERY LESSON",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Evasive",
          target: "YOUR_CHARACTERS",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Magic Broom - Industrial Model: should parse card text", () => {
    const text =
      "MAKE IT SHINE When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("MAKE IT SHINE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "MAKE IT SHINE",
        trigger: expect.objectContaining({
          timing: "when",
          event: "play",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
          target: "CHOSEN_CHARACTER",
          duration: "until-start-of-next-turn",
        }),
      }),
    );
  });

  it.skip("Namaari - Morning Mist: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBLADES This character can challenge ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // Second ability: BLADES
    expect(result.abilities[1].name).toBe("BLADES");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "BLADES",
        effect: expect.objectContaining({
          type: "challenge-ready",
          target: "SELF",
        }),
      }),
    );
  });

  it.skip("Queen of Hearts - Capricious Monarch: should parse card text", () => {
    const text =
      "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("OFF WITH THEIR HEADS!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "OFF WITH THEIR HEADS!",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "banish",
          on: expect.objectContaining({
            controller: "opponent",
            cardType: "character",
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "ready",
            target: "SELF",
          }),
        }),
      }),
    );
  });

  it.skip("The Huntsman - Reluctant Enforcer: should parse card text", () => {
    const text =
      "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("CHANGE OF HEART");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "CHANGE OF HEART",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "quest",
          on: "SELF",
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "sequence",
            steps: [
              expect.objectContaining({
                type: "draw",
                amount: 1,
              }),
              expect.objectContaining({
                type: "discard",
                amount: 1,
                chosenBy: "you",
              }),
            ],
          }),
        }),
      }),
    );
  });

  it.skip("The Prince - Never Gives Up: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Bodyguard",
      }),
    );

    // Second ability: Resist +1
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 1,
      }),
    );
  });

  it.skip("Tiana - Celebrating Princess: should parse card text", () => {
    const text =
      "Resist +2 (Damage dealt to this character is reduced by 2.)\nWHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Resist +2
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 2,
      }),
    );

    // Second ability: WHAT YOU GIVE IS WHAT YOU GET
    expect(result.abilities[1].name).toBe("WHAT YOU GIVE IS WHAT YOU GET");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "WHAT YOU GIVE IS WHAT YOU GET",
        condition: expect.objectContaining({
          type: "and",
          conditions: [
            expect.objectContaining({
              type: "exerted",
              target: "SELF",
            }),
            expect.objectContaining({
              type: "hand-count",
              controller: "you",
              count: 0,
            }),
          ],
        }),
        effect: expect.objectContaining({
          type: "restriction",
          restriction: "cant-play-actions",
          target: "OPPONENTS",
        }),
      }),
    );
  });

  it.skip("Charge!: should parse card text", () => {
    const text =
      "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keywords",
          keywords: [
            { keyword: "Challenger", value: 2 },
            { keyword: "Resist", value: 2 },
          ],
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Let the Storm Rage On: should parse card text", () => {
    const text = "Deal 2 damage to chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
          steps: [
            expect.objectContaining({
              type: "deal-damage",
              amount: 2,
              target: "CHOSEN_CHARACTER",
            }),
            expect.objectContaining({
              type: "draw",
              amount: 1,
            }),
          ],
        }),
      }),
    );
  });

  it.skip("Pick a Fight: should parse card text", () => {
    const text = "Chosen character can challenge ready characters this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-ability",
          ability: expect.objectContaining({
            type: "challenge-ready",
          }),
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Last Cannon: should parse card text", () => {
    const text =
      "ARM YOURSELF 1 {I}, Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("ARM YOURSELF");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "ARM YOURSELF",
        cost: expect.objectContaining({
          ink: 1,
          banishSelf: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Challenger",
          value: 3,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        }),
      }),
    );
  });

  it.skip("Mouse Armor: should parse card text", () => {
    const text =
      "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("PROTECTION");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "activated",
        name: "PROTECTION",
        cost: expect.objectContaining({
          exert: true,
        }),
        effect: expect.objectContaining({
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
          target: "CHOSEN_CHARACTER",
          duration: "until-start-of-next-turn",
        }),
      }),
    );
  });

  it.skip("Weight Set: should parse card text", () => {
    const text =
      "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    expect(result.abilities[0].name).toBe("TRAINING");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TRAINING",
        trigger: expect.objectContaining({
          timing: "whenever",
          event: "play",
          on: expect.objectContaining({
            controller: "you",
            cardType: "character",
            condition: expect.objectContaining({
              type: "cost-threshold",
              value: 4,
              comparison: "or-more",
            }),
          }),
        }),
        effect: expect.objectContaining({
          type: "optional",
          effect: expect.objectContaining({
            type: "cost-effect",
            cost: expect.objectContaining({
              ink: 1,
            }),
            effect: expect.objectContaining({
              type: "draw",
              amount: 1,
            }),
          }),
        }),
      }),
    );
  });
});

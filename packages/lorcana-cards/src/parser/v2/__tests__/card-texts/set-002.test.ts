import { describe, expect, it } from "bun:test";
import type {
  ActionAbilityDefinition,
  ActivatedAbilityDefinition,
  KeywordAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 002 Card Text Parser Tests", () => {
  it.skip("Bashful - Hopeless Romantic: should parse card text", () => {
    const text =
      "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ohGosh: StaticAbilityDefinition = {
      type: "static",
      name: "OH, GOSH!",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        condition: {
          type: "unless",
          condition: {
            type: "have-character",
            classification: "Seven Dwarfs",
          },
        },
      },
    };
    expect(result.abilities[0].name).toBe("OH, GOSH!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ohGosh),
    );
  });

  it.skip("Christopher Robin - Adventurer: should parse card text", () => {
    const text =
      "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const wellAlwaysBeTogether: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WE'LL ALWAYS BE TOGETHER",
      trigger: {
        timing: "whenever",
        event: "ready",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "character-count",
          count: 2,
          comparison: "or-more",
        },
        effect: {
          type: "gain-lore",
          amount: 2,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("WE'LL ALWAYS BE TOGETHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wellAlwaysBeTogether),
    );
  });

  it.skip("Cinderella - Ballroom Sensation: should parse card text", () => {
    const text = "Singer 3 (This character counts as cost 3 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Doc - Leader of the Seven Dwarfs: should parse card text", () => {
    const text =
      "SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const shareAndShareAlike: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SHARE AND SHARE ALIKE",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
        reduction: { ink: 1 },
        target: "NEXT_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("SHARE AND SHARE ALIKE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shareAndShareAlike),
    );
  });

  it.skip("Dopey - Always Playful: should parse card text", () => {
    const text =
      "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const oddOneOut: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ODD ONE OUT",
      trigger: {
        timing: "when",
        event: "banish",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_OTHER_SEVEN_DWARFS_CHARACTERS",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].name).toBe("ODD ONE OUT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(oddOneOut),
    );
  });

  it.skip("Gaston - Baritone Bully: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const singer: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Singer",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Grand Duke - Advisor to the King: should parse card text", () => {
    const text =
      "YES, YOUR MAJESTY Your Prince, Princess, King, and Queen characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const yesYourMajesty: StaticAbilityDefinition = {
      type: "static",
      name: "YES, YOUR MAJESTY",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_PRINCE_PRINCESS_KING_QUEEN_CHARACTERS",
      },
    };
    expect(result.abilities[0].name).toBe("YES, YOUR MAJESTY");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(yesYourMajesty),
    );
  });

  it.skip("Grumpy - Bad-Tempered: should parse card text", () => {
    const text =
      "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theresTroubleABrewin: StaticAbilityDefinition = {
      type: "static",
      name: "THERE'S TROUBLE A-BREWIN'",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_OTHER_SEVEN_DWARFS_CHARACTERS",
      },
    };
    expect(result.abilities[0].name).toBe("THERE'S TROUBLE A-BREWIN'");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theresTroubleABrewin),
    );
  });

  it.skip("Happy - Good-Natured: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("King Louie - Jungle VIP: should parse card text", () => {
    const text =
      "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const layItOnTheLine: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LAY IT ON THE LINE",
      trigger: {
        timing: "whenever",
        event: "banish",
        on: "OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].name).toBe("LAY IT ON THE LINE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(layItOnTheLine),
    );
  });

  it.skip("Mickey Mouse - Friendly Face: should parse card text", () => {
    const text =
      "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const gladYoureHere: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GLAD YOU'RE HERE!",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
        reduction: { ink: 3 },
        target: "NEXT_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("GLAD YOU'RE HERE!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gladYoureHere),
    );
  });

  it.skip("Mufasa - Betrayed Leader: should parse card text", () => {
    const text =
      "THE SUN WILL SET When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theSunWillSet: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THE SUN WILL SET",
      trigger: {
        timing: "when",
        event: "banish",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "reveal-and-conditional",
          reveal: {
            source: "deck",
            count: 1,
          },
          condition: {
            type: "card-type",
            cardType: "character",
          },
          ifTrue: {
            type: "play-for-free",
            enterExerted: true,
          },
          ifFalse: {
            type: "put-on-deck",
            position: "top",
          },
        },
      },
    };
    expect(result.abilities[0].name).toBe("THE SUN WILL SET");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theSunWillSet),
    );
  });

  it.skip("Mulan - Reflecting: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Mulan.)\nHONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: HONOR TO THE ANCESTORS
    const honorToTheAncestors: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HONOR TO THE ANCESTORS",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "reveal-and-conditional",
          reveal: {
            source: "deck",
            count: 1,
          },
          condition: {
            type: "card-type",
            cardType: "song",
          },
          ifTrue: {
            type: "play-for-free",
          },
          ifFalse: {
            type: "put-on-deck",
            position: "top",
          },
        },
      },
    };
    expect(result.abilities[1].name).toBe("HONOR TO THE ANCESTORS");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(honorToTheAncestors),
    );
  });

  it.skip("Nana - Darling Family Pet: should parse card text", () => {
    const text =
      "NURSEMAID Whenever you play a Floodborn character, you may remove all damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const nursemaid: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NURSEMAID",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "FLOODBORN_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: "all",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("NURSEMAID");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nursemaid),
    );
  });

  it.skip("Rapunzel - Gifted Artist: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Rapunzel.)\nLET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: LET YOUR POWER SHINE
    const letYourPowerShine: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LET YOUR POWER SHINE",
      trigger: {
        timing: "whenever",
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("LET YOUR POWER SHINE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(letYourPowerShine),
    );
  });

  it.skip("Sleepy - Nodding Off: should parse card text", () => {
    const text = "YAWN! This character enters play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const yawn: StaticAbilityDefinition = {
      type: "static",
      name: "YAWN!",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("YAWN!");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(yawn));
  });

  it.skip("Sneezy - Very Allergic: should parse card text", () => {
    const text =
      "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ahChoo: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "AH-CHOO!",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "SELF_OR_SEVEN_DWARFS_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: -1,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
    };
    expect(result.abilities[0].name).toBe("AH-CHOO!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ahChoo),
    );
  });

  it.skip("Snow White - Lost in the Forest: should parse card text", () => {
    const text =
      "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iWontHurtYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I WON'T HURT YOU",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("I WON'T HURT YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iWontHurtYou),
    );
  });

  it.skip("Snow White - Unexpected Houseguest: should parse card text", () => {
    const text =
      "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const howDoYouDo: StaticAbilityDefinition = {
      type: "static",
      name: "HOW DO YOU DO?",
      effect: {
        type: "cost-reduction",
        reduction: { ink: 1 },
        target: "SEVEN_DWARFS_CHARACTERS",
      },
    };
    expect(result.abilities[0].name).toBe("HOW DO YOU DO?");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(howDoYouDo),
    );
  });

  it.skip("Snow White - Well Wisher: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Snow White.)\nWISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: WISHES COME TRUE
    const wishesComeTrue: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WISHES COME TRUE",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHARACTER_FROM_DISCARD",
        },
      },
    };
    expect(result.abilities[1].name).toBe("WISHES COME TRUE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(wishesComeTrue),
    );
  });

  it.skip("The Queen - Commanding Presence: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)\nWHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: WHO IS THE FAIREST?
    const whoIsTheFairest: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHO IS THE FAIREST?",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -4,
            target: "CHOSEN_OPPOSING_CHARACTER",
            duration: "this-turn",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 4,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[1].name).toBe("WHO IS THE FAIREST?");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whoIsTheFairest),
    );
  });

  it.skip("Hold Still: should parse card text", () => {
    const text = "Remove up to 4 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const holdStill: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 4,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(holdStill),
    );
  });

  it.skip("Last Stand: should parse card text", () => {
    const text = "Banish chosen character who was challenged this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lastStand: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_CHALLENGED_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lastStand),
    );
  });

  it.skip("Painting the Roses Red: should parse card text", () => {
    const text = "Up to 2 chosen characters get -1 {S} this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const paintingTheRosesRed: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -1,
            target: "UP_TO_2_CHOSEN_CHARACTERS",
            duration: "this-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(paintingTheRosesRed),
    );
  });

  it.skip("Zero to Hero: should parse card text", () => {
    const text =
      "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const zeroToHero: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "cost-reduction",
        reduction: { ink: "CHARACTER_COUNT" },
        target: "NEXT_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(zeroToHero),
    );
  });

  it.skip("Dragon Gem: should parse card text", () => {
    const text =
      "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bringBackToLife: ActivatedAbilityDefinition = {
      type: "activated",
      name: "BRING BACK TO LIFE",
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        type: "return-to-hand",
        target: "SUPPORT_CHARACTER_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].name).toBe("BRING BACK TO LIFE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bringBackToLife),
    );
  });

  it.skip("Sleepy's Flute: should parse card text", () => {
    const text =
      "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aSillySong: ActivatedAbilityDefinition = {
      type: "activated",
      name: "A SILLY SONG",
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "played-this-turn",
          cardType: "song",
        },
        effect: {
          type: "gain-lore",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("A SILLY SONG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aSillySong),
    );
  });

  it.skip("Arthur - Wizard's Apprentice: should parse card text", () => {
    const text =
      "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const student: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STUDENT",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "cost-effect",
          cost: {
            type: "return-to-hand",
            target: "YOUR_OTHER_CHARACTER",
          },
          effect: {
            type: "gain-lore",
            amount: 2,
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[0].name).toBe("STUDENT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(student),
    );
  });

  it.skip("Blue Fairy - Rewarding Good Deeds: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: ETHEREAL GLOW
    const etherealGlow: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ETHEREAL GLOW",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "FLOODBORN_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("ETHEREAL GLOW");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(etherealGlow),
    );
  });

  it.skip("Dr. Facilier - Savvy Opportunist: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Fairy Godmother - Mystic Armorer: should parse card text", () => {
    const text = `Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)
FORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +3 {S} while challenging.)`;
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: FORGET THE COACH, HERE'S A SWORD
    const forgetTheCoach: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FORGET THE COACH, HERE'S A SWORD",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 3,
            target: "YOUR_CHARACTERS",
            duration: "this-turn",
          },
          {
            type: "gain-ability",
            ability: {
              type: "triggered",
              trigger: {
                event: "banish-in-challenge",
              },
              effect: {
                type: "return-to-hand",
                target: "SELF",
              },
            },
            target: "YOUR_CHARACTERS",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[1].name).toBe("FORGET THE COACH, HERE'S A SWORD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(forgetTheCoach),
    );
  });

  it.skip("Fairy Godmother - Pure Heart: should parse card text", () => {
    const text =
      "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const justLeaveItToMe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "JUST LEAVE IT TO ME",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "CINDERELLA_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("JUST LEAVE IT TO ME");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(justLeaveItToMe),
    );
  });

  it.skip("HeiHei - Persistent Presence: should parse card text", () => {
    const text =
      "HE'S BACK! When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hesBack: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HE'S BACK!",
      trigger: {
        timing: "when",
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("HE'S BACK!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hesBack),
    );
  });

  it.skip("Jiminy Cricket - Pinocchio's Conscience: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nTHAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: THAT STILL, SMALL VOICE
    const thatStillSmallVoice: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THAT STILL, SMALL VOICE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "have-character",
          name: "Pinocchio",
        },
        effect: {
          type: "optional",
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[1].name).toBe("THAT STILL, SMALL VOICE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thatStillSmallVoice),
    );
  });

  it.skip("Madam Mim - Fox: should parse card text", () => {
    const text =
      "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.\nRush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CHASING THE RABBIT
    const chasingTheRabbit: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CHASING THE RABBIT",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "choice",
        choices: [
          {
            type: "banish",
            target: "SELF",
          },
          {
            type: "return-to-hand",
            target: "YOUR_OTHER_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].name).toBe("CHASING THE RABBIT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(chasingTheRabbit),
    );

    // Second ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Madam Mim - Purple Dragon: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nI WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: I WIN, I WIN!
    const iWinIWin: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I WIN, I WIN!",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "choice",
        choices: [
          {
            type: "banish",
            target: "SELF",
          },
          {
            type: "return-to-hand",
            target: "YOUR_OTHER_2_CHARACTERS",
          },
        ],
      },
    };
    expect(result.abilities[1].name).toBe("I WIN, I WIN!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iWinIWin),
    );
  });

  it.skip("Madam Mim - Rival of Merlin: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Madam Mim.)\nGRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: GRUESOME AND GRIM
    const gruesomeAndGrim: ActivatedAbilityDefinition = {
      type: "activated",
      name: "GRUESOME AND GRIM",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "play-for-free",
            filter: {
              cardType: "character",
              maxCost: 4,
            },
          },
          {
            type: "gain-keyword",
            keyword: "Rush",
            target: "PLAYED_CARD",
          },
          {
            type: "delayed",
            timing: "end-of-turn",
            effect: {
              type: "banish",
              target: "PLAYED_CARD",
            },
          },
        ],
      },
    };
    expect(result.abilities[1].name).toBe("GRUESOME AND GRIM");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(gruesomeAndGrim),
    );
  });

  it.skip("Madam Mim - Snake: should parse card text", () => {
    const text =
      "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const justYouWait: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "JUST YOU WAIT",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "choice",
        choices: [
          {
            type: "banish",
            target: "SELF",
          },
          {
            type: "return-to-hand",
            target: "YOUR_OTHER_CHARACTER",
          },
        ],
      },
    };
    expect(result.abilities[0].name).toBe("JUST YOU WAIT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(justYouWait),
    );
  });

  it.skip("Merlin - Crab: should parse card text", () => {
    const text =
      "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const readyOrNot: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "READY OR NOT!",
      trigger: {
        timing: "when",
        events: ["play", "leave-play"],
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 3,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].name).toBe("READY OR NOT!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(readyOrNot),
    );
  });

  it.skip("Merlin - Goat: should parse card text", () => {
    const text =
      "HERE I COME! When you play this character and when he leaves play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hereICome: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HERE I COME!",
      trigger: {
        timing: "when",
        events: ["play", "leave-play"],
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].name).toBe("HERE I COME!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hereICome),
    );
  });

  it.skip("Merlin - Rabbit: should parse card text", () => {
    const text =
      "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hoppityHip: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HOPPITY HIP!",
      trigger: {
        timing: "when",
        events: ["play", "leave-play"],
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("HOPPITY HIP!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hoppityHip),
    );
  });

  it.skip("Merlin - Shapeshifter: should parse card text", () => {
    const text =
      "BATTLE OF WITS Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const battleOfWits: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BATTLE OF WITS",
      trigger: {
        timing: "whenever",
        event: "return-to-hand",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].name).toBe("BATTLE OF WITS");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(battleOfWits),
    );
  });

  it.skip("Merlin - Squirrel: should parse card text", () => {
    const text =
      "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lookBeforeYouLeap: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOOK BEFORE YOU LEAP",
      trigger: {
        timing: "when",
        events: ["play", "leave-play"],
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "look",
            source: "deck",
            position: "top",
            count: 1,
          },
          {
            type: "put-on-deck",
            position: "choice",
            options: ["top", "bottom"],
          },
        ],
      },
    };
    expect(result.abilities[0].name).toBe("LOOK BEFORE YOU LEAP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookBeforeYouLeap),
    );
  });

  it.skip("Pinocchio - On the Run: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pinocchio.)\nLISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: LISTEN TO YOUR CONSCIENCE
    const listenToYourConscience: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LISTEN TO YOUR CONSCIENCE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER_OR_ITEM_COST_3_OR_LESS",
        },
      },
    };
    expect(result.abilities[1].name).toBe("LISTEN TO YOUR CONSCIENCE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(listenToYourConscience),
    );
  });

  it.skip("Pinocchio - Talkative Puppet: should parse card text", () => {
    const text =
      "TELLING LIES When you play this character, you may exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tellingLies: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TELLING LIES",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("TELLING LIES");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tellingLies),
    );
  });

  it.skip("Yzma - Scary Beyond All Reason: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Yzma.)\nCRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: CRUEL IRONY
    const cruelIrony: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CRUEL IRONY",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "shuffle-into-deck",
            target: "CHOSEN_OTHER_CHARACTER",
          },
          {
            type: "draw",
            amount: 2,
            target: "THAT_PLAYER",
          },
        ],
      },
    };
    expect(result.abilities[1].name).toBe("CRUEL IRONY");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(cruelIrony),
    );
  });

  it.skip("Gruesome and Grim: should parse card text", () => {
    const text =
      "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const gruesomeAndGrim: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "play-for-free",
            filter: {
              cardType: "character",
              maxCost: 4,
            },
          },
          {
            type: "gain-keyword",
            keyword: "Rush",
            target: "PLAYED_CARD",
          },
          {
            type: "delayed",
            timing: "end-of-turn",
            effect: {
              type: "banish",
              target: "PLAYED_CARD",
            },
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gruesomeAndGrim),
    );
  });

  it.skip("Legend of the Sword in the Stone: should parse card text", () => {
    const text =
      "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const legendOfTheSword: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 3,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(legendOfTheSword),
    );
  });

  it.skip("Binding Contract: should parse card text", () => {
    const text =
      "FOR ALL ETERNITY {E}, {E} one of your characters — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const forAllEternity: ActivatedAbilityDefinition = {
      type: "activated",
      name: "FOR ALL ETERNITY",
      cost: {
        exert: true,
        exertCharacter: true,
      },
      effect: {
        type: "exert",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("FOR ALL ETERNITY");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(forAllEternity),
    );
  });

  it.skip("Croquet Mallet: should parse card text", () => {
    const text =
      "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hurtlingHedgehog: ActivatedAbilityDefinition = {
      type: "activated",
      name: "HURTLING HEDGEHOG",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].name).toBe("HURTLING HEDGEHOG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hurtlingHedgehog),
    );
  });

  it.skip("Perplexing Signposts: should parse card text", () => {
    const text =
      "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const toWonderland: ActivatedAbilityDefinition = {
      type: "activated",
      name: "TO WONDERLAND",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "return-to-hand",
        target: "YOUR_CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("TO WONDERLAND");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(toWonderland),
    );
  });

  it.skip("The Sorcerer's Spellbook: should parse card text", () => {
    const text = "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const knowledge: ActivatedAbilityDefinition = {
      type: "activated",
      name: "KNOWLEDGE",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].name).toBe("KNOWLEDGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(knowledge),
    );
  });

  it.skip("Beast - Relentless: should parse card text", () => {
    const text =
      "SECOND WIND Whenever an opposing character is damaged, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const secondWind: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SECOND WIND",
      trigger: {
        timing: "whenever",
        event: "damage",
        on: "OPPOSING_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].name).toBe("SECOND WIND");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(secondWind),
    );
  });

  it.skip("Belle - Bookworm: should parse card text", () => {
    const text =
      "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const useYourImagination: StaticAbilityDefinition = {
      type: "static",
      name: "USE YOUR IMAGINATION",
      condition: {
        type: "hand-count",
        controller: "opponent",
        count: 0,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("USE YOUR IMAGINATION");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(useYourImagination),
    );
  });

  it.skip("Belle - Hidden Archer: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nTHORNY ARROWS Whenever this character is challenged, the challenging character's player discards all cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: THORNY ARROWS
    const thornyArrows: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THORNY ARROWS",
      trigger: {
        timing: "whenever",
        event: "challenge",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: "all",
        target: "CHALLENGER_OWNER",
      },
    };
    expect(result.abilities[1].name).toBe("THORNY ARROWS");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thornyArrows),
    );
  });

  it.skip("Bucky - Squirrel Squeak Tutor: should parse card text", () => {
    const text =
      "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const squeak: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SQUEAK",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "FLOODBORN_CHARACTERS",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "used-shift",
        },
        effect: {
          type: "discard",
          amount: 1,
          target: "EACH_OPPONENT",
          chosenBy: "TARGET",
        },
      },
    };
    expect(result.abilities[0].name).toBe("SQUEAK");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(squeak),
    );
  });

  it.skip("Cheshire Cat - From the Shadows: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)\nEvasive (Only characters with Evasive can challenge this character.)\nWICKED SMILE {E} — Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: WICKED SMILE
    const wickedSmile: ActivatedAbilityDefinition = {
      type: "activated",
      name: "WICKED SMILE",
      cost: {
        exert: true,
      },
      effect: {
        type: "banish",
        target: "CHOSEN_DAMAGED_CHARACTER",
      },
    };
    expect(result.abilities[2].name).toBe("WICKED SMILE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(wickedSmile),
    );
  });

  it.skip("Dr. Facilier - Fortune Teller: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nYOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: YOU'RE IN MY WORLD
    const youreInMyWorld: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU'RE IN MY WORLD",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "next-turn",
      },
    };
    expect(result.abilities[1].name).toBe("YOU'RE IN MY WORLD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(youreInMyWorld),
    );
  });

  it.skip("Flynn Rider - His Own Biggest Fan: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)\nEvasive (Only characters with Evasive can challenge this character.)\nONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: ONE LAST, BIG SCORE
    const oneLastBigScore: StaticAbilityDefinition = {
      type: "static",
      name: "ONE LAST, BIG SCORE",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "for-each",
          count: {
            type: "cards-in-hand",
            controller: "opponents",
          },
          modifier: -1,
        },
        target: "SELF",
      },
    };
    expect(result.abilities[2].name).toBe("ONE LAST, BIG SCORE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(oneLastBigScore),
    );
  });

  it.skip("Gaston - Scheming Suitor: should parse card text", () => {
    const text =
      "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const yesImIntimidating: StaticAbilityDefinition = {
      type: "static",
      name: "YES, I'M INTIMIDATING",
      condition: {
        type: "hand-count",
        controller: "opponents",
        count: 0,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("YES, I'M INTIMIDATING");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(yesImIntimidating),
    );
  });

  it.skip("Lucifer - Cunning Cat: should parse card text", () => {
    const text =
      "MOUSE CATCHER When you play this character, each opponent chooses and discards either 2 cards or 1 action card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const mouseCatcher: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MOUSE CATCHER",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "for-each-opponent",
        effect: {
          type: "choice",
          chosenBy: "TARGET",
          choices: [
            {
              type: "discard",
              amount: 2,
            },
            {
              type: "discard",
              amount: 1,
              filter: {
                cardType: "action",
              },
            },
          ],
        },
      },
    };
    expect(result.abilities[0].name).toBe("MOUSE CATCHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mouseCatcher),
    );
  });

  it.skip("Pain - Underworld Imp: should parse card text", () => {
    const text =
      "COMING, YOUR MOST LUGUBRIOUSNESS While this character has 5 {S} or more, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const comingYourMostLugubriousness: StaticAbilityDefinition = {
      type: "static",
      name: "COMING, YOUR MOST LUGUBRIOUSNESS",
      condition: {
        type: "stat-threshold",
        stat: "strength",
        value: 5,
        comparison: "or-more",
        target: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("COMING, YOUR MOST LUGUBRIOUSNESS");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(comingYourMostLugubriousness),
    );
  });

  it.skip("Panic - Underworld Imp: should parse card text", () => {
    const text =
      "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iCanHandleIt: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I CAN HANDLE IT",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "name",
          name: "Pain",
          target: "CHOSEN_CHARACTER",
        },
        ifTrue: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
        ifFalse: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
    };
    expect(result.abilities[0].name).toBe("I CAN HANDLE IT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iCanHandleIt),
    );
  });

  it.skip("Pete - Bad Guy: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nTAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.\nWHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: TAKE THAT!
    const takeThat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TAKE THAT!",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_ACTIONS",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
    };
    expect(result.abilities[1].name).toBe("TAKE THAT!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(takeThat),
    );

    // Third ability: WHO'S NEXT?
    const whosNext: StaticAbilityDefinition = {
      type: "static",
      name: "WHO'S NEXT?",
      condition: {
        type: "stat-threshold",
        stat: "strength",
        value: 7,
        comparison: "or-more",
        target: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[2].name).toBe("WHO'S NEXT?");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(whosNext),
    );
  });

  it.skip("Prince John - Greediest of All: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nI SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: I SENTENCE YOU
    const iSentenceYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I SENTENCE YOU",
      trigger: {
        timing: "whenever",
        event: "discard",
        on: "OPPONENT",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: "DISCARDED_COUNT",
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("I SENTENCE YOU");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iSentenceYou),
    );
  });

  it.skip("Queen of Hearts - Quick-Tempered: should parse card text", () => {
    const text =
      "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const royalRage: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ROYAL RAGE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "CHOSEN_DAMAGED_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("ROYAL RAGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royalRage),
    );
  });

  it.skip("Ratigan - Criminal Mastermind: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Ray - Easygoing Firefly: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("The Queen - Disguised Peddler: should parse card text", () => {
    const text =
      "A PERFECT DISGUISE {E}, Choose and discard a character card — Gain lore equal to the discarded character's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aPerfectDisguise: ActivatedAbilityDefinition = {
      type: "activated",
      name: "A PERFECT DISGUISE",
      cost: {
        exert: true,
        discard: {
          cardType: "character",
          amount: 1,
        },
      },
      effect: {
        type: "gain-lore",
        amount: "DISCARDED_CARD_LORE",
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].name).toBe("A PERFECT DISGUISE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aPerfectDisguise),
    );
  });

  it.skip("Bibbidi Bobbidi Boo: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand to play another character with the same cost or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bibbidiBobbidiBoo: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "cost-effect",
        cost: {
          type: "return-to-hand",
          target: "YOUR_CHOSEN_CHARACTER",
        },
        effect: {
          type: "play-for-free",
          filter: {
            cardType: "character",
            maxCost: "RETURNED_CARD_COST",
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bibbidiBobbidiBoo),
    );
  });

  it.skip("Bounce: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand to return another chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bounce: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "cost-effect",
        cost: {
          type: "return-to-hand",
          target: "YOUR_CHOSEN_CHARACTER",
        },
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_OTHER_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bounce),
    );
  });

  it.skip("Hypnotize: should parse card text", () => {
    const text = "Each opponent chooses and discards a card. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hypnotize: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "discard",
            amount: 1,
            target: "EACH_OPPONENT",
            chosenBy: "TARGET",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hypnotize),
    );
  });

  it.skip("Pack Tactics: should parse card text", () => {
    const text =
      "Gain 1 lore for each damaged character opponents have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const packTactics: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "gain-lore",
        amount: "OPPONENTS_DAMAGED_CHARACTER_COUNT",
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(packTactics),
    );
  });

  it.skip("Ring the Bell: should parse card text", () => {
    const text = "Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ringTheBell: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_DAMAGED_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ringTheBell),
    );
  });

  it.skip("Ratigan's Marvelous Trap: should parse card text", () => {
    const text =
      "SNAP! BOOM! TWANG! Banish this item — Each opponent loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const snapBoomTwang: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SNAP! BOOM! TWANG!",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "lose-lore",
        amount: 2,
        target: "EACH_OPPONENT",
      },
    };
    expect(result.abilities[0].name).toBe("SNAP! BOOM! TWANG!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(snapBoomTwang),
    );
  });

  it.skip("Donald Duck - Not Again!: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPHOOEY! This character gets +1 {L} for each 1 damage on him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: PHOOEY!
    const phooey: StaticAbilityDefinition = {
      type: "static",
      name: "PHOOEY!",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "for-each",
          count: "DAMAGE_ON_SELF",
          multiplier: 1,
        },
        target: "SELF",
      },
    };
    expect(result.abilities[1].name).toBe("PHOOEY!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(phooey),
    );
  });

  it.skip("Felicia - Always Hungry: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );
  });

  it.skip("Fidget - Ratigan's Henchman: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Honest John - Not That Honest: should parse card text", () => {
    const text =
      "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const easyStreet: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EASY STREET",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "FLOODBORN_CHARACTERS",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    };
    expect(result.abilities[0].name).toBe("EASY STREET");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(easyStreet),
    );
  });

  it.skip("Lady Tremaine - Imperious Queen: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)\nPOWER TO RULE AT LAST When you play this character, each opponent chooses and banishes one of their characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: POWER TO RULE AT LAST
    const powerToRuleAtLast: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "POWER TO RULE AT LAST",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "for-each-opponent",
        effect: {
          type: "banish",
          target: "THEIR_CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("POWER TO RULE AT LAST");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(powerToRuleAtLast),
    );
  });

  it.skip("Lady Tremaine - Overbearing Matriarch: should parse card text", () => {
    const text =
      "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const notForYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NOT FOR YOU",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "for-each-opponent",
        condition: {
          type: "lore-comparison",
          comparison: "more-than",
          compareTo: "you",
        },
        effect: {
          type: "lose-lore",
          amount: 1,
        },
      },
    };
    expect(result.abilities[0].name).toBe("NOT FOR YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(notForYou),
    );
  });

  it.skip("Minnie Mouse - Stylish Surfer: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Minnie Mouse - Wide-Eyed Diver: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Minnie Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nUNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Evasive",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: UNDERSEA ADVENTURE
    const underseaAdventure: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "UNDERSEA ADVENTURE",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_ACTIONS",
        condition: {
          type: "second-in-turn",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
    };
    expect(result.abilities[2].name).toBe("UNDERSEA ADVENTURE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(underseaAdventure),
    );
  });

  it.skip("Mother Gothel - Withered and Wicked: should parse card text", () => {
    const text =
      "WHAT HAVE YOU DONE?! This character enters play with 3 damage.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const whatHaveYouDone: StaticAbilityDefinition = {
      type: "static",
      name: "WHAT HAVE YOU DONE?!",
      effect: {
        type: "enters-play-with",
        damage: 3,
      },
    };
    expect(result.abilities[0].name).toBe("WHAT HAVE YOU DONE?!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatHaveYouDone),
    );
  });

  it.skip("Mulan - Soldier in Training: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Namaari - Nemesis: should parse card text", () => {
    const text =
      "THIS SHOULDN'T TAKE LONG {E}, Banish this character — Banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thisShouldntTakeLong: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THIS SHOULDN'T TAKE LONG",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("THIS SHOULDN'T TAKE LONG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisShouldntTakeLong),
    );
  });

  it.skip("Ratigan - Very Large Mouse: should parse card text", () => {
    const text =
      "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thisIsMyKingdom: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THIS IS MY KINGDOM",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "exert",
            target: "CHOSEN_OPPOSING_CHARACTER_3_STRENGTH_OR_LESS",
          },
          {
            type: "ready",
            target: "YOUR_CHOSEN_CHARACTER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].name).toBe("THIS IS MY KINGDOM");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisIsMyKingdom),
    );
  });

  it.skip("Raya - Leader of Heart: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Raya.)\nCHAMPION OF KUMANDRA Whenever this character challenges a damaged character, she takes no damage from the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: CHAMPION OF KUMANDRA
    const championOfKumandra: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CHAMPION OF KUMANDRA",
      trigger: {
        timing: "whenever",
        event: "challenge",
        on: "SELF",
        condition: {
          type: "target-is-damaged",
        },
      },
      effect: {
        type: "prevent-damage",
        target: "SELF",
        source: "CHALLENGE",
      },
    };
    expect(result.abilities[1].name).toBe("CHAMPION OF KUMANDRA");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(championOfKumandra),
    );
  });

  it.skip("Scar - Vicious Cheater: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nDADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Rush",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: DADDY ISN'T HERE TO SAVE YOU
    const daddyIsntHereToSaveYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DADDY ISN'T HERE TO SAVE YOU",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "ready",
              target: "SELF",
            },
            {
              type: "restriction",
              restriction: "cant-quest",
              target: "SELF",
              duration: "this-turn",
            },
          ],
        },
      },
    };
    expect(result.abilities[1].name).toBe("DADDY ISN'T HERE TO SAVE YOU");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(daddyIsntHereToSaveYou),
    );
  });

  it.skip("Tigger - One of a Kind: should parse card text", () => {
    const text =
      "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const energetic: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ENERGETIC",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_ACTIONS",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].name).toBe("ENERGETIC");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(energetic),
    );
  });

  it.skip("Tuk Tuk - Wrecking Ball: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const reckless: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Reckless",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );
  });

  it.skip("Go the Distance: should parse card text", () => {
    const text =
      "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const goTheDistance: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "ready",
            target: "YOUR_CHOSEN_DAMAGED_CHARACTER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(goTheDistance),
    );
  });

  it.skip("Teeth and Ambitions: should parse card text", () => {
    const text =
      "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const teethAndAmbitions: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "cost-effect",
        cost: {
          type: "deal-damage",
          amount: 2,
          target: "YOUR_CHOSEN_CHARACTER",
        },
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_OTHER_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(teethAndAmbitions),
    );
  });

  it.skip("The Most Diabolical Scheme: should parse card text", () => {
    const text = "Banish chosen Villain of yours to banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theMostDiabolicalScheme: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "cost-effect",
        cost: {
          type: "banish",
          target: "YOUR_CHOSEN_VILLAIN",
        },
        effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theMostDiabolicalScheme),
    );
  });

  it.skip("What Did You Call Me?: should parse card text", () => {
    const text = "Chosen damaged character gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const whatDidYouCallMe: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "CHOSEN_DAMAGED_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatDidYouCallMe),
    );
  });

  it.skip("Peter Pan's Dagger: should parse card text", () => {
    const text = "Your characters with Evasive get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const peterPansDagger: StaticAbilityDefinition = {
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_EVASIVE_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(peterPansDagger),
    );
  });

  it.skip("Sword in the Stone: should parse card text", () => {
    const text =
      "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const swordInTheStone: ActivatedAbilityDefinition = {
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: {
          type: "for-each",
          count: "DAMAGE_ON_TARGET",
          multiplier: 1,
        },
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(swordInTheStone),
    );
  });

  it.skip("Basil - Great Mouse Detective: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Basil.)\nTHERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: THERE'S ALWAYS A CHANCE
    const theresAlwaysAChance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THERE'S ALWAYS A CHANCE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("THERE'S ALWAYS A CHANCE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(theresAlwaysAChance),
    );
  });

  it.skip("Basil - Of Baker Street: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Cogsworth - Grandfather Clock: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)\nWard (Opponents can't choose this character except to challenge.)\nUNWIND Your other characters gain Resist +1 (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Ward
    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));

    // Third ability: UNWIND
    const unwind: StaticAbilityDefinition = {
      type: "static",
      name: "UNWIND",
      effect: {
        type: "grant-keyword",
        keyword: "Resist",
        value: 1,
        target: "YOUR_OTHER_CHARACTERS",
      },
    };
    expect(result.abilities[2].name).toBe("UNWIND");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(unwind),
    );
  });

  it.skip("Cogsworth - Talking Clock: should parse card text", () => {
    const text = `WAIT A MINUTE Your characters with Reckless gain "{E} — Gain 1 lore."`;
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const waitAMinute: StaticAbilityDefinition = {
      type: "static",
      name: "WAIT A MINUTE",
      effect: {
        type: "grant-ability",
        ability: {
          type: "activated",
          cost: {
            exert: true,
          },
          effect: {
            type: "gain-lore",
            amount: 1,
            target: "CONTROLLER",
          },
        },
        target: "YOUR_RECKLESS_CHARACTERS",
      },
    };
    expect(result.abilities[0].name).toBe("WAIT A MINUTE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(waitAMinute),
    );
  });

  it.skip("Cruella De Vil - Perfectly Wretched: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cruella De Vil.)\nOH, NO YOU DON'T Whenever this character quests, chosen opposing character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: OH, NO YOU DON'T
    const ohNoYouDont: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OH, NO YOU DON'T",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[1].name).toBe("OH, NO YOU DON'T");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ohNoYouDont),
    );
  });

  it.skip("Duke Weaselton - Small-Time Crook: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Gaston - Intellectual Powerhouse: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gaston.)\nDEVELOPED BRAIN When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: DEVELOPED BRAIN
    const developedBrain: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DEVELOPED BRAIN",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "look",
            source: "deck",
            position: "top",
            count: 3,
          },
          {
            type: "optional",
            effect: {
              type: "put-into-hand",
              count: 1,
            },
          },
          {
            type: "put-on-deck",
            position: "bottom",
            order: "any",
          },
        ],
      },
    };
    expect(result.abilities[1].name).toBe("DEVELOPED BRAIN");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(developedBrain),
    );
  });

  it.skip("Hiram Flaversham - Toymaker: should parse card text", () => {
    const text =
      "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const artificer: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ARTIFICER",
      trigger: {
        timing: "when-or-whenever",
        events: [
          { event: "play", on: "SELF" },
          { event: "quest", on: "SELF" },
        ],
      },
      effect: {
        type: "optional",
        effect: {
          type: "cost-effect",
          cost: {
            type: "banish",
            target: "YOUR_ITEM",
          },
          effect: {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[0].name).toBe("ARTIFICER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(artificer),
    );
  });

  it.skip("James - Role Model: should parse card text", () => {
    const text =
      "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const neverEverLoseSight: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NEVER, EVER LOSE SIGHT",
      trigger: {
        timing: "when",
        event: "banish",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          target: "SELF",
          exerted: true,
        },
      },
    };
    expect(result.abilities[0].name).toBe("NEVER, EVER LOSE SIGHT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(neverEverLoseSight),
    );
  });

  it.skip("Mrs. Judson - Housekeeper: should parse card text", () => {
    const text =
      "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tidyUp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TIDY UP",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "FLOODBORN_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "deck",
          position: "top",
          exerted: true,
        },
      },
    };
    expect(result.abilities[0].name).toBe("TIDY UP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tidyUp),
    );
  });

  it.skip("Nick Wilde - Wily Fox: should parse card text", () => {
    const text =
      "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const itsCalledAHustle: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IT'S CALLED A HUSTLE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "PAWPSICLE_ITEM",
          destination: "hand",
        },
      },
    };
    expect(result.abilities[0].name).toBe("IT'S CALLED A HUSTLE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(itsCalledAHustle),
    );
  });

  it.skip("Noi - Orphaned Thief: should parse card text", () => {
    const text =
      "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward. (Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hideAndSeek: StaticAbilityDefinition = {
      type: "static",
      name: "HIDE AND SEEK",
      condition: {
        type: "have-card",
        cardType: "item",
        controller: "you",
      },
      effect: {
        type: "gain-keywords",
        keywords: [{ keyword: "Resist", value: 1 }, { keyword: "Ward" }],
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("HIDE AND SEEK");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hideAndSeek),
    );
  });

  it.skip("Sisu - Divine Water Dragon: should parse card text", () => {
    const text =
      "I TRUST YOU Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iTrustYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I TRUST YOU",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "look",
            source: "deck",
            position: "top",
            count: 2,
          },
          {
            type: "optional",
            effect: {
              type: "put-into-hand",
              count: 1,
            },
          },
          {
            type: "put-on-deck",
            position: "bottom",
            order: "any",
          },
        ],
      },
    };
    expect(result.abilities[0].name).toBe("I TRUST YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iTrustYou),
    );
  });

  it.skip("The Nokk - Water Spirit: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ward: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Ward",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Falling Down the Rabbit Hole: should parse card text", () => {
    const text =
      "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fallingDownTheRabbitHole: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "for-each-player",
        effect: {
          type: "put-into-inkwell",
          target: "THEIR_CHOSEN_CHARACTER",
          chosenBy: "TARGET",
          exerted: true,
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fallingDownTheRabbitHole),
    );
  });

  it.skip("Launch: should parse card text", () => {
    const text =
      "Banish chosen item of yours to deal 5 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const launch: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "cost-effect",
        cost: {
          type: "banish",
          target: "YOUR_CHOSEN_ITEM",
        },
        effect: {
          type: "deal-damage",
          amount: 5,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(launch),
    );
  });

  it.skip("Nothing to Hide: should parse card text", () => {
    const text = "Each opponent reveals their hand. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const nothingToHide: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "reveal-hand",
            target: "EACH_OPPONENT",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nothingToHide),
    );
  });

  it.skip("Fang Crossbow: should parse card text", () => {
    const text =
      "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.\nSTAY BACK! {E}, Banish this item — Banish chosen Dragon character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CAREFUL AIM
    const carefulAim: ActivatedAbilityDefinition = {
      type: "activated",
      name: "CAREFUL AIM",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].name).toBe("CAREFUL AIM");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(carefulAim),
    );

    // Second ability: STAY BACK!
    const stayBack: ActivatedAbilityDefinition = {
      type: "activated",
      name: "STAY BACK!",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "banish",
        target: "CHOSEN_DRAGON_CHARACTER",
      },
    };
    expect(result.abilities[1].name).toBe("STAY BACK!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stayBack),
    );
  });

  it.skip("Gumbo Pot: should parse card text", () => {
    const text =
      "THE BEST I'VE EVER TASTED {E} — Remove 1 damage each from up to 2 chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theBestIveEverTasted: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THE BEST I'VE EVER TASTED",
      cost: {
        exert: true,
      },
      effect: {
        type: "remove-damage",
        amount: 1,
        target: "UP_TO_2_CHOSEN_CHARACTERS",
      },
    };
    expect(result.abilities[0].name).toBe("THE BEST I'VE EVER TASTED");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theBestIveEverTasted),
    );
  });

  it.skip("Maurice's Workshop: should parse card text", () => {
    const text =
      "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lookingForThis: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOOKING FOR THIS?",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_OTHER_ITEMS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "cost-effect",
          cost: {
            ink: 1,
          },
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[0].name).toBe("LOOKING FOR THIS?");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookingForThis),
    );
  });

  it.skip("Pawpsicle: should parse card text", () => {
    const text =
      "JUMBO POP When you play this item, you may draw a card.\nTHAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: JUMBO POP
    const jumboPop: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "JUMBO POP",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("JUMBO POP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(jumboPop),
    );

    // Second ability: THAT'S REDWOOD
    const thatsRedwood: ActivatedAbilityDefinition = {
      type: "activated",
      name: "THAT'S REDWOOD",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].name).toBe("THAT'S REDWOOD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thatsRedwood),
    );
  });

  it.skip("Sardine Can: should parse card text", () => {
    const text =
      "FLIGHT CABIN Your exerted characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const flightCabin: StaticAbilityDefinition = {
      type: "static",
      name: "FLIGHT CABIN",
      effect: {
        type: "grant-keyword",
        keyword: "Ward",
        target: "YOUR_EXERTED_CHARACTERS",
      },
    };
    expect(result.abilities[0].name).toBe("FLIGHT CABIN");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(flightCabin),
    );
  });

  it.skip("Beast - Forbidding Recluse: should parse card text", () => {
    const text =
      "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const youreNotWelcomeHere: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU'RE NOT WELCOME HERE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("YOU'RE NOT WELCOME HERE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youreNotWelcomeHere),
    );
  });

  it.skip("Beast - Selfless Protector: should parse card text", () => {
    const text =
      "SHIELD ANOTHER Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const shieldAnother: StaticAbilityDefinition = {
      type: "static",
      name: "SHIELD ANOTHER",
      effect: {
        type: "replacement",
        replaces: "damage-to-character",
        condition: {
          target: "YOUR_OTHER_CHARACTERS",
        },
        replacement: {
          type: "redirect-damage",
          target: "SELF",
          amount: "ALL",
        },
      },
    };
    expect(result.abilities[0].name).toBe("SHIELD ANOTHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shieldAnother),
    );
  });

  it.skip("Beast - Tragic Hero: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Beast.)\nIT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: IT'S BETTER THIS WAY
    const itsBetterThisWay: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "IT'S BETTER THIS WAY",
      trigger: {
        timing: "at",
        event: "start-turn",
        on: "YOU",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "no-damage",
          target: "SELF",
        },
        ifTrue: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        ifFalse: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "SELF",
          duration: "this-turn",
        },
      },
    };
    expect(result.abilities[1].name).toBe("IT'S BETTER THIS WAY");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(itsBetterThisWay),
    );
  });

  it.skip("Chief Bogo - Respected Officer: should parse card text", () => {
    const text =
      "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const insubordination: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "INSUBORDINATION!",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "FLOODBORN_CHARACTERS",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "EACH_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("INSUBORDINATION!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(insubordination),
    );
  });

  it.skip("Cinderella - Knight in Training: should parse card text", () => {
    const text =
      "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const haveCourage: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HAVE COURAGE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              chosenBy: "you",
            },
          ],
        },
      },
    };
    expect(result.abilities[0].name).toBe("HAVE COURAGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(haveCourage),
    );
  });

  it.skip("Cinderella - Stouthearted: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cinderella.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nTHE SINGING SWORD Whenever you play a song, this character may challenge ready characters this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Resist +2
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 2,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );

    // Third ability: THE SINGING SWORD
    const theSingingSword: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THE SINGING SWORD",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_SONGS",
      },
      effect: {
        type: "grant-ability",
        ability: {
          type: "can-challenge-ready",
        },
        target: "SELF",
        duration: "this-turn",
      },
    };
    expect(result.abilities[2].name).toBe("THE SINGING SWORD");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(theSingingSword),
    );
  });

  it.skip("Hercules - Divine Hero: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Hercules.)\nResist +2 (Damage dealt to this character is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Resist +2
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 2,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );
  });

  it.skip("Jafar - Dreadnought: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jafar.)\nNOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: NOW WHERE WERE WE?
    const nowWhereWereWe: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NOW WHERE WERE WE?",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("NOW WHERE WERE WE?");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(nowWhereWereWe),
    );
  });

  it.skip("Kronk - Junior Chipmunk: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nSCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Resist +1
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist),
    );

    // Second ability: SCOUT LEADER
    const scoutLeader: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SCOUT LEADER",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("SCOUT LEADER");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(scoutLeader),
    );
  });

  it.skip("Li Shang - Archery Instructor: should parse card text", () => {
    const text =
      "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const archeryLesson: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ARCHERY LESSON",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "grant-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].name).toBe("ARCHERY LESSON");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(archeryLesson),
    );
  });

  it.skip("Magic Broom - Industrial Model: should parse card text", () => {
    const text =
      "MAKE IT SHINE When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const makeItShine: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "MAKE IT SHINE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "grant-keyword",
        keyword: "Resist",
        value: 1,
        target: "CHOSEN_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].name).toBe("MAKE IT SHINE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(makeItShine),
    );
  });

  it.skip("Namaari - Morning Mist: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBLADES This character can challenge ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: BLADES
    const blades: StaticAbilityDefinition = {
      type: "static",
      name: "BLADES",
      effect: {
        type: "challenge-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].name).toBe("BLADES");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(blades),
    );
  });

  it.skip("Queen of Hearts - Capricious Monarch: should parse card text", () => {
    const text =
      "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const offWithTheirHeads: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "OFF WITH THEIR HEADS!",
      trigger: {
        timing: "whenever",
        event: "banish",
        on: "OPPOSING_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].name).toBe("OFF WITH THEIR HEADS!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(offWithTheirHeads),
    );
  });

  it.skip("The Huntsman - Reluctant Enforcer: should parse card text", () => {
    const text =
      "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const changeOfHeart: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CHANGE OF HEART",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              chosenBy: "you",
            },
          ],
        },
      },
    };
    expect(result.abilities[0].name).toBe("CHANGE OF HEART");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(changeOfHeart),
    );
  });

  it.skip("The Prince - Never Gives Up: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: Resist +1
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );
  });

  it.skip("Tiana - Celebrating Princess: should parse card text", () => {
    const text =
      "Resist +2 (Damage dealt to this character is reduced by 2.)\nWHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Resist +2
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist),
    );

    // Second ability: WHAT YOU GIVE IS WHAT YOU GET
    const whatYouGive: StaticAbilityDefinition = {
      type: "static",
      name: "WHAT YOU GIVE IS WHAT YOU GET",
      condition: {
        type: "and",
        conditions: [
          { type: "exerted", target: "SELF" },
          { type: "hand-count", controller: "you", count: 0 },
        ],
      },
      effect: {
        type: "restriction",
        restriction: "cant-play-actions",
        target: "OPPONENTS",
      },
    };
    expect(result.abilities[1].name).toBe("WHAT YOU GIVE IS WHAT YOU GET");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whatYouGive),
    );
  });

  it.skip("Charge!: should parse card text", () => {
    const text =
      "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const charge: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "grant-keywords",
        keywords: [
          { keyword: "Challenger", value: 2 },
          { keyword: "Resist", value: 2 },
        ],
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(charge),
    );
  });

  it.skip("Let the Storm Rage On: should parse card text", () => {
    const text = "Deal 2 damage to chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const letTheStormRageOn: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(letTheStormRageOn),
    );
  });

  it.skip("Pick a Fight: should parse card text", () => {
    const text = "Chosen character can challenge ready characters this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const pickAFight: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "grant-ability",
        ability: {
          type: "can-challenge-ready",
        },
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pickAFight),
    );
  });

  it.skip("Last Cannon: should parse card text", () => {
    const text =
      "ARM YOURSELF 1 {I}, Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const armYourself: ActivatedAbilityDefinition = {
      type: "activated",
      name: "ARM YOURSELF",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "grant-keyword",
        keyword: "Challenger",
        value: 3,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].name).toBe("ARM YOURSELF");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(armYourself),
    );
  });

  it.skip("Mouse Armor: should parse card text", () => {
    const text =
      "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const protection: ActivatedAbilityDefinition = {
      type: "activated",
      name: "PROTECTION",
      cost: {
        exert: true,
      },
      effect: {
        type: "grant-keyword",
        keyword: "Resist",
        value: 1,
        target: "CHOSEN_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].name).toBe("PROTECTION");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(protection),
    );
  });

  it.skip("Weight Set: should parse card text", () => {
    const text =
      "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const training: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TRAINING",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_CHARACTERS_COST_4_OR_MORE",
      },
      effect: {
        type: "optional",
        effect: {
          type: "cost-effect",
          cost: {
            ink: 1,
          },
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[0].name).toBe("TRAINING");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(training),
    );
  });
});

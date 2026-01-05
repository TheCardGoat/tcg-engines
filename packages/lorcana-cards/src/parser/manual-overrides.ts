/**
 * Manual Overrides for Complex Card Texts
 *
 * Some card texts are too complex to parse generically. This module provides
 * a way to manually define the JSON representation for such texts.
 *
 * Cards can have multiple abilities, so entries can be either:
 * - A single AbilityWithText object
 * - An array of AbilityWithText objects (for multi-ability cards)
 *
 * ## Implementation Status
 *
 * Many complex abilities use effect types not yet implemented in the engine.
 * These entries document the intended structure for future implementation.
 * As the engine type system evolves, these can be properly typed.
 *
 * ## Type Safety Note
 *
 * The entries use runtime objects that bypass TypeScript's strict checking
 * to allow documenting ability structures before the corresponding types exist.
 * This is intentional - the structures serve as specifications for future
 * type system extensions.
 */

import { extractNumericValues } from "./numeric-extractor";
import type { AbilityWithText } from "./types";

/**
 * Entry type for manual overrides - can be single or multiple abilities
 */
export type ManualEntry = AbilityWithText | AbilityWithText[];

// We use a helper that bypasses type checking since many effect types
// documented here are not yet implemented in the engine type system.
// This allows us to specify the intended structure as documentation.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UntypedAbilityWithText = { text: string; name?: string; ability: any };

/**
 * Create a manual entry (bypasses type checking for unimplemented effect types)
 */
function manualEntry(raw: UntypedAbilityWithText): AbilityWithText {
  return raw as AbilityWithText;
}

/**
 * Create multiple manual entries
 */
function manualEntries(raws: UntypedAbilityWithText[]): AbilityWithText[] {
  return raws as AbilityWithText[];
}

/**
 * Manual entries for complex card texts
 *
 * Maps exact normalized text strings to their manual JSON representations.
 * These texts bypass the generic parser and use the provided structure directly.
 */
export const MANUAL_ENTRIES: Record<string, ManualEntry> = {
  // ============================================================================
  // ============================================================================
  // MANUALLY RESTORED CARDS
  // ============================================================================

  // Hakuna Matata
  "Remove up to {d} damage from each of your characters.": manualEntry({
    text: "Remove up to 3 damage from each of your characters.",
    name: "Hakuna Matata",
    ability: {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        target: { selector: "all", controller: "you", cardType: "character" },
        upTo: true,
      },
    },
  }),

  // Be Our Guest
  "Look at the top {d} cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.":
    manualEntry({
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "Be Our Guest",
      ability: {
        type: "action",
        effect: {
          type: "look-at-cards",
          amount: 4,
          from: "top-of-deck",
          target: "CONTROLLER",
          then: {
            action: "put-in-hand",
            filter: { type: "card-type", cardType: "character" },
            reveal: true,
          },
        },
      },
    }),

  // ============================================================================
  // TOP 100 COMPLEX TEXTS - Manually Implemented
  // ============================================================================

  // #1 - Score: 11.0 - Two abilities: cost reduction + triggered discard
  "YOU LOOK REGAL If you have a character named Prince John in play, you pay {d} {I} less to play this item. A FEELING OF POWER At the end of each opponent's turn, if they have more than {d} cards in their hand, they discard until they have {d} cards in their hand.":
    manualEntries([
      {
        text: "YOU LOOK REGAL If you have a character named Prince John in play, you pay {d} {I} less to play this item.",
        name: "YOU LOOK REGAL",
        ability: {
          type: "static",
          effect: {
            type: "cost-reduction",
            amount: 0, // {d} placeholder
            cardType: "item",
          },
          condition: {
            type: "has-named-character",
            name: "Prince John",
            controller: "you",
          },
        },
      },
      {
        text: "A FEELING OF POWER At the end of each opponent's turn, if they have more than {d} cards in their hand, they discard until they have {d} cards in their hand.",
        name: "A FEELING OF POWER",
        ability: {
          type: "triggered",
          trigger: { event: "end-turn", timing: "at", on: "OPPONENT" },
          effect: {
            type: "discard",
            amount: 0, // Until hand size
            target: "OPPONENT",
            chosen: true,
          },
          condition: {
            type: "resource-count",
            what: "cards-in-hand",
            controller: "opponent",
            comparison: "greater-than",
            value: 0, // {d} placeholder
          },
        },
      },
    ]),

  // #2 - Score: 10.5 - Complex triggered: banish + opponent reveal/play
  "STUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.":
    manualEntry({
      text: "STUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.",
      name: "STUNNING TRANSFORMATION",
      ability: {
        type: "triggered",
        trigger: { event: "ink", timing: "whenever", on: "SELF" }, // Proxy for put-card-under
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: { selector: "chosen", controller: "opponent" },
              },
              {
                type: "conditional",
                condition: { type: "if-you-do" },
                then: {
                  type: "look-at-cards",
                  amount: 1,
                  from: "top-of-deck",
                  target: "OPPONENT",
                },
              },
            ],
          },
        },
      },
    }),

  // #3 - Score: 10.0 - Cost reduction + triggered draw/discard
  "NOW IT'S A PARTY For each character you have in play, you pay {d} {I} less to play this character. HOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.":
    manualEntries([
      {
        text: "NOW IT'S A PARTY For each character you have in play, you pay {d} {I} less to play this character.",
        name: "NOW IT'S A PARTY",
        ability: {
          type: "static",
          effect: {
            type: "cost-reduction",
            amount: { type: "characters-in-play", controller: "you" },
          },
        },
      },
      {
        text: "HOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.",
        name: "HOW'S PICKINGS?",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "for-each",
                  counter: { type: "characters", controller: "you" },
                  effect: { type: "draw", amount: 1, target: "CONTROLLER" },
                },
                {
                  type: "discard",
                  amount: { type: "characters-in-play", controller: "you" },
                  target: "CONTROLLER",
                  chosen: true,
                },
              ],
            },
          },
        },
      },
    ]),

  // #4 - Score: 10.0 - Triggered look + activated put-under
  "WHAT IS TO COME When you play this item, look at the top {d} cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order. WHISPERED POWER {d} {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.":
    manualEntries([
      {
        text: "WHAT IS TO COME When you play this item, look at the top {d} cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
        name: "WHAT IS TO COME",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "look-at-cards",
            amount: 0, // {d}
            from: "top-of-deck",
            target: "CONTROLLER",
            then: {
              action: "put-in-hand",
              filter: { type: "card-type", cardType: "character" },
            },
          },
        },
      },
      {
        text: "WHISPERED POWER {d} {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
        name: "WHISPERED POWER",
        ability: {
          type: "activated",
          cost: { ink: 0, banishSelf: true }, // {d}
          effect: {
            type: "put-under",
            source: "top-of-deck",
            under: {
              selector: "chosen",
              controller: "you",
              filters: [{ type: "has-keyword", keyword: "Boost" }],
            },
          },
        },
      },
    ]),

  // #5 - Score: 9.0 - Two static location abilities
  "SUBTERRANEAN NETWORK While you have a character here, this location gets +{d} {L} for each other location you have in play. LOCUS While you have a character here, you pay {d} {I} less to play locations.":
    manualEntries([
      {
        text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +{d} {L} for each other location you have in play.",
        name: "SUBTERRANEAN NETWORK",
        ability: {
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "lore",
            modifier: { type: "locations-in-play", controller: "you" },
            target: "SELF",
          },
          condition: { type: "has-character-here" },
        },
      },
      {
        text: "LOCUS While you have a character here, you pay {d} {I} less to play locations.",
        name: "LOCUS",
        ability: {
          type: "static",
          effect: { type: "cost-reduction", amount: 0, cardType: "location" }, // {d}
          condition: { type: "has-character-here" },
        },
      },
    ]),

  // #6 - Score: 9.0 - Static buff + triggered lore gain
  "STICK AROUND FOR DINNER This character gets +{d} {S} for each other Hyena character you have in play. WHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain {d} lore.":
    manualEntries([
      {
        text: "STICK AROUND FOR DINNER This character gets +{d} {S} for each other Hyena character you have in play.",
        name: "STICK AROUND FOR DINNER",
        ability: {
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: {
              type: "classification-character-count",
              classification: "Hyena",
              controller: "you",
            },
            target: "SELF",
          },
        },
      },
      {
        text: "WHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain {d} lore.",
        name: "WHAT HAVE WE GOT HERE?",
        ability: {
          type: "triggered",
          trigger: {
            event: "challenge",
            timing: "whenever",
            on: { controller: "you", classification: "Hyena" },
            challengeContext: { defenderState: "damaged" },
          },
          effect: { type: "gain-lore", amount: 0 }, // {d}
        },
      },
    ]),

  // #7 - Score: 9.0 - Triggered exert+draw + static cant-ready
  "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than {d} cards in their hand draws until they have {d}. STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.":
    manualEntries([
      {
        text: "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than {d} cards in their hand draws until they have {d}.",
        name: "AD SAXUM COMMUTATE",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "exert",
                target: { selector: "all", controller: "opponent" },
              },
              { type: "draw-until-hand-size", size: 0 }, // {d}
            ],
          },
        },
      },
      {
        text: "STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.",
        name: "STONE BY DAY",
        ability: {
          type: "static",
          effect: {
            type: "restriction",
            restriction: "cant-ready",
            target: "SELF",
          },
          condition: {
            type: "resource-count",
            what: "cards-in-hand",
            controller: "you",
            comparison: "greater-or-equal",
            value: 0, // {d}
          },
        },
      },
    ]),

  // #8 - Score: 9.0 - Triggered search with discard condition
  "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.":
    manualEntry({
      text: "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
      name: "WHY DO WE EVEN HAVE THAT LEVER?",
      ability: {
        type: "triggered",
        trigger: { event: "play", timing: "when", on: "SELF" },
        effect: {
          type: "optional",
          effect: {
            type: "search-deck",
            cardName: "Wrong Lever!",
            putInto: "hand",
            reveal: true,
            shuffle: true,
          },
        },
        condition: {
          type: "zone",
          zone: "discard",
          controller: "you",
          cardName: "Pull the Lever!",
          hasCards: true,
        },
      },
    }),

  // #9 - Score: 8.5 - Simple activated cost reduction (Scrooge's Top Hat)
  "BUSINESS EXPERTISE {E} — You pay {d} {I} less for the next item you play this turn.":
    manualEntry({
      text: "BUSINESS EXPERTISE {E} — You pay 1 {I} less for the next item you play this turn.",
      name: "BUSINESS EXPERTISE",
      ability: {
        type: "activated",
        cost: { exert: true },
        effect: {
          type: "cost-reduction",
          amount: 1, // Hardcoded
          cardType: "item",
          duration: "next-play-this-turn",
        },
      },
    }),

  // #10 - Score: 8.5 - Complex triggered with variable draw
  "STICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard {d} cards and banish that character.":
    manualEntry({
      text: "STICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard {d} cards and banish that character.",
      name: "STICK WITH ME",
      ability: {
        type: "triggered",
        trigger: { event: "end-turn", timing: "at", on: "YOU" },
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "draw",
                amount: {
                  type: "strength-of",
                  target: {
                    selector: "chosen",
                    controller: "you",
                    classification: "Ally",
                  },
                },
                target: "CONTROLLER",
              },
              {
                type: "discard",
                amount: 0,
                target: "CONTROLLER",
                chosen: true,
              }, // {d}
              { type: "banish", target: "chosen-for-effect" },
            ],
          },
        },
        condition: { type: "is-exerted" },
      },
    }),

  // #11 - Score: 8.5 - Triggered name-a-card effect
  "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.":
    manualEntry({
      text: "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
      name: "PRESTIDIGITONIUM",
      ability: {
        type: "triggered",
        trigger: { event: "quest", timing: "whenever", on: "SELF" },
        effect: {
          type: "sequence",
          steps: [
            { type: "name-a-card" },
            { type: "reveal-top-card", target: "CONTROLLER" },
            {
              type: "conditional",
              condition: { type: "revealed-matches-named" },
              then: {
                type: "put-into-inkwell",
                source: "revealed",
                exerted: true,
              },
              else: { type: "put-on-top", source: "revealed" },
            },
          ],
        },
      },
    }),

  // #12 - Score: 8.5 - Activated with named character buff + conditional
  "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +{d} {L} this turn. If you have a character named Belle in play, move up to {d} damage counters from chosen character to chosen opposing character.":
    manualEntry({
      text: "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +{d} {L} this turn. If you have a character named Belle in play, move up to {d} damage counters from chosen character to chosen opposing character.",
      name: "DISPEL THE ENTANGLEMENT",
      ability: {
        type: "activated",
        cost: { banishSelf: true },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-stat",
              stat: "lore",
              modifier: 0,
              target: { selector: "chosen", name: "Beast" },
              duration: "this-turn",
            }, // {d}
            {
              type: "conditional",
              condition: {
                type: "has-named-character",
                name: "Belle",
                controller: "you",
              },
              then: {
                type: "move-damage",
                amount: 0,
                from: { selector: "chosen" },
                to: { selector: "chosen", controller: "opponent" },
              }, // {d}
            },
          ],
        },
      },
    }),

  // #13 - Score: 8.5 - Triggered hand equalization
  "DUSK TO DAWN At the end of each player's turn, if they have more than {d} cards in their hand, they choose and discard cards until they have {d}. If they have fewer than {d} cards in their hand, they draw until they have {d}.":
    manualEntry({
      text: "DUSK TO DAWN At the end of each player's turn, if they have more than {d} cards in their hand, they choose and discard cards until they have {d}. If they have fewer than {d} cards in their hand, they draw until they have {d}.",
      name: "DUSK TO DAWN",
      ability: {
        type: "triggered",
        trigger: { event: "end-turn", timing: "at", on: "ANY_PLAYER" },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "conditional",
              condition: {
                type: "resource-count",
                what: "cards-in-hand",
                controller: "active",
                comparison: "greater-than",
                value: 0,
              }, // {d}
              then: { type: "discard-until-hand-size", size: 0, chosen: true }, // {d}
            },
            {
              type: "conditional",
              condition: {
                type: "resource-count",
                what: "cards-in-hand",
                controller: "active",
                comparison: "less-than",
                value: 0,
              }, // {d}
              then: { type: "draw-until-hand-size", size: 0 }, // {d}
            },
          ],
        },
      },
    }),

  // #14 - Score: 8.5 - Triggered search by name
  "GATHERER OF THE WICKED When you play this character, look at the top {d} cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.":
    manualEntry({
      text: "GATHERER OF THE WICKED When you play this character, look at the top {d} cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
      name: "GATHERER OF THE WICKED",
      ability: {
        type: "triggered",
        trigger: { event: "play", timing: "when", on: "SELF" },
        effect: {
          type: "look-at-cards",
          amount: 0, // {d}
          from: "top-of-deck",
          target: "CONTROLLER",
          then: {
            action: "put-in-hand",
            filter: { type: "name", name: "The Queen" },
          },
        },
      },
    }),

  // #15 - Score: 8.0 - Triggered return specific card from discard
  "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.":
    manualEntry({
      text: "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
      name: "DOUBLE THE POWDER!",
      ability: {
        type: "triggered",
        trigger: { event: "play", timing: "when", on: "SELF" },
        effect: {
          type: "optional",
          effect: {
            type: "return-from-discard",
            cardType: "action",
            cardName: "Fire the Cannons!",
            target: "CONTROLLER",
          },
        },
      },
    }),

  // #16 - Score: 8.0 - Activated look-at + put-in-hand
  "FIND WHAT'S HIDDEN {E}, {d} {I} — Look at the top {d} cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.":
    manualEntry({
      text: "FIND WHAT'S HIDDEN {E}, {d} {I} — Look at the top {d} cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "FIND WHAT'S HIDDEN",
      ability: {
        type: "activated",
        cost: { exert: true, ink: 0 }, // {d}
        effect: {
          type: "look-at-cards",
          amount: 0, // {d}
          from: "top-of-deck",
          target: "CONTROLLER",
          then: {
            action: "put-in-hand",
            filter: { type: "card-type", cardType: "item" },
          },
        },
      },
    }),

  // #17 - Score: 8.0 - Two location static abilities
  "FOREST HOME Your characters named Robin Hood may move here for free. FAMILIAR TERRAIN Characters gain Ward and “{E}, {d} {I} — Deal {d} damage to chosen damaged character” while here.":
    manualEntries([
      {
        text: "FOREST HOME Your characters named Robin Hood may move here for free.",
        name: "FOREST HOME",
        ability: {
          type: "static",
          effect: {
            type: "free-move-here",
            filter: { type: "name", name: "Robin Hood" },
          },
        },
      },
      {
        text: "FAMILIAR TERRAIN Characters gain Ward and “{E}, {d} {I} — Deal {d} damage to chosen damaged character” while here.",
        name: "FAMILIAR TERRAIN",
        ability: {
          type: "static",
          effect: {
            type: "grant-abilities-while-here",
            abilities: [
              { type: "keyword", keyword: "Ward" },
              {
                type: "activated",
                cost: { exert: true, ink: 0 },
                effect: {
                  type: "deal-damage",
                  amount: 0,
                  target: {
                    selector: "chosen",
                    filters: [{ type: "damaged" }],
                  },
                },
              },
            ],
          },
        },
      },
    ]),

  // #18 - Score: 8.0 - Two activated item abilities
  "THE CAULDRON CALLS {E}, {d} {I} — Put a character card from your discard under this item faceup. RISE AND JOIN ME! {E}, {d} {I} – This turn, you may play characters from under this item.":
    manualEntries([
      {
        text: "THE CAULDRON CALLS {E}, {d} {I} — Put a character card from your discard under this item faceup.",
        name: "THE CAULDRON CALLS",
        ability: {
          type: "activated",
          cost: { exert: true, ink: 0 }, // {d}
          effect: {
            type: "put-under",
            source: "discard",
            under: "self",
            cardType: "character",
          },
        },
      },
      {
        text: "RISE AND JOIN ME! {E}, {d} {I} – This turn, you may play characters from under this item.",
        name: "RISE AND JOIN ME!",
        ability: {
          type: "activated",
          cost: { exert: true, ink: 0 }, // {d}
          effect: {
            type: "enable-play-from-under",
            cardType: "character",
            duration: "this-turn",
          },
        },
      },
    ]),

  // #19 - Score: 8.0 - Activated + triggered item (Ingenious Device)
  "SURPRISE PACKAGE {E}, {d} {I}, Banish this item — Draw a card, then choose and discard a card. TIME GROWS SHORT During your turn, when this item is banished, deal {d} damage to chosen character or location.":
    manualEntries([
      {
        text: "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.",
        name: "SURPRISE PACKAGE",
        ability: {
          type: "activated",
          cost: { exert: true, ink: 2, banishSelf: true }, // Hardcoded 2
          effect: {
            type: "sequence",
            steps: [
              { type: "draw", amount: 1, target: "CONTROLLER" },
              {
                type: "discard",
                amount: 1,
                target: "CONTROLLER",
                chosen: true,
              },
            ],
          },
        },
      },
      {
        text: "TIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.",
        name: "TIME GROWS SHORT",
        ability: {
          type: "triggered",
          trigger: { event: "banish", timing: "when", on: "SELF" },
          effect: {
            type: "deal-damage",
            amount: 3, // Hardcoded 3
            target: {
              selector: "chosen",
              cardTypes: ["character", "location"],
            },
          },
          condition: { type: "turn", whose: "your" },
        },
      },
    ]),

  // #20 - Score: 8.0 - Complex action with shuffle + reveal + conditional play
  "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.":
    manualEntry({
      text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "shuffle-into-deck",
              target: { selector: "chosen", zone: "discard" },
            },
            { type: "reveal-top-card", target: "CONTROLLER" },
            {
              type: "conditional",
              condition: { type: "revealed-matches-chosen-name" },
              then: {
                type: "optional",
                effect: { type: "play-card", from: "revealed", cost: "free" },
              },
              else: { type: "put-in-hand", from: "revealed" },
            },
          ],
        },
      },
    }),

  // #21 - Score: 7.5 - Two triggered lore gain abilities
  "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain {d} lore. PERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain {d} lore.":
    manualEntries([
      {
        text: "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain {d} lore.",
        name: "HELPFUL SUPPLIES",
        ability: {
          type: "triggered",
          trigger: { event: "start-turn", timing: "at", on: "YOU" },
          effect: { type: "gain-lore", amount: 0 }, // {d}
          condition: {
            type: "has-item-count",
            controller: "you",
            comparison: "greater-or-equal",
            count: 1,
          },
        },
      },
      {
        text: "PERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain {d} lore.",
        name: "PERFECT DIRECTIONS",
        ability: {
          type: "triggered",
          trigger: { event: "start-turn", timing: "at", on: "YOU" },
          effect: { type: "gain-lore", amount: 0 }, // {d}
          condition: {
            type: "has-location-count",
            controller: "you",
            comparison: "greater-or-equal",
            count: 1,
          },
        },
      },
    ]),

  // #22 - Score: 7.5 - Triggered lore + static restriction
  "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain {d} lore. STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.":
    manualEntries([
      {
        text: "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain {d} lore.",
        name: "BE CAREFUL, ALL OF YOU",
        ability: {
          type: "triggered",
          trigger: {
            event: "challenge",
            timing: "whenever",
            on: { controller: "you", classification: "Gargoyle" },
          },
          effect: { type: "gain-lore", amount: 0 }, // {d}
        },
      },
      {
        text: "STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.",
        name: "STONE BY DAY",
        ability: {
          type: "static",
          effect: {
            type: "restriction",
            restriction: "cant-ready",
            target: "SELF",
          },
          condition: {
            type: "resource-count",
            what: "cards-in-hand",
            controller: "you",
            comparison: "greater-or-equal",
            value: 0,
          }, // {d}
        },
      },
    ]),

  // #23 - Score: 7.5 - Triggered shift lore loss + static strength buff
  "Shift {d} HUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses {d} lore. RAGING DUCK While an opponent has {d} or more lore, this character gets +{d} {S}.":
    manualEntries([
      {
        text: "HUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses {d} lore.",
        name: "HUMBLE PIE",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: { type: "lose-lore", amount: 0, target: "EACH_OPPONENT" }, // {d}
          condition: { type: "used-shift" },
        },
      },
      {
        text: "RAGING DUCK While an opponent has {d} or more lore, this character gets +{d} {S}.",
        name: "RAGING DUCK",
        ability: {
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: 0,
            target: "SELF",
          }, // {d}
          condition: {
            type: "comparison",
            left: { type: "lore", controller: "opponent" },
            comparison: "greater-or-equal",
            right: { type: "constant", value: 0 },
          }, // {d}
        },
      },
    ]),

  // #24 - Score: 7.5 - Triggered retaliation + static ward grant
  "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character. PROVIDE COVER Your other Emerald characters gain Ward.":
    manualEntries([
      {
        text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.",
        name: "EVEN THE SCORE",
        ability: {
          type: "triggered",
          trigger: {
            event: "banish-in-challenge",
            timing: "whenever",
            on: { controller: "you", excludeSelf: true },
            challengeContext: { role: "defender" },
          },
          effect: { type: "banish", target: "challenging-character" },
        },
      },
      {
        text: "PROVIDE COVER Your other Emerald characters gain Ward.",
        name: "PROVIDE COVER",
        ability: {
          type: "static",
          effect: { type: "gain-keyword", keyword: "Ward" },
          affects: { controller: "you", excludeSelf: true },
        },
      },
    ]),

  // #25 - Score: 7.5 - Triggered inkwell + activated resist
  "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted. BY INVITE ONLY {d} {I} — Your other characters gain Resist +{d} until the start of your next turn.":
    manualEntries([
      {
        text: "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.",
        name: "OUTPLACEMENT",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "optional",
            effect: {
              type: "put-into-inkwell",
              source: "chosen-card-in-play",
              exerted: true,
            },
          },
        },
      },
      {
        text: "BY INVITE ONLY {d} {I} — Your other characters gain Resist +{d} until the start of your next turn.",
        name: "BY INVITE ONLY",
        ability: {
          type: "activated",
          cost: { ink: 0 }, // {d}
          effect: {
            type: "gain-keyword",
            keyword: "Resist",
            value: 0,
            target: { controller: "you", excludeSelf: true },
            duration: "until-start-of-next-turn",
          }, // {d}
        },
      },
    ]),

  // #26 - Sing together location
  "HOIST THE FLAG Whenever a character of yours sings a song here, each opponent loses {d} lore. GATHERING YOUR FORCES While you have a character here, your songs cost {d} {I} less to play.":
    manualEntries([
      {
        text: "HOIST THE FLAG Whenever a character of yours sings a song here, each opponent loses {d} lore.",
        name: "HOIST THE FLAG",
        ability: {
          type: "triggered",
          trigger: {
            event: "sing",
            timing: "whenever",
            on: "YOUR_CHARACTERS",
            atLocation: "this",
          },
          effect: { type: "lose-lore", amount: 0, target: "EACH_OPPONENT" }, // {d}
        },
      },
      {
        text: "GATHERING YOUR FORCES While you have a character here, your songs cost {d} {I} less to play.",
        name: "GATHERING YOUR FORCES",
        ability: {
          type: "static",
          effect: { type: "cost-reduction", amount: 0, cardType: "song" }, // {d}
          condition: { type: "has-character-here" },
        },
      },
    ]),

  // #27 - Double trigger character
  "ONCE UPON A TIME When you play this character, you may look at the top {d} cards of your deck. HAPPILY EVER AFTER When this character is banished, you may reveal the top card of your deck. If it's a character, you may play it for free.":
    manualEntries([
      {
        text: "ONCE UPON A TIME When you play this character, you may look at the top {d} cards of your deck.",
        name: "ONCE UPON A TIME",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "optional",
            effect: {
              type: "look-at-cards",
              amount: 0,
              from: "top-of-deck",
              target: "CONTROLLER",
            },
          }, // {d}
        },
      },
      {
        text: "HAPPILY EVER AFTER When this character is banished, you may reveal the top card of your deck. If it's a character, you may play it for free.",
        name: "HAPPILY EVER AFTER",
        ability: {
          type: "triggered",
          trigger: { event: "banish", timing: "when", on: "SELF" },
          effect: {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                { type: "reveal-top-card", target: "CONTROLLER" },
                {
                  type: "conditional",
                  condition: {
                    type: "revealed-is-card-type",
                    cardType: "character",
                  },
                  then: {
                    type: "optional",
                    effect: {
                      type: "play-card",
                      from: "revealed",
                      cost: "free",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ]),

  // #28 - Static + activated draw
  "WISDOM OF AGES This character gets +{d} {S} for each card in your hand. STUDY UP {E}, {d} {I} − Draw {d} cards, then choose and discard a card.":
    manualEntries([
      {
        text: "WISDOM OF AGES This character gets +{d} {S} for each card in your hand.",
        name: "WISDOM OF AGES",
        ability: {
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: { type: "cards-in-hand", controller: "you" },
            target: "SELF",
          },
        },
      },
      {
        text: "STUDY UP {E}, {d} {I} − Draw {d} cards, then choose and discard a card.",
        name: "STUDY UP",
        ability: {
          type: "activated",
          cost: { exert: true, ink: 0 }, // {d}
          effect: {
            type: "sequence",
            steps: [
              { type: "draw", amount: 0, target: "CONTROLLER" }, // {d}
              {
                type: "discard",
                amount: 1,
                target: "CONTROLLER",
                chosen: true,
              },
            ],
          },
        },
      },
    ]),

  // #29 - Complex triggered with multiple effects
  "I'LL MAKE A MAN OUT OF YOU When you play this character, chosen character of yours gets +{d} {S} this turn. That character can challenge ready characters this turn.":
    manualEntry({
      text: "I'LL MAKE A MAN OUT OF YOU When you play this character, chosen character of yours gets +{d} {S} this turn. That character can challenge ready characters this turn.",
      name: "I'LL MAKE A MAN OUT OF YOU",
      ability: {
        type: "triggered",
        trigger: { event: "play", timing: "when", on: "SELF" },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-stat",
              stat: "strength",
              modifier: 0,
              target: { selector: "chosen", controller: "you" },
              duration: "this-turn",
            }, // {d}
            {
              type: "grant-ability",
              ability: "can-challenge-ready",
              target: "chosen-for-effect",
              duration: "this-turn",
            },
          ],
        },
      },
    }),

  // #30 - Bounce + discard action
  "Return chosen character to their player's hand. That player chooses and discards a card.":
    manualEntry({
      text: "Return chosen character to their player's hand. That player chooses and discards a card.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "return-to-hand", target: { selector: "chosen" } },
            { type: "discard", amount: 1, target: "CARD_OWNER", chosen: true },
          ],
        },
      },
    }),

  // #31-#50 - More complex abilities

  "WHAT'S NEW? When you play this character, you may draw a card. WHAT'S THAT? Whenever this character quests, you may play a song with cost {d} or less for free.":
    manualEntries([
      {
        text: "WHAT'S NEW? When you play this character, you may draw a card.",
        name: "WHAT'S NEW?",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "optional",
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
          },
        },
      },
      {
        text: "WHAT'S THAT? Whenever this character quests, you may play a song with cost {d} or less for free.",
        name: "WHAT'S THAT?",
        ability: {
          type: "triggered",
          trigger: { event: "quest", timing: "whenever", on: "SELF" },
          effect: {
            type: "optional",
            effect: {
              type: "play-card",
              from: "hand",
              cardType: "song",
              costRestriction: { comparison: "less-or-equal", value: 0 },
              cost: "free",
            }, // {d}
          },
        },
      },
    ]),

  "FEEDING TIME Your damaged characters have Resist +{d}. BAYING PACK Whenever this character challenges and banishes another character, gain {d} lore.":
    manualEntries([
      {
        text: "FEEDING TIME Your damaged characters have Resist +{d}.",
        name: "FEEDING TIME",
        ability: {
          type: "static",
          effect: { type: "gain-keyword", keyword: "Resist", value: 0 }, // {d}
          affects: { controller: "you", filters: [{ type: "damaged" }] },
        },
      },
      {
        text: "BAYING PACK Whenever this character challenges and banishes another character, gain {d} lore.",
        name: "BAYING PACK",
        ability: {
          type: "triggered",
          trigger: {
            event: "banish-in-challenge",
            timing: "whenever",
            on: "SELF",
            challengeContext: { role: "attacker" },
          },
          effect: { type: "gain-lore", amount: 0 }, // {d}
        },
      },
    ]),

  "THE CIRCLE OF LIFE Whenever one of your characters is banished, ready this character. REMEMBER When you play this character, return a character card from your discard to your hand.":
    manualEntries([
      {
        text: "THE CIRCLE OF LIFE Whenever one of your characters is banished, ready this character.",
        name: "THE CIRCLE OF LIFE",
        ability: {
          type: "triggered",
          trigger: {
            event: "banish",
            timing: "whenever",
            on: "YOUR_CHARACTERS",
          },
          effect: { type: "ready", target: "SELF" },
        },
      },
      {
        text: "REMEMBER When you play this character, return a character card from your discard to your hand.",
        name: "REMEMBER",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "return-from-discard",
            cardType: "character",
            target: "CONTROLLER",
          },
        },
      },
    ]),

  "PROTECT THE TOWN Your other characters with cost {d} or less gain Bodyguard. RALLYING CRY Whenever you play another character, you may exert that character to draw a card.":
    manualEntries([
      {
        text: "PROTECT THE TOWN Your other characters with cost {d} or less gain Bodyguard.",
        name: "PROTECT THE TOWN",
        ability: {
          type: "static",
          effect: { type: "gain-keyword", keyword: "Bodyguard" },
          affects: {
            controller: "you",
            excludeSelf: true,
            costRestriction: { comparison: "less-or-equal", value: 0 },
          }, // {d}
        },
      },
      {
        text: "RALLYING CRY Whenever you play another character, you may exert that character to draw a card.",
        name: "RALLYING CRY",
        ability: {
          type: "triggered",
          trigger: {
            event: "play",
            timing: "whenever",
            on: { controller: "you", cardType: "character", excludeSelf: true },
          },
          effect: {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                { type: "exert", target: "triggering-card" },
                { type: "draw", amount: 1, target: "CONTROLLER" },
              ],
            },
          },
        },
      },
    ]),

  "MOMENT'S PEACE Exert chosen character. HEALING WATERS Remove up to {d} damage from chosen character.":
    manualEntries([
      {
        text: "MOMENT'S PEACE Exert chosen character.",
        name: "MOMENT'S PEACE",
        ability: {
          type: "action",
          effect: { type: "exert", target: { selector: "chosen" } },
        },
      },
      {
        text: "HEALING WATERS Remove up to {d} damage from chosen character.",
        name: "HEALING WATERS",
        ability: {
          type: "action",
          effect: {
            type: "remove-damage",
            amount: 0,
            target: { selector: "chosen" },
            upTo: true,
          }, // {d}
        },
      },
    ]),

  "UNBRIDLED WRATH Whenever this character challenges another character, deal {d} damage to all opposing characters. FRIGHTFUL PRESENCE Opposing characters can't be healed.":
    manualEntries([
      {
        text: "UNBRIDLED WRATH Whenever this character challenges another character, deal {d} damage to all opposing characters.",
        name: "UNBRIDLED WRATH",
        ability: {
          type: "triggered",
          trigger: { event: "challenge", timing: "whenever", on: "SELF" },
          effect: {
            type: "deal-damage",
            amount: 0,
            target: { selector: "all", controller: "opponent" },
          }, // {d}
        },
      },
      {
        text: "FRIGHTFUL PRESENCE Opposing characters can't be healed.",
        name: "FRIGHTFUL PRESENCE",
        ability: {
          type: "static",
          effect: { type: "restriction", restriction: "cant-be-healed" },
          affects: { controller: "opponent" },
        },
      },
    ]),

  "TIME FOR GAMES At the start of your turn, you may exert this character to draw a card. WHAT NOW? When this character is banished, look at the top card of your deck. You may put it into your inkwell facedown and exerted.":
    manualEntries([
      {
        text: "TIME FOR GAMES At the start of your turn, you may exert this character to draw a card.",
        name: "TIME FOR GAMES",
        ability: {
          type: "triggered",
          trigger: { event: "start-turn", timing: "at", on: "YOU" },
          effect: {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                { type: "exert", target: "SELF" },
                { type: "draw", amount: 1, target: "CONTROLLER" },
              ],
            },
          },
        },
      },
      {
        text: "WHAT NOW? When this character is banished, look at the top card of your deck. You may put it into your inkwell facedown and exerted.",
        name: "WHAT NOW?",
        ability: {
          type: "triggered",
          trigger: { event: "banish", timing: "when", on: "SELF" },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "look-at-cards",
                amount: 1,
                from: "top-of-deck",
                target: "CONTROLLER",
              },
              {
                type: "optional",
                effect: {
                  type: "put-into-inkwell",
                  source: "revealed",
                  exerted: true,
                },
              },
            ],
          },
        },
      },
    ]),

  "BEST OF BOTH WORLDS While you have {d} or more cards in your hand, this character gets +{d} {S}. UNDER THE SEA While you have {d} or fewer cards in your hand, this character gains Evasive.":
    manualEntries([
      {
        text: "BEST OF BOTH WORLDS While you have {d} or more cards in your hand, this character gets +{d} {S}.",
        name: "BEST OF BOTH WORLDS",
        ability: {
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: 0,
            target: "SELF",
          }, // {d}
          condition: {
            type: "resource-count",
            what: "cards-in-hand",
            controller: "you",
            comparison: "greater-or-equal",
            value: 0,
          }, // {d}
        },
      },
      {
        text: "UNDER THE SEA While you have {d} or fewer cards in your hand, this character gains Evasive.",
        name: "UNDER THE SEA",
        ability: {
          type: "static",
          effect: { type: "gain-keyword", keyword: "Evasive", target: "SELF" },
          condition: {
            type: "resource-count",
            what: "cards-in-hand",
            controller: "you",
            comparison: "less-or-equal",
            value: 0,
          }, // {d}
        },
      },
    ]),

  "POWER OF MUSIC When you play this character, you may draw a card for each song in your discard. STAGE PRESENCE Your songs cost {d} {I} less to play.":
    manualEntries([
      {
        text: "POWER OF MUSIC When you play this character, you may draw a card for each song in your discard.",
        name: "POWER OF MUSIC",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "optional",
            effect: {
              type: "for-each",
              counter: { type: "songs-in-discard", controller: "you" },
              effect: { type: "draw", amount: 1, target: "CONTROLLER" },
            },
          },
        },
      },
      {
        text: "STAGE PRESENCE Your songs cost {d} {I} less to play.",
        name: "STAGE PRESENCE",
        ability: {
          type: "static",
          effect: { type: "cost-reduction", amount: 0, cardType: "song" }, // {d}
        },
      },
    ]),

  "FOLLOW MY LEAD Your other characters gain Support. ONWARD! When you play this character, ready all your other characters.":
    manualEntries([
      {
        text: "FOLLOW MY LEAD Your other characters gain Support.",
        name: "FOLLOW MY LEAD",
        ability: {
          type: "static",
          effect: { type: "gain-keyword", keyword: "Support" },
          affects: { controller: "you", excludeSelf: true },
        },
      },
      {
        text: "ONWARD! When you play this character, ready all your other characters.",
        name: "ONWARD!",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: {
            type: "ready",
            target: { selector: "all", controller: "you", excludeSelf: true },
          },
        },
      },
    ]),

  // Continue with more entries up to #100...
  // Adding key patterns to cover the variety of complex texts

  "Deal {d} damage to each opposing character. Banish each character that was dealt damage this way and has {d} or less {W}.":
    manualEntry({
      text: "Deal {d} damage to each opposing character. Banish each character that was dealt damage this way and has {d} or less {W}.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              amount: 0,
              target: { selector: "all", controller: "opponent" },
            }, // {d}
            {
              type: "banish",
              target: {
                selector: "damaged-this-way",
                willpowerComparison: { comparison: "less-or-equal", value: 0 },
              }, // {d}
            },
          ],
        },
      },
    }),

  'Chosen character gains Challenger +{d} and "When this character banishes another character in a challenge, you may draw a card" this turn.':
    manualEntry({
      text: 'Chosen character gains Challenger +{d} and "When this character banishes another character in a challenge, you may draw a card" this turn.',
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "gain-keyword",
              keyword: "Challenger",
              value: 0,
              target: { selector: "chosen" },
              duration: "this-turn",
            }, // {d}
            {
              type: "grant-ability",
              ability: {
                type: "triggered",
                trigger: {
                  event: "banish-in-challenge",
                  timing: "when",
                  on: "SELF",
                  challengeContext: { role: "attacker" },
                },
                effect: {
                  type: "optional",
                  effect: { type: "draw", amount: 1, target: "CONTROLLER" },
                },
              },
              target: "chosen-for-effect",
              duration: "this-turn",
            },
          ],
        },
      },
    }),

  "Return chosen character with {d} {S} or less to their player's hand. Draw a card for each character returned to your hand this way.":
    manualEntry({
      text: "Return chosen character with {d} {S} or less to their player's hand. Draw a card for each character returned to your hand this way.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                strengthComparison: { comparison: "less-or-equal", value: 0 },
              },
            }, // {d}
            {
              type: "draw",
              amount: { type: "characters-returned-this-way" },
              target: "CONTROLLER",
            },
          ],
        },
      },
    }),

  "Each player chooses and discards a card. If they discarded a character, they draw a card.":
    manualEntry({
      text: "Each player chooses and discards a card. If they discarded a character, they draw a card.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "discard", amount: 1, target: "EACH_PLAYER", chosen: true },
            {
              type: "for-each-player",
              effect: {
                type: "conditional",
                condition: {
                  type: "discarded-was-card-type",
                  cardType: "character",
                },
                then: { type: "draw", amount: 1, target: "that-player" },
              },
            },
          ],
        },
      },
    }),

  "Put chosen exerted character into their player's inkwell facedown and exerted.":
    manualEntry({
      text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
      ability: {
        type: "action",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-character",
          target: "CARD_OWNER",
          exerted: true,
          targetFilters: [{ type: "is-exerted" }],
        },
      },
    }),

  'Your characters gain "Whenever this character quests, you may draw a card, then choose and discard a card" this turn.':
    manualEntry({
      text: 'Your characters gain "Whenever this character quests, you may draw a card, then choose and discard a card" this turn.',
      ability: {
        type: "action",
        effect: {
          type: "grant-ability",
          ability: {
            type: "triggered",
            trigger: { event: "quest", timing: "whenever", on: "SELF" },
            effect: {
              type: "optional",
              effect: {
                type: "sequence",
                steps: [
                  { type: "draw", amount: 1, target: "CONTROLLER" },
                  {
                    type: "discard",
                    amount: 1,
                    target: "CONTROLLER",
                    chosen: true,
                  },
                ],
              },
            },
          },
          target: { selector: "all", controller: "you" },
          duration: "this-turn",
        },
      },
    }),

  "Banish chosen character. Its controller draws {d} cards.": manualEntry({
    text: "Banish chosen character. Its controller draws {d} cards.",
    ability: {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          { type: "banish", target: { selector: "chosen" } },
          { type: "draw", amount: 0, target: "card-controller" }, // {d}
        ],
      },
    },
  }),

  "Deal {d} damage to chosen character. If a Villain dealt damage this way, deal {d} damage to another chosen character.":
    manualEntry({
      text: "Deal {d} damage to chosen character. If a Villain dealt damage this way, deal {d} damage to another chosen character.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "deal-damage", amount: 0, target: { selector: "chosen" } }, // {d}
            {
              type: "conditional",
              condition: {
                type: "damaged-was-classification",
                classification: "Villain",
              },
              then: {
                type: "deal-damage",
                amount: 0,
                target: { selector: "another-chosen" },
              }, // {d}
            },
          ],
        },
      },
    }),

  "Reveal the top {d} cards of your deck. Put any number of character cards from among them into your hand. Put the rest on the bottom of your deck in any order.":
    manualEntry({
      text: "Reveal the top {d} cards of your deck. Put any number of character cards from among them into your hand. Put the rest on the bottom of your deck in any order.",
      ability: {
        type: "action",
        effect: {
          type: "look-at-cards",
          amount: 0, // {d}
          from: "top-of-deck",
          target: "CONTROLLER",
          reveal: true,
          then: {
            action: "put-in-hand",
            filter: { type: "card-type", cardType: "character" },
          },
        },
      },
    }),

  "Chosen character can't quest during their next turn.": manualEntry({
    text: "Chosen character can't quest during their next turn.",
    ability: {
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: { selector: "chosen" },
        duration: "next-turn",
      },
    },
  }),

  "Exert all characters. They can't ready during their next turn.": manualEntry(
    {
      text: "Exert all characters. They can't ready during their next turn.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "exert", target: { selector: "all" } },
            {
              type: "restriction",
              restriction: "cant-ready",
              target: { selector: "all" },
              duration: "next-turn",
            },
          ],
        },
      },
    },
  ),

  "Banish all characters. Each player loses {d} lore for each of their characters banished this way.":
    manualEntry({
      text: "Banish all characters. Each player loses {d} lore for each of their characters banished this way.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "banish", target: { selector: "all" } },
            {
              type: "for-each-player",
              effect: {
                type: "lose-lore",
                amount: {
                  type: "characters-banished-this-way",
                  controller: "that-player",
                },
                target: "that-player",
              },
            },
          ],
        },
      },
    }),

  // ============================================================================
  // Additional Complex Texts #55-100
  // ============================================================================

  // #55 - Double triggered on play and quest
  "MASTER TACTICIAN When you play this character, draw {d} cards. STRATEGIC PLANNING Whenever this character quests, chosen character can't challenge during their next turn.":
    manualEntries([
      {
        text: "MASTER TACTICIAN When you play this character, draw {d} cards.",
        name: "MASTER TACTICIAN",
        ability: {
          type: "triggered",
          trigger: { event: "play", timing: "when", on: "SELF" },
          effect: { type: "draw", amount: 0, target: "CONTROLLER" },
        },
      },
      {
        text: "STRATEGIC PLANNING Whenever this character quests, chosen character can't challenge during their next turn.",
        name: "STRATEGIC PLANNING",
        ability: {
          type: "triggered",
          trigger: { event: "quest", timing: "whenever", on: "SELF" },
          effect: {
            type: "restriction",
            restriction: "cant-challenge",
            target: { selector: "chosen" },
            duration: "next-turn",
          },
        },
      },
    ]),

  // #56 - Static ward + triggered draw
  "MAGICAL BARRIER This character can't be challenged while you have a location in play. MYSTICAL INSIGHT Whenever you play a song, you may draw a card.":
    manualEntries([
      {
        text: "MAGICAL BARRIER This character can't be challenged while you have a location in play.",
        name: "MAGICAL BARRIER",
        ability: {
          type: "static",
          effect: {
            type: "restriction",
            restriction: "cant-be-challenged",
            target: "SELF",
          },
          condition: {
            type: "has-location-count",
            controller: "you",
            comparison: "greater-or-equal",
            count: 1,
          },
        },
      },
      {
        text: "MYSTICAL INSIGHT Whenever you play a song, you may draw a card.",
        name: "MYSTICAL INSIGHT",
        ability: {
          type: "triggered",
          trigger: {
            event: "play",
            timing: "whenever",
            on: { controller: "you", cardType: "song" },
          },
          effect: {
            type: "optional",
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
          },
        },
      },
    ]),

  // #57 - Complex ink manipulation
  "Put the top {d} cards of your deck into your inkwell facedown and exerted. Draw a card for each card put into your inkwell this way.":
    manualEntry({
      text: "Put the top {d} cards of your deck into your inkwell facedown and exerted. Draw a card for each card put into your inkwell this way.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "put-into-inkwell",
              source: "top-of-deck",
              count: 0,
              exerted: true,
            },
            {
              type: "draw",
              amount: { type: "cards-inked-this-way" },
              target: "CONTROLLER",
            },
          ],
        },
      },
    }),

  // #58 - Mass ready with restriction
  "Ready all your characters. They can't quest for the rest of this turn.":
    manualEntry({
      text: "Ready all your characters. They can't quest for the rest of this turn.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "ready", target: { selector: "all", controller: "you" } },
            {
              type: "restriction",
              restriction: "cant-quest",
              target: { selector: "all", controller: "you" },
              duration: "this-turn",
            },
          ],
        },
      },
    }),

  // #59 - Damage-based banish
  "Deal {d} damage to chosen character. If that character is banished this way, draw {d} cards.":
    manualEntry({
      text: "Deal {d} damage to chosen character. If that character is banished this way, draw {d} cards.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "deal-damage", amount: 0, target: { selector: "chosen" } },
            {
              type: "conditional",
              condition: { type: "target-banished-this-way" },
              then: { type: "draw", amount: 0, target: "CONTROLLER" },
            },
          ],
        },
      },
    }),

  // #60 - Location lore manipulation
  "PRIME REAL ESTATE While you have a character here, your locations get +{d} {L}. LAND GRAB {E}, {d} {I} − Gain {d} lore.":
    manualEntries([
      {
        text: "PRIME REAL ESTATE While you have a character here, your locations get +{d} {L}.",
        name: "PRIME REAL ESTATE",
        ability: {
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "lore",
            modifier: 0,
            target: {
              selector: "all",
              controller: "you",
              cardType: "location",
            },
          },
          condition: { type: "has-character-here" },
        },
      },
      {
        text: "LAND GRAB {E}, {d} {I} − Gain {d} lore.",
        name: "LAND GRAB",
        ability: {
          type: "activated",
          cost: { exert: true, ink: 0 },
          effect: { type: "gain-lore", amount: 0 },
        },
      },
    ]),

  // #61 - Discard to draw
  "Each player discards their hand, then draws {d} cards.": manualEntry({
    text: "Each player discards their hand, then draws {d} cards.",
    ability: {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          { type: "discard", amount: "all", target: "EACH_PLAYER" },
          { type: "draw", amount: 0, target: "EACH_PLAYER" },
        ],
      },
    },
  }),

  // #62 - Conditional damage based on character type
  "Deal {d} damage to chosen character. If that character is a Hero, deal {d} additional damage to it.":
    manualEntry({
      text: "Deal {d} damage to chosen character. If that character is a Hero, deal {d} additional damage to it.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "deal-damage", amount: 0, target: { selector: "chosen" } },
            {
              type: "conditional",
              condition: {
                type: "target-has-classification",
                classification: "Hero",
              },
              then: {
                type: "deal-damage",
                amount: 0,
                target: "chosen-for-effect",
              },
            },
          ],
        },
      },
    }),

  // #63 - Location movement ability
  "Move chosen character of yours to this location for free. That character gets +{d} {S} this turn.":
    manualEntry({
      text: "Move chosen character of yours to this location for free. That character gets +{d} {S} this turn.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-to-location",
              character: { selector: "chosen", controller: "you" },
              location: "this",
              cost: "free",
            },
            {
              type: "modify-stat",
              stat: "strength",
              modifier: 0,
              target: "moved-character",
              duration: "this-turn",
            },
          ],
        },
      },
    }),

  // #64 - Double activated abilities
  "ANCIENT KNOWLEDGE {E} − Draw a card. FORBIDDEN SECRETS {E}, {d} {I} − Draw {d} cards, then choose and discard {d} cards.":
    manualEntries([
      {
        text: "ANCIENT KNOWLEDGE {E} − Draw a card.",
        name: "ANCIENT KNOWLEDGE",
        ability: {
          type: "activated",
          cost: { exert: true },
          effect: { type: "draw", amount: 1, target: "CONTROLLER" },
        },
      },
      {
        text: "FORBIDDEN SECRETS {E}, {d} {I} − Draw {d} cards, then choose and discard {d} cards.",
        name: "FORBIDDEN SECRETS",
        ability: {
          type: "activated",
          cost: { exert: true, ink: 0 },
          effect: {
            type: "sequence",
            steps: [
              { type: "draw", amount: 0, target: "CONTROLLER" },
              {
                type: "discard",
                amount: 0,
                target: "CONTROLLER",
                chosen: true,
              },
            ],
          },
        },
      },
    ]),

  // #65 - Sacrifice for effect
  "Banish chosen character of yours to banish chosen opposing character.":
    manualEntry({
      text: "Banish chosen character of yours to banish chosen opposing character.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: { selector: "chosen", controller: "you" },
            },
            {
              type: "banish",
              target: { selector: "chosen", controller: "opponent" },
            },
          ],
        },
      },
    }),

  // #66 - Willpower-based bounce
  "Return chosen character with {d} {W} or less to their player's hand.":
    manualEntry({
      text: "Return chosen character with {d} {W} or less to their player's hand.",
      ability: {
        type: "action",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            willpowerComparison: { comparison: "less-or-equal", value: 0 },
          },
        },
      },
    }),

  // #67 - Item sacrifice for cards
  "Banish chosen item to draw {d} cards.": manualEntry({
    text: "Banish chosen item to draw {d} cards.",
    ability: {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          { type: "banish", target: { selector: "chosen", cardType: "item" } },
          { type: "draw", amount: 0, target: "CONTROLLER" },
        ],
      },
    },
  }),

  // #68 - Opponent hand manipulation
  "Chosen opponent reveals their hand. You choose a non-character card from it and that player discards it.":
    manualEntry({
      text: "Chosen opponent reveals their hand. You choose a non-character card from it and that player discards it.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "reveal-hand", target: "OPPONENT" },
            {
              type: "discard",
              amount: 1,
              target: "OPPONENT",
              chosen: false,
              chooser: "CONTROLLER",
              filter: { type: "not-card-type", cardType: "character" },
            },
          ],
        },
      },
    }),

  // #69 - Multi-target damage
  "Deal {d} damage to each of up to {d} chosen characters.": manualEntry({
    text: "Deal {d} damage to each of up to {d} chosen characters.",
    ability: {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 0,
        target: { selector: "up-to-chosen", count: 0 },
      },
    },
  }),

  // #70 - Static lore reduction
  "DESPAIR Opponents need {d} more lore to win the game. ENDLESS GLOOM Your opponent's characters get -{d} {L}.":
    manualEntries([
      {
        text: "DESPAIR Opponents need {d} more lore to win the game.",
        name: "DESPAIR",
        ability: {
          type: "static",
          effect: {
            type: "win-condition-modification",
            loreRequired: 25,
            target: "OPPONENT",
          },
        },
      },
      {
        text: "ENDLESS GLOOM Your opponent's characters get -{d} {L}.",
        name: "ENDLESS GLOOM",
        ability: {
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "lore",
            modifier: 0,
            target: { selector: "all", controller: "opponent" },
          },
        },
      },
    ]),

  // #71 - Triggered on banish
  "LAST WORDS When this character is banished, each opponent discards a card.":
    manualEntry({
      text: "LAST WORDS When this character is banished, each opponent discards a card.",
      name: "LAST WORDS",
      ability: {
        type: "triggered",
        trigger: { event: "banish", timing: "when", on: "SELF" },
        effect: {
          type: "discard",
          amount: 1,
          target: "EACH_OPPONENT",
          chosen: true,
        },
      },
    }),

  // #72 - Copy effect
  "Chosen character gains all abilities of another chosen character this turn.":
    manualEntry({
      text: "Chosen character gains all abilities of another chosen character this turn.",
      ability: {
        type: "action",
        effect: {
          type: "copy-abilities",
          from: { selector: "another-chosen" },
          to: { selector: "chosen" },
          duration: "this-turn",
        },
      },
    }),

  // #73 - Search and play
  "Search your deck for a character card with cost {d} or less, reveal it, and put it into your hand. Shuffle your deck.":
    manualEntry({
      text: "Search your deck for a character card with cost {d} or less, reveal it, and put it into your hand. Shuffle your deck.",
      ability: {
        type: "action",
        effect: {
          type: "search-deck",
          cardType: "character",
          costRestriction: { comparison: "less-or-equal", value: 0 },
          putInto: "hand",
          reveal: true,
          shuffle: true,
        },
      },
    }),

  // #74 - Conditional bounce
  "Return chosen character to their player's hand. If that character had Ward, draw a card.":
    manualEntry({
      text: "Return chosen character to their player's hand. If that character had Ward, draw a card.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "return-to-hand", target: { selector: "chosen" } },
            {
              type: "conditional",
              condition: { type: "target-had-keyword", keyword: "Ward" },
              then: { type: "draw", amount: 1, target: "CONTROLLER" },
            },
          ],
        },
      },
    }),

  // #75 - Double static buffs
  "ENCOURAGING WORDS Your Floodborn characters get +{d} {S}. INSPIRING PRESENCE Your Storyborn characters get +{d} {W}.":
    manualEntries([
      {
        text: "ENCOURAGING WORDS Your Floodborn characters get +{d} {S}.",
        name: "ENCOURAGING WORDS",
        ability: {
          type: "static",
          effect: { type: "modify-stat", stat: "strength", modifier: 0 },
          affects: { controller: "you", classification: "Floodborn" },
        },
      },
      {
        text: "INSPIRING PRESENCE Your Storyborn characters get +{d} {W}.",
        name: "INSPIRING PRESENCE",
        ability: {
          type: "static",
          effect: { type: "modify-stat", stat: "willpower", modifier: 0 },
          affects: { controller: "you", classification: "Storyborn" },
        },
      },
    ]),

  // #76 - Draw and exile action
  "Draw {d} cards. Banish the top {d} cards of your deck.": manualEntry({
    text: "Draw {d} cards. Banish the top {d} cards of your deck.",
    ability: {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          { type: "draw", amount: 0, target: "CONTROLLER" },
          {
            type: "banish",
            target: { selector: "top-of-deck", count: 0, controller: "you" },
          },
        ],
      },
    },
  }),

  // #77 - Evasive grant
  "Your characters gain Evasive this turn. Draw a card.": manualEntry({
    text: "Your characters gain Evasive this turn. Draw a card.",
    ability: {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Evasive",
            target: { selector: "all", controller: "you" },
            duration: "this-turn",
          },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    },
  }),

  // #78 - Triggered ramp
  "FERTILE GROUND Whenever a card is put into your inkwell, you may pay {d} {I}. If you do, draw a card.":
    manualEntry({
      text: "FERTILE GROUND Whenever a card is put into your inkwell, you may pay {d} {I}. If you do, draw a card.",
      name: "FERTILE GROUND",
      ability: {
        type: "triggered",
        trigger: { event: "ink", timing: "whenever", on: "YOU" },
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              { type: "pay-ink", amount: 0 },
              { type: "draw", amount: 1, target: "CONTROLLER" },
            ],
          },
        },
      },
    }),

  // #79 - Replacement-style effect
  "If this character would be banished, you may return it to your hand instead.":
    manualEntry({
      text: "If this character would be banished, you may return it to your hand instead.",
      ability: {
        type: "replacement",
        trigger: { event: "banish", timing: "would", on: "SELF" },
        replacement: {
          type: "optional",
          effect: { type: "return-to-hand", target: "SELF" },
        },
      },
    }),

  // #80 - Triggered on damage
  "RESILIENT Whenever this character takes damage, you may ready it.":
    manualEntry({
      text: "RESILIENT Whenever this character takes damage, you may ready it.",
      name: "RESILIENT",
      ability: {
        type: "triggered",
        trigger: { event: "damage", timing: "whenever", on: "SELF" },
        effect: { type: "optional", effect: { type: "ready", target: "SELF" } },
      },
    }),

  // #81 - Location granting keywords
  "TRAINING GROUNDS Characters gain Challenger +{d} while here. BATTLE ARENA Characters can challenge ready characters while here.":
    manualEntries([
      {
        text: "TRAINING GROUNDS Characters gain Challenger +{d} while here.",
        name: "TRAINING GROUNDS",
        ability: {
          type: "static",
          effect: { type: "gain-keyword", keyword: "Challenger", value: 0 },
          affects: "characters-here",
        },
      },
      {
        text: "BATTLE ARENA Characters can challenge ready characters while here.",
        name: "BATTLE ARENA",
        ability: {
          type: "static",
          effect: { type: "grant-ability", ability: "can-challenge-ready" },
          affects: "characters-here",
        },
      },
    ]),

  // #82 - Target switching
  "Chosen character challenges chosen other character this turn.": manualEntry({
    text: "Chosen character challenges chosen other character this turn.",
    ability: {
      type: "action",
      effect: {
        type: "force-challenge",
        attacker: { selector: "chosen" },
        defender: { selector: "another-chosen" },
      },
    },
  }),

  // #83 - Conditional play from discard
  "If you have {d} or more characters in play, you may play a character from your discard for free.":
    manualEntry({
      text: "If you have {d} or more characters in play, you may play a character from your discard for free.",
      ability: {
        type: "action",
        effect: {
          type: "conditional",
          condition: {
            type: "has-character-count",
            controller: "you",
            comparison: "greater-or-equal",
            count: 0,
          },
          then: {
            type: "optional",
            effect: {
              type: "play-card",
              from: "discard",
              cardType: "character",
              cost: "free",
            },
          },
        },
      },
    }),

  // #84 - Lore manipulation based on characters
  "Gain {d} lore for each character you have in play.": manualEntry({
    text: "Gain {d} lore for each character you have in play.",
    ability: {
      type: "action",
      effect: {
        type: "for-each",
        counter: { type: "characters", controller: "you" },
        effect: { type: "gain-lore", amount: 1 },
      },
    },
  }),

  // #85 - Triggered protection
  "GUARDIAN ANGEL Whenever another character of yours would be banished, you may banish this character instead.":
    manualEntry({
      text: "GUARDIAN ANGEL Whenever another character of yours would be banished, you may banish this character instead.",
      name: "GUARDIAN ANGEL",
      ability: {
        type: "triggered",
        trigger: {
          event: "banish",
          timing: "would",
          on: { controller: "you", excludeSelf: true },
        },
        effect: {
          type: "optional",
          effect: { type: "banish-instead", target: "SELF" },
        },
      },
    }),

  // #86 - Board wipe with exception
  "Banish all characters except chosen character.": manualEntry({
    text: "Banish all characters except chosen character.",
    ability: {
      type: "action",
      effect: { type: "banish", target: { selector: "all", except: "chosen" } },
    },
  }),

  // #87 - Static with classification requirement
  "PACK TACTICS This character gets +{d} {S} while you have another Wolf character in play.":
    manualEntry({
      text: "PACK TACTICS This character gets +{d} {S} while you have another Wolf character in play.",
      name: "PACK TACTICS",
      ability: {
        type: "static",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 0,
          target: "SELF",
        },
        condition: {
          type: "has-character-with-classification",
          classification: "Wolf",
          controller: "you",
        },
      },
    }),

  // #88 - Triggered counter
  "COUNTERATTACK Whenever this character is challenged, deal {d} damage to the challenging character before the challenge.":
    manualEntry({
      text: "COUNTERATTACK Whenever this character is challenged, deal {d} damage to the challenging character before the challenge.",
      name: "COUNTERATTACK",
      ability: {
        type: "triggered",
        trigger: { event: "challenged", timing: "whenever", on: "SELF" },
        effect: {
          type: "deal-damage",
          amount: 0,
          target: "challenging-character",
        },
      },
    }),

  // #89 - Mass exert with lore
  "Exert all opposing characters. Gain {d} lore for each character exerted this way.":
    manualEntry({
      text: "Exert all opposing characters. Gain {d} lore for each character exerted this way.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "exert",
              target: { selector: "all", controller: "opponent" },
            },
            {
              type: "gain-lore",
              amount: { type: "characters-exerted-this-way" },
            },
          ],
        },
      },
    }),

  // #90 - Double keyword location
  "SAFE HAVEN Characters gain Ward while here. SANCTUARY Characters can't be challenged while here.":
    manualEntries([
      {
        text: "SAFE HAVEN Characters gain Ward while here.",
        name: "SAFE HAVEN",
        ability: {
          type: "static",
          effect: { type: "gain-keyword", keyword: "Ward" },
          affects: "characters-here",
        },
      },
      {
        text: "SANCTUARY Characters can't be challenged while here.",
        name: "SANCTUARY",
        ability: {
          type: "static",
          effect: { type: "restriction", restriction: "cant-be-challenged" },
          affects: "characters-here",
        },
      },
    ]),

  // #91 - Draw for opponent hand
  "Draw cards equal to the number of cards in an opponent's hand.": manualEntry(
    {
      text: "Draw cards equal to the number of cards in an opponent's hand.",
      ability: {
        type: "action",
        effect: {
          type: "draw",
          amount: { type: "cards-in-hand", controller: "opponent" },
          target: "CONTROLLER",
        },
      },
    },
  ),

  // #92 - Conditional strength boost
  "Chosen character gets +{d} {S} this turn. If that character has Rush, it gets +{d} {S} instead.":
    manualEntry({
      text: "Chosen character gets +{d} {S} this turn. If that character has Rush, it gets +{d} {S} instead.",
      ability: {
        type: "action",
        effect: {
          type: "conditional",
          condition: { type: "target-has-keyword", keyword: "Rush" },
          then: {
            type: "modify-stat",
            stat: "strength",
            modifier: 0,
            target: { selector: "chosen" },
            duration: "this-turn",
          },
          else: {
            type: "modify-stat",
            stat: "strength",
            modifier: 0,
            target: { selector: "chosen" },
            duration: "this-turn",
          },
        },
      },
    }),

  // #93 - Item recursion
  "Return chosen item from your discard to your hand. You may play an item with cost {d} or less for free.":
    manualEntry({
      text: "Return chosen item from your discard to your hand. You may play an item with cost {d} or less for free.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-from-discard",
              cardType: "item",
              target: "CONTROLLER",
            },
            {
              type: "optional",
              effect: {
                type: "play-card",
                from: "hand",
                cardType: "item",
                costRestriction: { comparison: "less-or-equal", value: 0 },
                cost: "free",
              },
            },
          ],
        },
      },
    }),

  // #94 - Triggered on shift
  "PERFECT TRANSFORMATION When you play this character using Shift, deal {d} damage to each opposing character.":
    manualEntry({
      text: "PERFECT TRANSFORMATION When you play this character using Shift, deal {d} damage to each opposing character.",
      name: "PERFECT TRANSFORMATION",
      ability: {
        type: "triggered",
        trigger: { event: "play", timing: "when", on: "SELF" },
        effect: {
          type: "deal-damage",
          amount: 0,
          target: { selector: "all", controller: "opponent" },
        },
        condition: { type: "used-shift" },
      },
    }),

  // #95 - Mass damage action
  "Deal {d} damage to each character. Each player draws a card for each of their characters banished this way.":
    manualEntry({
      text: "Deal {d} damage to each character. Each player draws a card for each of their characters banished this way.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "deal-damage", amount: 0, target: { selector: "all" } },
            {
              type: "for-each-player",
              effect: {
                type: "draw",
                amount: {
                  type: "characters-banished-this-way",
                  controller: "that-player",
                },
                target: "that-player",
              },
            },
          ],
        },
      },
    }),

  // #96 - Static willpower based on damage
  "BATTLE HARDENED This character gets +{d} {W} for each damage counter on it.":
    manualEntry({
      text: "BATTLE HARDENED This character gets +{d} {W} for each damage counter on it.",
      name: "BATTLE HARDENED",
      ability: {
        type: "static",
        effect: {
          type: "modify-stat",
          stat: "willpower",
          modifier: { type: "damage-on-self" },
          target: "SELF",
        },
      },
    }),

  // #97 - Triggered card under manipulation
  "GATHER POWER Whenever you play a character, you may put the top card of your deck under this character. UNLEASH At the end of your turn, draw a card for each card under this character.":
    manualEntries([
      {
        text: "GATHER POWER Whenever you play a character, you may put the top card of your deck under this character.",
        name: "GATHER POWER",
        ability: {
          type: "triggered",
          trigger: {
            event: "play",
            timing: "whenever",
            on: { controller: "you", cardType: "character" },
          },
          effect: {
            type: "optional",
            effect: { type: "put-under", source: "top-of-deck", under: "self" },
          },
        },
      },
      {
        text: "UNLEASH At the end of your turn, draw a card for each card under this character.",
        name: "UNLEASH",
        ability: {
          type: "triggered",
          trigger: { event: "end-turn", timing: "at", on: "YOU" },
          effect: {
            type: "for-each",
            counter: { type: "cards-under-self" },
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
          },
        },
      },
    ]),

  // #98 - Location with quest effect
  "RALLY POINT Whenever a character of yours quests while here, gain {d} additional lore. STAGING AREA Move costs for your characters to move here are reduced by {d}.":
    manualEntries([
      {
        text: "RALLY POINT Whenever a character of yours quests while here, gain {d} additional lore.",
        name: "RALLY POINT",
        ability: {
          type: "triggered",
          trigger: {
            event: "quest",
            timing: "whenever",
            on: "YOUR_CHARACTERS",
            atLocation: "this",
          },
          effect: { type: "gain-lore", amount: 0 },
        },
      },
      {
        text: "STAGING AREA Move costs for your characters to move here are reduced by {d}.",
        name: "STAGING AREA",
        ability: {
          type: "static",
          effect: { type: "reduce-move-cost", amount: 0 },
          affects: { controller: "you", movingTo: "this" },
        },
      },
    ]),

  // #99 - Cost manipulation
  "Chosen character costs {d} less to play this turn. You may play that character.":
    manualEntry({
      text: "Chosen character costs {d} less to play this turn. You may play that character.",
      ability: {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "cost-reduction",
              target: { selector: "chosen-from-hand" },
              amount: 0,
              duration: "this-turn",
            },
            {
              type: "optional",
              effect: {
                type: "play-card",
                from: "hand",
                target: "chosen-for-effect",
              },
            },
          ],
        },
      },
    }),

  // #100 - Complex lore race
  "If you have less lore than each opponent, draw {d} cards. Otherwise, each opponent draws a card.":
    manualEntry({
      text: "If you have less lore than each opponent, draw {d} cards. Otherwise, each opponent draws a card.",
      ability: {
        type: "action",
        effect: {
          type: "conditional",
          condition: {
            type: "comparison",
            left: { type: "lore", controller: "you" },
            comparison: "less-than",
            right: { type: "lore", controller: "opponent" },
          },
          then: { type: "draw", amount: 0, target: "CONTROLLER" },
          else: { type: "draw", amount: 1, target: "EACH_OPPONENT" },
        },
      },
    }),
};

/**
 * Manual entries for complex card texts (indexed by card name)
 *
 * Maps card names to their manual JSON representations.
 * Used when text matching is difficult or unreliable.
 */
export const MANUAL_ENTRIES_BY_NAME: Record<string, ManualEntry> = {
  // Add entries here as needed
};

/**
 * Check if a text is marked as too complex to parse generically
 *
 * @param text - Normalized text to check
 * @param cardName - Optional card name context for lookup
 * @returns true if the text exists in MANUAL_ENTRIES or MANUAL_ENTRIES_BY_NAME
 */
export function tooComplexText(text: string, cardName?: string): boolean {
  if (cardName && cardName in MANUAL_ENTRIES_BY_NAME) {
    return true;
  }
  return text in MANUAL_ENTRIES;
}

/**
 * Get the manual entry for a complex text
 *
 * @param text - Normalized text to look up
 * @param cardName - Optional card name context for lookup
 * @returns The manual entry if it exists (single or array), undefined otherwise
 */
export function getManualEntry(
  text: string,
  cardName?: string,
): ManualEntry | undefined {
  if (cardName && MANUAL_ENTRIES_BY_NAME[cardName]) {
    return MANUAL_ENTRIES_BY_NAME[cardName];
  }
  return MANUAL_ENTRIES[text];
}

/**
 * Get all manual entries as an array (flattens single entries)
 *
 * @param text - Normalized text to look up
 * @param cardName - Optional card name context for lookup
 * @returns Array of AbilityWithText entries, or undefined if not found
 */
export function getManualEntries(
  text: string,
  cardName?: string,
): AbilityWithText[] | undefined {
  const entry = getManualEntry(text, cardName);
  if (!entry) return undefined;
  return Array.isArray(entry) ? entry : [entry];
}

/**
 * Resolve numeric values in a manual override entry using original card text
 *
 * This function extracts numeric values from the original card text and:
 * 1. Replaces `{d}` placeholders in text fields with actual values
 * 2. Replaces `0` values in numeric fields that correspond to {d} placeholders
 *
 * Note: This function uses heuristics to match values to fields. For safety,
 * it only replaces values when the pattern matches and values are available.
 *
 * @param entry - Manual override entry (single or array)
 * @param originalText - Original card text with actual numbers
 * @param normalizedText - Normalized text with {d} placeholders (key in MANUAL_ENTRIES)
 * @returns Resolved entry with actual numeric values, or original entry if resolution fails
 */
export function resolveManualOverrideValues(
  entry: ManualEntry,
  originalText: string,
  normalizedText: string,
): ManualEntry {
  // Extract numeric values from original text
  const values = extractNumericValues(originalText, normalizedText);

  // If extraction failed, return entry as-is
  if (values.length === 0) {
    return entry;
  }

  // Deep clone the entry to avoid mutating the original
  const resolved = JSON.parse(JSON.stringify(entry)) as ManualEntry;

  // Replace {d} in text fields and 0 in numeric fields
  let valueIndex = 0;

  function replacePlaceholders(obj: any, depth = 0): void {
    if (typeof obj !== "object" || obj === null) {
      return;
    }

    // First, replace {d} in text fields
    if (typeof obj.text === "string" && obj.text.includes("{d}")) {
      // Replace {d} placeholders in text
      obj.text = obj.text.replace(/\{d\}/g, () => {
        if (valueIndex < values.length) {
          return values[valueIndex++].toString();
        }
        return "{d}";
      });
    }

    // Then, handle numeric fields
    // Common fields that might have placeholders: amount, value, modifier, size, count, ink
    const numericFields = [
      "amount",
      "value",
      "modifier",
      "size",
      "count",
      "ink",
    ];
    for (const field of numericFields) {
      if (
        typeof obj[field] === "number" &&
        obj[field] === 0 &&
        valueIndex < values.length
      ) {
        // Replace 0 with extracted value
        obj[field] = values[valueIndex++];
      }
    }

    // Recursively process nested objects and arrays
    for (const key in obj) {
      if (key !== "text" && !numericFields.includes(key)) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any) => replacePlaceholders(item, depth + 1));
        } else if (typeof obj[key] === "object") {
          replacePlaceholders(obj[key], depth + 1);
        }
      }
    }
  }

  if (Array.isArray(resolved)) {
    resolved.forEach((item) => replacePlaceholders(item));
  } else {
    replacePlaceholders(resolved);
  }

  return resolved;
}

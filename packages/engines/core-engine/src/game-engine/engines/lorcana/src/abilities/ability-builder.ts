import { v4 as uuid } from "uuid";
import { detectAbilityType } from "../examples/ability-type-mapping";
import { CardTextParser, ParsedAbility } from "../examples/card-text-parser";
import type { LorcanaZone } from "../lorcana-engine-types";
import type {
  Ability,
  AbilityCondition,
  AbilityCost,
  AbilityTarget,
  AbilityType,
  Classification,
  Effect,
  EffectParameters,
  EffectType,
  Keyword,
  KeywordAbility,
  ShiftAbility,
  Target,
  TriggerTiming,
} from "./ability-types";

/**
 * AbilityBuilder class that transforms card text into structured Ability objects
 */
export class AbilityBuilder {
  /**
   * Builds an Ability object from card text
   * @param cardText The raw card text to parse
   * @param name Optional name for the ability
   * @returns A structured Ability object
   */
  static buildAbility(cardText: string, name?: string): Ability | null {
    if (!cardText) return null;

    const parsedAbility = CardTextParser.parseAbility(cardText);
    if (!parsedAbility.abilityType) return null;

    return {
      type: parsedAbility.abilityType,
      text: parsedAbility.text,
      name,
      targets: parsedAbility.hasTarget
        ? AbilityBuilder.extractTargets(cardText)
        : undefined,
      cost: parsedAbility.hasCost
        ? AbilityBuilder.extractCost(cardText)
        : undefined,
      effects: AbilityBuilder.extractEffects(cardText),
      timing:
        parsedAbility.abilityType === "triggered"
          ? AbilityBuilder.extractTiming(cardText)
          : undefined,
      keyword:
        parsedAbility.abilityType === "keyword"
          ? AbilityBuilder.extractKeyword(cardText)
          : undefined,
      condition: parsedAbility.hasCondition
        ? AbilityBuilder.extractCondition(cardText)
        : undefined,
      optional: cardText.includes(" may "),
      shift: cardText.includes("Shift")
        ? AbilityBuilder.extractShiftAbility(cardText)
        : undefined,
      classification: AbilityBuilder.extractClassifications(cardText),
    };
  }

  /**
   * Builds an array of Ability objects from card text that might contain multiple abilities
   * @param cardText The raw card text to parse
   * @returns An array of structured Ability objects
   */
  static buildAbilities(cardText: string): Ability[] {
    if (!cardText) return [];

    const parsedAbilities = CardTextParser.parseCardText(cardText);
    return parsedAbilities
      .map((parsedAbility, index) => {
        return AbilityBuilder.buildAbility(parsedAbility.text);
      })
      .filter((ability): ability is Ability => ability !== null);
  }

  /**
   * Extracts targets from ability text
   * @param text The ability text to analyze
   * @returns Array of AbilityTarget objects
   */
  static extractTargets(text: string): AbilityTarget[] {
    const targets: AbilityTarget[] = [];

    // Extract common target patterns
    if (text.includes("chosen character")) {
      const target: AbilityTarget = {
        type: "card",
        zone: "play" as LorcanaZone,
        filter: { cardType: "character" },
      };

      // Add target modifiers
      if (text.includes("chosen character of yours")) {
        target.controller = "self";
      } else if (text.includes("chosen opposing character")) {
        target.controller = "opponent";
      }

      if (text.includes("chosen damaged character")) {
        target.damaged = true;
      }

      if (text.includes("chosen ready character")) {
        target.ready = true;
      }

      if (text.includes("chosen exerted character")) {
        target.exerted = true;
      }

      if (text.includes("chosen another character")) {
        target.excludeSelf = true;
      }

      // Check for specific classification
      const classificationMatch = text.match(/chosen (\w+) character/);
      if (classificationMatch && classificationMatch[1]) {
        const classification = classificationMatch[1];
        // Check if it's a classification and not just a descriptor
        const validClassifications = [
          "Ally",
          "Hero",
          "Villain",
          "Prince",
          "Princess",
          "King",
          "Queen",
          "Floodborn",
        ];
        if (validClassifications.includes(classification)) {
          target.withClassification = classification;
        }
      }

      // Check for minimum strength requirement
      const minStrengthMatch = text.match(
        /chosen character with (\d+) \{S\} or more/,
      );
      if (minStrengthMatch && minStrengthMatch[1]) {
        target.minStrength = Number.parseInt(minStrengthMatch[1], 10);
      }

      // Check for maximum strength requirement
      const maxStrengthMatch = text.match(
        /chosen character with (\d+) \{S\} or less/,
      );
      if (maxStrengthMatch && maxStrengthMatch[1]) {
        target.maxStrength = Number.parseInt(maxStrengthMatch[1], 10);
      }

      targets.push(target);
    }

    // Check for item targets
    if (text.includes("chosen item")) {
      const target: AbilityTarget = {
        type: "card",
        zone: "play" as LorcanaZone,
        filter: { cardType: "item" },
      };

      if (text.includes("chosen item of yours")) {
        target.controller = "self";
      }

      targets.push(target);
    }

    // Check for location targets
    if (text.includes("chosen location")) {
      targets.push({
        type: "location",
        zone: "play" as LorcanaZone,
      });
    }

    // Check for player targets
    if (text.includes("each opponent")) {
      targets.push({
        type: "player",
        value: "opponent",
      });
    }

    // Check for "all" targets
    if (text.includes("all characters")) {
      const target: AbilityTarget = {
        type: "card",
        zone: "play" as LorcanaZone,
        filter: { cardType: "character" },
        targetAll: true,
      };

      targets.push(target);
    }

    if (text.includes("your characters")) {
      const target: AbilityTarget = {
        type: "card",
        zone: "play" as LorcanaZone,
        filter: { cardType: "character" },
        controller: "self",
        targetAll: true,
      };

      targets.push(target);
    }

    // Handle "up to N" targets
    const upToNMatch = text.match(/up to (\d+) chosen characters/i);
    if (upToNMatch && upToNMatch[1]) {
      const count = Number.parseInt(upToNMatch[1], 10);
      const target: AbilityTarget = {
        type: "card",
        zone: "play" as LorcanaZone,
        filter: { cardType: "character" },
        count,
      };

      targets.push(target);
    }

    return targets;
  }

  /**
   * Extracts costs from ability text
   * @param text The ability text to analyze
   * @returns AbilityCost object
   */
  static extractCost(text: string): AbilityCost {
    const cost: AbilityCost = {};

    // Split the text to isolate the cost section for activated abilities
    const parts = text.split(/[-–—]/); // Handle different dash characters
    if (parts.length < 2 && !text.includes("to ")) {
      // Not an activated ability with standard cost format
      return cost;
    }

    let costText = "";
    if (parts.length >= 2 && (text.includes("{E}") || text.includes("{I}"))) {
      // Format: "{E} - Effect" or "{E}, {I} - Effect"
      costText = parts[0].trim();
    } else if (text.includes("to ")) {
      // Format: "Banish chosen item of yours to deal 5 damage..."
      const toParts = text.split(" to ");
      if (toParts.length >= 2) {
        costText = toParts[0].trim();
      }
    }

    // Handle exert cost
    if (costText.includes("{E}")) {
      cost.exert = true;
    }

    // Handle ink cost
    const inkMatch = costText.match(/(\d+)\s*\{I\}/);
    if (inkMatch && inkMatch[1]) {
      cost.ink = Number.parseInt(inkMatch[1], 10);
    }

    // Handle banish cost
    if (costText.includes("Banish")) {
      if (
        costText.includes("Banish this") ||
        costText.includes("Banish yourself")
      ) {
        cost.banish = { type: "self" };
      } else if (costText.includes("Banish chosen item")) {
        cost.banish = { type: "item", count: 1 };
      } else if (costText.includes("Banish chosen character")) {
        cost.banish = { type: "character", count: 1 };
      } else {
        // Generic banish
        cost.banish = true;
      }

      // Check for count in banish cost
      const banishCountMatch = costText.match(/Banish (\d+)/);
      if (
        banishCountMatch &&
        banishCountMatch[1] &&
        typeof cost.banish !== "boolean"
      ) {
        const count = Number.parseInt(banishCountMatch[1], 10);
        cost.banish.count = count;
      }
    }

    // Handle discard cost
    if (costText.includes("discard")) {
      const discardMatch = costText.match(
        /(Choose and )?discard (?:(\d+)|a|an)( [a-z]+)?/,
      );
      if (discardMatch) {
        // Check if there's a number specified
        if (discardMatch[2]) {
          cost.discard = Number.parseInt(discardMatch[2], 10);
        } else {
          cost.discard = 1;
        }

        // Check for card type specification
        if (discardMatch[3]) {
          const cardType = discardMatch[3].trim();
          cost.discard = {
            type: cardType as "character" | "item" | "action" | "song",
            count: typeof cost.discard === "number" ? cost.discard : 1,
          };
        }
      }
    }

    // Handle damage cost
    if (costText.includes("damage")) {
      const damageMatch = costText.match(/Deal (\d+) damage/);
      if (damageMatch && damageMatch[1]) {
        cost.damage = Number.parseInt(damageMatch[1], 10);
      }
    }

    // Handle put into inkwell cost
    if (costText.includes("Put") && costText.includes("into your inkwell")) {
      cost.putIntoInkwell = true;

      // Check for facedown
      if (costText.includes("facedown")) {
        cost.putIntoInkwell = { facedown: true };
      }

      // Check for count
      const inkwellCountMatch = costText.match(/Put (\d+) cards?/);
      if (inkwellCountMatch && inkwellCountMatch[1]) {
        const count = Number.parseInt(inkwellCountMatch[1], 10);
        if (typeof cost.putIntoInkwell === "boolean") {
          cost.putIntoInkwell = { count };
        } else {
          cost.putIntoInkwell.count = count;
        }
      }
    }

    // Handle return to hand cost
    if (
      (costText.includes("Return") || costText.includes("return")) &&
      (costText.includes("to your hand") ||
        costText.includes("to its owner's hand"))
    ) {
      cost.returnToHand = true;
    }

    // Handle pay life cost
    const payLifeMatch = costText.match(/Pay (\d+) life/);
    if (payLifeMatch && payLifeMatch[1]) {
      cost.payLife = Number.parseInt(payLifeMatch[1], 10);
    }

    // Handle choose not to draw cost
    if (
      costText.includes("choose not to draw") ||
      costText.includes("Choose not to draw")
    ) {
      cost.chooseNotToDraw = true;
    }

    return cost;
  }

  /**
   * Extracts effects from ability text
   * @param text The ability text to analyze
   * @returns Array of Effect objects
   */
  static extractEffects(text: string): Effect[] {
    const effects: Effect[] = [];
    const cleanText = text.trim();

    // Skip the trigger part for triggered abilities
    let effectText = cleanText;
    if (
      cleanText.startsWith("When") ||
      cleanText.startsWith("Whenever") ||
      cleanText.startsWith("At the")
    ) {
      const commaIndex = cleanText.indexOf(",");
      if (commaIndex !== -1) {
        effectText = cleanText.substring(commaIndex + 1).trim();
      }
    }

    // Skip cost part for activated abilities
    if (
      cleanText.includes("—") ||
      cleanText.includes("-") ||
      cleanText.includes("–")
    ) {
      const parts = cleanText.split(/[-–—]/);
      if (parts.length > 1) {
        effectText = parts[1].trim();
      }
    }

    // Check for common effects

    // Gain lore effect
    if (effectText.includes("gain") && effectText.includes("lore")) {
      const loreMatch = /gain (\d+) lore/i.exec(effectText);
      if (loreMatch && loreMatch[1]) {
        effects.push({
          type: "gainLore",
          parameters: {
            value: Number.parseInt(loreMatch[1], 10),
          },
        });
      }
    }

    // Deal damage effect
    if (effectText.includes("deal") && effectText.includes("damage")) {
      const damageMatch = /deal (\d+) damage/i.exec(effectText);
      if (damageMatch && damageMatch[1]) {
        effects.push({
          type: "dealDamage",
          parameters: {
            value: Number.parseInt(damageMatch[1], 10),
          },
        });
      }
    }

    // Draw cards effect
    if (
      effectText.includes("draw") &&
      (effectText.includes("card") || effectText.includes("cards"))
    ) {
      const drawMatch = /draw (\d+) cards?/i.exec(effectText);
      if (drawMatch && drawMatch[1]) {
        effects.push({
          type: "draw",
          parameters: {
            value: Number.parseInt(drawMatch[1], 10),
          },
        });
      } else if (effectText.includes("draw a card")) {
        effects.push({
          type: "draw",
          parameters: {
            value: 1,
          },
        });
      }
    }

    // Modify strength effect
    if (
      (effectText.includes("gets +") || effectText.includes("gets -")) &&
      effectText.includes("{S}")
    ) {
      const strengthMatch = /gets ([+-]\d+) \{S\}/i.exec(effectText);
      if (strengthMatch && strengthMatch[1]) {
        effects.push({
          type: "modifyStat",
          parameters: {
            stat: "strength",
            value: Number.parseInt(strengthMatch[1], 10), // This will correctly handle both + and -
          },
        });
      }
    }

    // Modify willpower effect
    if (
      (effectText.includes("gets +") || effectText.includes("gets -")) &&
      effectText.includes("{W}")
    ) {
      const willpowerMatch = /gets ([+-]\d+) \{W\}/i.exec(effectText);
      if (willpowerMatch && willpowerMatch[1]) {
        effects.push({
          type: "modifyStat",
          parameters: {
            stat: "willpower",
            value: Number.parseInt(willpowerMatch[1], 10),
          },
        });
      }
    }

    // Modify lore effect
    if (
      (effectText.includes("gets +") || effectText.includes("gets -")) &&
      effectText.includes("{L}")
    ) {
      const loreMatch = /gets ([+-]\d+) \{L\}/i.exec(effectText);
      if (loreMatch && loreMatch[1]) {
        effects.push({
          type: "modifyStat",
          parameters: {
            stat: "lore",
            value: Number.parseInt(loreMatch[1], 10),
          },
        });
      }
    }

    // Add keyword effect
    const keywordGainPattern =
      /gains? ([\w\s]+)(?: until | this turn| for the rest)/i;
    const keywordMatch = keywordGainPattern.exec(effectText);
    if (keywordMatch && keywordMatch[1]) {
      const keywordText = keywordMatch[1].trim();
      const keyword = AbilityBuilder.extractKeyword(keywordText);
      if (keyword) {
        effects.push({
          type: "addKeyword",
          parameters: {
            keyword: keyword.type,
            keywordValue: keyword.value,
          },
          duration: effectText.includes("this turn")
            ? { type: "endOfTurn" }
            : undefined,
        });
      }
    }

    // Banish effect
    if (effectText.includes("banish")) {
      effects.push({
        type: "banish",
        parameters: {},
      });
    }

    // Exert effect
    if (effectText.includes("exert")) {
      effects.push({
        type: "exert",
        parameters: {},
      });
    }

    // Ready effect
    if (effectText.includes("ready")) {
      effects.push({
        type: "ready",
        parameters: {},
      });
    }

    // If no specific effects were identified, use a generic effect
    if (effects.length === 0) {
      effects.push({
        type: "multiEffect", // Generic container for complex effects
        parameters: {
          effects: [], // This would be populated with more specific effects in a full implementation
        },
      });
    }

    // Apply duration to all effects if not already specified
    if (effectText.includes("this turn")) {
      effects.forEach((effect) => {
        if (!effect.duration) {
          effect.duration = { type: "endOfTurn" };
        }
      });
    } else if (effectText.includes("until the start of your next turn")) {
      effects.forEach((effect) => {
        if (!effect.duration) {
          effect.duration = { type: "turns", count: 1 };
        }
      });
    } else if (
      effectText.includes("until") &&
      effectText.includes("leaves play")
    ) {
      effects.forEach((effect) => {
        if (!effect.duration) {
          effect.duration = { type: "untilLeaves" };
        }
      });
    }

    return effects;
  }

  /**
   * Extracts timing information from triggered ability text
   * @param text The ability text to analyze
   * @returns TriggerTiming value if identifiable
   */
  static extractTiming(text: string): TriggerTiming | undefined {
    const cleanText = text.trim();

    // Match common trigger patterns
    if (cleanText.startsWith("When you play this character")) {
      return "onPlay";
    }

    if (cleanText.startsWith("When this character is played")) {
      return "onPlay";
    }

    if (cleanText.startsWith("Whenever you play a character")) {
      return "onPlayCharacter";
    }

    if (cleanText.startsWith("Whenever you play an item")) {
      return "onPlayItem";
    }

    if (cleanText.startsWith("Whenever you play an action")) {
      return "onPlayAction";
    }

    if (cleanText.startsWith("Whenever you play a song")) {
      return "onPlaySong";
    }

    if (
      cleanText.includes("this character quests") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onQuest";
    }

    if (
      cleanText.startsWith("Whenever a character quests") ||
      cleanText.startsWith("Whenever one of your characters quests")
    ) {
      return "onCharacterQuests";
    }

    if (
      cleanText.includes("put into your inkwell") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onPutIntoInkwell";
    }

    if (
      (cleanText.includes("this character challenges") ||
        cleanText.includes("this character is challenging")) &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onChallenge";
    }

    if (
      cleanText.includes("this character is challenged") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onChallenged";
    }

    if (
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever")) &&
      cleanText.includes("character challenges")
    ) {
      return "onCharacterChallenges";
    }

    if (cleanText.startsWith("When this character is banished")) {
      return "onBanish";
    }

    if (
      cleanText.startsWith("When this character is banished in a challenge")
    ) {
      return "onBanishInChallenge";
    }

    if (
      cleanText.includes("one of your other characters is banished") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onOtherBanished";
    }

    if (
      cleanText.includes("this character is damaged") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onDamage";
    }

    if (
      cleanText.includes("this character deals damage") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onDealDamage";
    }

    if (
      cleanText.includes("damage is removed") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onDamageRemoved";
    }

    if (
      cleanText.includes("this character moves") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onMove";
    }

    if (
      cleanText.includes("you ready this character") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onReady";
    }

    if (
      cleanText.includes("you exert this character") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onExert";
    }

    if (
      cleanText.includes("player activates an ability") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onActivatedAbility";
    }

    if (
      (cleanText.includes("you draw a card") ||
        cleanText.includes("you draw cards")) &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onCardDrawn";
    }

    if (
      cleanText.includes("you discard") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onDiscard";
    }

    if (
      cleanText.includes("opponent discards") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onOpponentDiscard";
    }

    if (cleanText.startsWith("At the start of your turn")) {
      return "startOfTurn";
    }

    if (cleanText.startsWith("At the end of your turn")) {
      return "endOfTurn";
    }

    if (
      cleanText.includes("this character leaves play") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "whenLeaves";
    }

    if (
      cleanText.includes("this character moves to a location") &&
      (cleanText.startsWith("When") || cleanText.startsWith("Whenever"))
    ) {
      return "onMoveToLocation";
    }

    if (cleanText.startsWith("While this character is at a location")) {
      return "whileAtLocation";
    }

    if (cleanText.startsWith("While this character is exerted")) {
      return "whileExerted";
    }

    if (cleanText.startsWith("While this character has damage")) {
      return "whileHasDamage";
    }

    if (cleanText.startsWith("While this character has no damage")) {
      return "whileNoDamage";
    }

    if (cleanText.startsWith("While you have a character in play")) {
      return "whileCharacterInPlay";
    }

    if (cleanText.startsWith("While this character is challenging")) {
      return "whileChallenging";
    }

    if (cleanText.startsWith("While this character is being challenged")) {
      return "whileChallenged";
    }

    if (
      cleanText.includes("you used Shift to play") &&
      (cleanText.startsWith("When") || cleanText.startsWith("If"))
    ) {
      return "onShift";
    }

    return undefined;
  }

  /**
   * Extracts keyword information from ability text
   * @param text The ability text to analyze
   * @returns KeywordAbility object if a keyword is identified
   */
  static extractKeyword(text: string): KeywordAbility | undefined {
    const cleanText = text.trim();

    // List of valid keywords (sorted by length to avoid partial matches)
    const keywords: Keyword[] = [
      "Universal Shift",
      "Puppy Shift",
      "Challenger",
      "Bodyguard",
      "Reckless",
      "Evasive",
      "Support",
      "Vanish",
      "Singer",
      "Resist",
      "Shift",
      "Rush",
      "Ward",
    ].sort((a, b) => b.length - a.length) as Keyword[];

    // Check for each keyword
    for (const keyword of keywords) {
      // Exact match
      if (cleanText === keyword) {
        return { type: keyword };
      }

      // Check for keyword with value (e.g., "Challenger +2")
      const valueMatch = new RegExp(`^${keyword}\\s*\\+(\\d+)$`).exec(
        cleanText,
      );
      if (valueMatch && valueMatch[1]) {
        return {
          type: keyword,
          value: Number.parseInt(valueMatch[1], 10),
        };
      }

      // Check for keyword with numeric value (e.g., "Shift 3")
      const numericMatch = new RegExp(`^${keyword}\\s+(\\d+)$`).exec(cleanText);
      if (numericMatch && numericMatch[1]) {
        return {
          type: keyword,
          value: Number.parseInt(numericMatch[1], 10),
        };
      }

      // Check for keyword at start with explanation in parentheses
      if (cleanText.startsWith(keyword) && cleanText.includes("(")) {
        // Extract just the keyword part before the parentheses
        const parenthesesIndex = cleanText.indexOf("(");
        const keywordPart = cleanText.substring(0, parenthesesIndex).trim();

        // Check again for possible values
        const valueWithExplanationMatch = new RegExp(
          `^${keyword}\\s*\\+(\\d+)$`,
        ).exec(keywordPart);
        if (valueWithExplanationMatch && valueWithExplanationMatch[1]) {
          return {
            type: keyword,
            value: Number.parseInt(valueWithExplanationMatch[1], 10),
          };
        }

        // If no value, return just the keyword
        if (keywordPart === keyword) {
          return { type: keyword };
        }
      }
    }

    return undefined;
  }

  /**
   * Extracts condition information from ability text
   * @param text The ability text to analyze
   * @returns AbilityCondition object if a condition is identified
   */
  static extractCondition(text: string): AbilityCondition | undefined {
    const cleanText = text.trim();

    // Check for common condition patterns

    // Character enters play
    if (
      cleanText.includes("when you play this character") ||
      cleanText.includes("when this character enters play")
    ) {
      return {
        type: "onEnterPlay",
      };
    }

    // If character quests
    if (
      cleanText.includes("when this character quests") ||
      cleanText.includes("whenever this character quests")
    ) {
      return {
        type: "onQuest",
      };
    }

    // If character is banished
    if (cleanText.includes("when this character is banished")) {
      return {
        type: "onBanish",
      };
    }

    // If character challenges
    if (
      cleanText.includes("when this character challenges") ||
      cleanText.includes("whenever this character challenges")
    ) {
      return {
        type: "onChallenge",
      };
    }

    // If character is damaged
    if (
      cleanText.includes("when this character is damaged") ||
      cleanText.includes("whenever this character is damaged")
    ) {
      return {
        type: "onDamage",
      };
    }

    // If action is played
    if (
      cleanText.includes("when you play an action") ||
      cleanText.includes("whenever you play an action")
    ) {
      return {
        type: "onPlayAction",
      };
    }

    // If song is played
    if (
      cleanText.includes("when you play a song") ||
      cleanText.includes("whenever you play a song")
    ) {
      return {
        type: "onPlaySong",
      };
    }

    // If character is played
    if (
      cleanText.includes("when you play a character") ||
      cleanText.includes("whenever you play a character")
    ) {
      return {
        type: "onPlayCharacter",
      };
    }

    // If character is exerted
    if (
      cleanText.includes("when you exert this character") ||
      cleanText.includes("whenever you exert this character")
    ) {
      return {
        type: "onExert",
      };
    }

    // If you draw a card
    if (
      cleanText.includes("when you draw") ||
      cleanText.includes("whenever you draw")
    ) {
      return {
        type: "onDraw",
      };
    }

    // Having specific card in play
    if (cleanText.includes("if you have") && cleanText.includes("in play")) {
      const cardNameMatch = /if you have (?:a|an) ([\w\s]+) in play/i.exec(
        cleanText,
      );
      if (cardNameMatch && cardNameMatch[1]) {
        return {
          type: "cardInPlay",
          cardName: cardNameMatch[1].trim(),
        };
      }

      // Check for classification
      const classificationMatch =
        /if you have (?:a|an) ([\w\s]+) character in play/i.exec(cleanText);
      if (classificationMatch && classificationMatch[1]) {
        return {
          type: "cardInPlay",
          classification: classificationMatch[1].trim() as Classification,
        };
      }
    }

    // Having a minimum number of characters
    if (
      cleanText.includes("if you have") &&
      /\d+/.test(cleanText) &&
      cleanText.includes("or more")
    ) {
      const countMatch = /if you have (\d+) or more/i.exec(cleanText);
      if (countMatch && countMatch[1]) {
        return {
          type: "minCharactersInPlay",
          value: Number.parseInt(countMatch[1], 10),
        };
      }
    }

    // Having no damage
    if (
      cleanText.includes("if this character has no damage") ||
      cleanText.includes("while this character has no damage")
    ) {
      return {
        type: "noDamage",
      };
    }

    // Having damage
    if (
      cleanText.includes("if this character has damage") ||
      cleanText.includes("while this character has damage")
    ) {
      return {
        type: "hasDamage",
      };
    }

    // If opponent has exerted character
    if (
      cleanText.includes("if an opponent has an exerted character") ||
      cleanText.includes("if your opponent has an exerted character")
    ) {
      return {
        type: "opponentHasExertedCharacter",
      };
    }

    // If damage was dealt this turn
    if (
      cleanText.includes("if damage was dealt this turn") ||
      cleanText.includes("if this character dealt damage this turn")
    ) {
      return {
        type: "damageThisTurn",
      };
    }

    // Active player only
    if (cleanText.includes("during your turn")) {
      return {
        type: "activePlayerOnly",
      };
    }

    // During opponent's turn
    if (
      cleanText.includes("during an opponent's turn") ||
      cleanText.includes("during your opponent's turn")
    ) {
      return {
        type: "opponentTurn",
      };
    }

    // If used Shift to play
    if (cleanText.includes("if you used Shift to play")) {
      return {
        type: "usedShift",
        requiresShift: true,
      };
    }

    // Card type checks
    if (
      cleanText.includes("if it's a character") ||
      cleanText.includes("if it's an action") ||
      cleanText.includes("if it's an item") ||
      cleanText.includes("if it's a song")
    ) {
      let cardType: "character" | "item" | "action" | "song" | undefined;

      if (cleanText.includes("character")) cardType = "character";
      else if (cleanText.includes("action")) cardType = "action";
      else if (cleanText.includes("item")) cardType = "item";
      else if (cleanText.includes("song")) cardType = "song";

      if (cardType) {
        return {
          type: "cardTypeMatches",
          cardType,
        };
      }
    }

    // If zone has cards
    if (
      cleanText.includes("if your inkwell") ||
      cleanText.includes("if your discard") ||
      cleanText.includes("if your hand")
    ) {
      let zone: LorcanaZone | undefined;

      if (cleanText.includes("inkwell")) zone = "inkwell";
      else if (cleanText.includes("discard")) zone = "discard";
      else if (cleanText.includes("hand")) zone = "hand";

      if (zone) {
        return {
          type: "zoneHasCards",
          zone,
        };
      }
    }

    // Having more lore than opponent
    if (cleanText.includes("if you have more lore than")) {
      return {
        type: "moreLoreCheck",
      };
    }

    return undefined;
  }

  static extractShiftAbility(text: string): ShiftAbility | undefined {
    // Placeholder - will extract shift ability details
    return undefined;
  }

  static extractClassifications(text: string): Classification[] | undefined {
    // Placeholder - will extract classifications mentioned in the text
    return undefined;
  }
}

/**
 * Chevrotain grammar rules for parsing Lorcana abilities.
 * Defines the structure and syntax of ability text.
 */

import { CstParser } from "chevrotain";
import {
  And,
  allTokens,
  Banish,
  Card,
  Cards,
  Character,
  Chosen,
  Comma,
  Damage,
  Deal,
  Discard,
  Draw,
  Exert,
  Gain,
  Identifier,
  Item,
  Lore,
  Lose,
  NumberToken,
  Or,
  Period,
  Ready,
  Return,
  Strength,
  Then,
  This,
  When,
  Whenever,
  Willpower,
} from "../lexer/tokens";

export class LorcanaAbilityParser extends CstParser {
  constructor() {
    super(allTokens, {
      maxLookahead: 3,
      // Skip validations that throw errors for ambiguous alternatives
      // The compositeEffect rule has three alternatives that all start with atomicEffect
      // This is intentional - we rely on the text-based parser as fallback
      skipValidations: true,
    });
    this.performSelfAnalysis();
  }

  /**
   * Top-level ability rule.
   * An ability can be one of: triggered, activated, static, or keyword.
   */
  public ability = this.RULE("ability", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.triggeredAbility) },
      { ALT: () => this.SUBRULE(this.otherAbility) },
    ]);
  });

  /**
   * Non-triggered ability (activated, static, or keyword).
   * These share similar patterns so we consolidate them.
   */
  public otherAbility = this.RULE("otherAbility", () => {
    this.SUBRULE(this.effectPhrase);
    this.OPTION(() => this.CONSUME(Period));
  });

  /**
   * Triggered ability: "When/Whenever <trigger>, <effect>"
   */
  public triggeredAbility = this.RULE("triggeredAbility", () => {
    this.SUBRULE(this.triggerPhrase);
    this.CONSUME(Comma);
    this.SUBRULE(this.effectPhrase);
    this.OPTION(() => this.CONSUME(Period));
  });

  /**
   * Activated ability: Cost and effect (placeholder for now)
   */
  public activatedAbility = this.RULE("activatedAbility", () => {
    // Placeholder: will be expanded in later phases
    this.SUBRULE(this.effectPhrase);
  });

  /**
   * Static ability: Continuous effect (placeholder for now)
   */
  public staticAbility = this.RULE("staticAbility", () => {
    // Placeholder: will be expanded in later phases
    this.SUBRULE(this.effectPhrase);
  });

  /**
   * Keyword ability: Single keyword or keyword with reminder text (placeholder for now)
   */
  public keywordAbility = this.RULE("keywordAbility", () => {
    // Placeholder: will be expanded in later phases
    this.SUBRULE(this.effectPhrase);
  });

  /**
   * Trigger phrase: "When" or "Whenever" followed by trigger event
   */
  public triggerPhrase = this.RULE("triggerPhrase", () => {
    this.OR([
      { ALT: () => this.CONSUME(When) },
      { ALT: () => this.CONSUME(Whenever) },
    ]);
    this.SUBRULE(this.triggerEvent);
  });

  /**
   * Trigger event: What causes the ability to trigger (placeholder for now)
   */
  public triggerEvent = this.RULE("triggerEvent", () => {
    // Placeholder: will be expanded in later phases
    // For now, just consume tokens until comma
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Draw) },
        { ALT: () => this.CONSUME(NumberToken) },
        { ALT: () => this.CONSUME(Identifier) },
        // Add more token types as needed
      ]);
    });
  });

  /**
   * Effect phrase: The effect that happens.
   * Tries composite effects first (more complex), then atomic effects.
   */
  public effectPhrase = this.RULE("effectPhrase", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.compositeEffect) },
      { ALT: () => this.SUBRULE(this.atomicEffect) },
    ]);
  });

  /**
   * Composite effect: Multiple effects, sequences, choices, conditionals, etc.
   * This rule now properly handles composite patterns.
   */
  public compositeEffect = this.RULE("compositeEffect", () => {
    // Try to match composite patterns
    this.OR([
      // Sequence: "X, then Y"
      {
        ALT: () => {
          this.SUBRULE(this.atomicEffect);
          this.CONSUME(Comma);
          this.CONSUME(Then);
          this.SUBRULE2(this.atomicEffect);
          // Optional additional steps
          this.MANY(() => {
            this.CONSUME2(Comma);
            this.CONSUME2(Then);
            this.SUBRULE3(this.atomicEffect);
          });
        },
      },
      // Choice with "or": "X or Y"
      {
        ALT: () => {
          this.SUBRULE4(this.atomicEffect);
          this.CONSUME(Or);
          this.SUBRULE5(this.atomicEffect);
          // Optional additional choices
          this.MANY2(() => {
            this.CONSUME2(Or);
            this.SUBRULE6(this.atomicEffect);
          });
        },
      },
      // Conjunction with "and": "X and Y"
      {
        ALT: () => {
          this.SUBRULE7(this.atomicEffect);
          this.CONSUME(And);
          this.SUBRULE8(this.atomicEffect);
          // Optional additional conjunctions
          this.MANY3(() => {
            this.CONSUME2(And);
            this.SUBRULE9(this.atomicEffect);
          });
        },
      },
    ]);
  });

  /**
   * Atomic effect: Single effect action
   * Delegates to specific effect parsers based on first token
   */
  public atomicEffect = this.RULE("atomicEffect", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.statModEffect) },
      { ALT: () => this.SUBRULE(this.keywordEffect) },
      { ALT: () => this.SUBRULE(this.damageEffect) },
      { ALT: () => this.SUBRULE(this.loreEffect) },
      { ALT: () => this.SUBRULE(this.exertEffect) },
      { ALT: () => this.SUBRULE(this.banishEffect) },
      { ALT: () => this.SUBRULE(this.drawEffect) },
      { ALT: () => this.SUBRULE(this.discardEffect) },
    ]);
  });

  /**
   * Draw effect: "draw <number> card(s)"
   */
  public drawEffect = this.RULE("drawEffect", () => {
    this.CONSUME(Draw);
    this.CONSUME(NumberToken);
    this.OR([
      { ALT: () => this.CONSUME(Card) },
      { ALT: () => this.CONSUME(Cards) },
    ]);
  });

  /**
   * Discard effect: "discard <number> card(s)"
   */
  public discardEffect = this.RULE("discardEffect", () => {
    this.CONSUME(Discard);
    this.CONSUME(NumberToken);
    this.OR([
      { ALT: () => this.CONSUME(Card) },
      { ALT: () => this.CONSUME(Cards) },
    ]);
  });

  /**
   * Damage effect: "deal <number> damage"
   */
  public damageEffect = this.RULE("damageEffect", () => {
    this.CONSUME(Deal);
    this.CONSUME(NumberToken);
    this.CONSUME(Damage);
    // Target will be added in later phases
  });

  /**
   * Lore effect: "gain/lose <number> lore"
   */
  public loreEffect = this.RULE("loreEffect", () => {
    this.OR([
      { ALT: () => this.CONSUME(Gain) },
      { ALT: () => this.CONSUME(Lose) },
    ]);
    this.CONSUME(NumberToken);
    this.CONSUME(Lore);
  });

  /**
   * Exert effect: "exert/ready chosen character"
   */
  public exertEffect = this.RULE("exertEffect", () => {
    this.OR([
      { ALT: () => this.CONSUME(Exert) },
      { ALT: () => this.CONSUME(Ready) },
    ]);
    this.OR2([
      { ALT: () => this.CONSUME(Chosen) },
      { ALT: () => this.CONSUME(This) },
    ]);
    this.CONSUME(Character);
  });

  /**
   * Banish effect: "banish/return chosen character"
   */
  public banishEffect = this.RULE("banishEffect", () => {
    this.OR([
      { ALT: () => this.CONSUME(Banish) },
      { ALT: () => this.CONSUME(Return) },
    ]);
    this.OR2([
      { ALT: () => this.CONSUME(Chosen) },
      { ALT: () => this.CONSUME(This) },
    ]);
    this.OR3([
      { ALT: () => this.CONSUME(Character) },
      { ALT: () => this.CONSUME(Item) },
    ]);
  });

  /**
   * Stat modification effect: "gets +/-<number> strength/willpower/lore"
   */
  public statModEffect = this.RULE("statModEffect", () => {
    this.CONSUME(Identifier); // "gets" or similar
    this.CONSUME(NumberToken);
    this.OR([
      { ALT: () => this.CONSUME(Strength) },
      { ALT: () => this.CONSUME(Willpower) },
      { ALT: () => this.CONSUME(Lore) },
    ]);
  });

  /**
   * Keyword effect: "gains/gets <keyword>"
   */
  public keywordEffect = this.RULE("keywordEffect", () => {
    this.CONSUME(Identifier); // "gains" or "gets"
    this.CONSUME2(Identifier); // Keyword name (Evasive, Rush, etc.)
  });
}

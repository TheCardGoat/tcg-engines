import type { Effect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";

/**
 * EffectBuilder - Implements the Builder pattern for creating effects
 * Allows step-by-step construction of complex effects with method chaining
 */
export class EffectBuilder {
  private effect: Partial<Effect> = {};

  // === CORE BUILDER METHODS ===

  /**
   * Set the effect type
   */
  setType(type: Effect["type"]): EffectBuilder {
    this.effect.type = type;
    return this;
  }

  /**
   * Set the effect parameters
   */
  setParameters(parameters: any): EffectBuilder {
    this.effect.parameters = parameters;
    return this;
  }

  /**
   * Set if the effect is optional
   */
  setOptional(optional: boolean): EffectBuilder {
    this.effect.optional = optional;
    return this;
  }

  /**
   * Set the effect duration
   */
  setDuration(duration: Effect["duration"]): EffectBuilder {
    this.effect.duration = duration;
    return this;
  }

  /**
   * Build the final effect
   */
  build(): Effect {
    if (!this.effect.type) {
      throw new Error("Effect type is required");
    }

    return {
      type: this.effect.type,
      parameters: this.effect.parameters || {},
      optional:
        this.effect.optional !== undefined ? this.effect.optional : false,
      ...(this.effect.duration && { duration: this.effect.duration }),
    } as Effect;
  }

  /**
   * Reset the builder to create a new effect
   */
  reset(): EffectBuilder {
    this.effect = {};
    return this;
  }

  // === STATIC FACTORY METHODS ===

  /**
   * Create a new builder instance
   */
  static create(): EffectBuilder {
    return new EffectBuilder();
  }

  // === COMMON EFFECT BUILDERS ===

  /**
   * Create a gain lore effect
   */
  static gainLore(amount: number): Effect {
    return new EffectBuilder()
      .setType("gainLore")
      .setParameters({ amount })
      .setOptional(false)
      .build();
  }

  /**
   * Create a draw cards effect
   */
  static draw(amount: number): Effect {
    return new EffectBuilder()
      .setType("draw")
      .setParameters({ amount })
      .setOptional(false)
      .build();
  }

  /**
   * Create a deal damage effect
   */
  static dealDamage(amount: number): Effect {
    return new EffectBuilder()
      .setType("dealDamage")
      .setParameters({ amount })
      .setOptional(false)
      .build();
  }

  /**
   * Create a modify stat effect
   */
  static modifyStat(stat: string, value: number): Effect {
    return new EffectBuilder()
      .setType("modifyStat")
      .setParameters({ stat, value })
      .setOptional(false)
      .build();
  }

  /**
   * Create a prevent damage effect
   */
  static preventDamage(amount: number): Effect {
    return new EffectBuilder()
      .setType("preventDamage")
      .setParameters({ amount })
      .setOptional(false)
      .build();
  }

  /**
   * Create a banish effect
   */
  static banish(): Effect {
    return new EffectBuilder()
      .setType("banish")
      .setParameters({})
      .setOptional(false)
      .build();
  }

  /**
   * Create a ready effect
   */
  static ready(): Effect {
    return new EffectBuilder()
      .setType("ready")
      .setParameters({})
      .setOptional(false)
      .build();
  }

  /**
   * Create an exert effect
   */
  static exert(): Effect {
    return new EffectBuilder()
      .setType("exert")
      .setParameters({})
      .setOptional(false)
      .build();
  }

  /**
   * Create a multi-effect container
   */
  static multiEffect(effects: Effect[]): Effect {
    return new EffectBuilder()
      .setType("multiEffect")
      .setParameters({ effects })
      .setOptional(false)
      .build();
  }

  /**
   * Create a remove damage effect
   */
  static removeDamage(amount: number): Effect {
    return new EffectBuilder()
      .setType("removeDamage")
      .setParameters({ amount })
      .setOptional(false)
      .build();
  }

  // === BUILDER METHODS WITH FLUENT INTERFACE ===

  /**
   * Create a gain lore effect builder
   */
  static gainLoreBuilder(amount: number): EffectBuilder {
    return new EffectBuilder()
      .setType("gainLore")
      .setParameters({ amount })
      .setOptional(false);
  }

  /**
   * Create a draw cards effect builder
   */
  static drawBuilder(amount: number): EffectBuilder {
    return new EffectBuilder()
      .setType("draw")
      .setParameters({ amount })
      .setOptional(false);
  }

  /**
   * Create a deal damage effect builder
   */
  static dealDamageBuilder(amount: number): EffectBuilder {
    return new EffectBuilder()
      .setType("dealDamage")
      .setParameters({ amount })
      .setOptional(false);
  }

  /**
   * Create a modify stat effect builder
   */
  static modifyStatBuilder(stat: string, value: number): EffectBuilder {
    return new EffectBuilder()
      .setType("modifyStat")
      .setParameters({ stat, value })
      .setOptional(false);
  }

  // === CONDITIONAL EFFECTS ===

  /**
   * Create an optional effect
   */
  static optional(effect: Effect): Effect {
    return { ...effect, optional: true };
  }

  /**
   * Create a temporary effect (until end of turn)
   */
  static temporary(effect: Effect): Effect {
    return { ...effect, duration: { type: "endOfTurn" } };
  }

  /**
   * Create a permanent effect
   */
  static permanent(effect: Effect): Effect {
    return { ...effect, duration: { type: "permanent" } };
  }
}

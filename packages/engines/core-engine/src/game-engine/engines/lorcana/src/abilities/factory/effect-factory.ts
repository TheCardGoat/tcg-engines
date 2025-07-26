import type { Effect } from "../ability-types";
import { EffectBuilder } from "./effect-builder";

/**
 * EffectFactory - A factory class for creating effects
 * Provides a simplified interface wrapping the EffectBuilder
 */
export class EffectFactory {
  /**
   * Create a gain lore effect
   */
  static gainLore(amount: number): Effect {
    return EffectBuilder.gainLore(amount);
  }

  /**
   * Create a draw cards effect
   */
  static draw(amount: number): Effect {
    return EffectBuilder.draw(amount);
  }

  /**
   * Create a deal damage effect
   */
  static dealDamage(amount: number): Effect {
    return EffectBuilder.dealDamage(amount);
  }

  /**
   * Create a modify stat effect
   */
  static modifyStat(stat: string, value: number): Effect {
    return EffectBuilder.modifyStat(stat, value);
  }

  /**
   * Create a prevent damage effect
   */
  static preventDamage(amount: number): Effect {
    return EffectBuilder.preventDamage(amount);
  }

  /**
   * Create a banish effect
   */
  static banish(): Effect {
    return EffectBuilder.banish();
  }

  /**
   * Create a ready effect
   */
  static ready(): Effect {
    return EffectBuilder.ready();
  }

  /**
   * Create an exert effect
   */
  static exert(): Effect {
    return EffectBuilder.exert();
  }

  /**
   * Create a multi-effect container
   */
  static multiEffect(effects: Effect[]): Effect {
    return EffectBuilder.multiEffect(effects);
  }

  /**
   * Create a remove damage effect
   */
  static removeDamage(amount: number): Effect {
    return EffectBuilder.removeDamage(amount);
  }

  /**
   * Create an optional effect
   */
  static optional(effect: Effect): Effect {
    return EffectBuilder.optional(effect);
  }

  /**
   * Create a temporary effect (until end of turn)
   */
  static temporary(effect: Effect): Effect {
    return EffectBuilder.temporary(effect);
  }

  /**
   * Create a permanent effect
   */
  static permanent(effect: Effect): Effect {
    return EffectBuilder.permanent(effect);
  }
}

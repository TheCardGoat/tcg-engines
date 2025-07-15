// Performance optimizations for the text parser

import { EFFECT_PATTERNS } from "./patterns";
import type { EffectPattern, ParsedEffect } from "./types";

/**
 * Cache for compiled regex patterns to avoid recompilation
 */
class RegexCache {
  private cache = new Map<string, RegExp>();
  private maxSize = 1000; // Prevent memory leaks

  get(pattern: string, flags?: string): RegExp {
    const key = `${pattern}|${flags || ""}`;

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    if (this.cache.size >= this.maxSize) {
      // Remove oldest entries (simple LRU)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const regex = new RegExp(pattern, flags);
    this.cache.set(key, regex);
    return regex;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Global regex cache instance
 */
const regexCache = new RegexCache();

/**
 * Memoization cache for pattern matching results
 */
class PatternMatchCache {
  private cache = new Map<
    string,
    {
      match: RegExpMatchArray | null;
      pattern: EffectPattern | null;
      effectType: string | null;
    }
  >();
  private maxSize = 5000; // Larger cache for pattern matches

  get(text: string) {
    return this.cache.get(text);
  }

  set(
    text: string,
    result: {
      match: RegExpMatchArray | null;
      pattern: EffectPattern | null;
      effectType: string | null;
    },
  ): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entries (simple LRU)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(text, result);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Global pattern match cache instance
 */
const patternMatchCache = new PatternMatchCache();

/**
 * Memoization cache for effect extraction results
 */
class EffectExtractionCache {
  private cache = new Map<string, ParsedEffect[]>();
  private maxSize = 3000;

  get(text: string): ParsedEffect[] | undefined {
    return this.cache.get(text);
  }

  set(text: string, effects: ParsedEffect[]): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entries (simple LRU)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    // Deep clone effects to prevent mutation issues
    this.cache.set(text, JSON.parse(JSON.stringify(effects)));
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Global effect extraction cache instance
 */
const effectExtractionCache = new EffectExtractionCache();

/**
 * Pre-compiled patterns for better performance
 */
class CompiledPatternDatabase {
  private compiledPatterns: Map<
    string,
    {
      pattern: RegExp;
      extractor: (match: RegExpMatchArray) => ParsedEffect;
      type: string;
    }[]
  > = new Map();

  constructor() {
    this.compilePatterns();
  }

  private compilePatterns(): void {
    for (const [effectType, patterns] of Object.entries(EFFECT_PATTERNS)) {
      const compiled = patterns.map((p) => ({
        pattern: regexCache.get(p.pattern.source, p.pattern.flags),
        extractor: p.extractor,
        type: p.type,
      }));
      this.compiledPatterns.set(effectType, compiled);
    }
  }

  getCompiledPatterns(effectType: string) {
    return this.compiledPatterns.get(effectType) || [];
  }

  getAllCompiledPatterns() {
    const allPatterns: {
      pattern: RegExp;
      extractor: (match: RegExpMatchArray) => ParsedEffect;
      type: string;
      effectType: string;
    }[] = [];

    for (const [effectType, patterns] of this.compiledPatterns.entries()) {
      for (const pattern of patterns) {
        allPatterns.push({
          ...pattern,
          effectType,
        });
      }
    }

    return allPatterns;
  }

  recompile(): void {
    this.compiledPatterns.clear();
    this.compilePatterns();
  }
}

/**
 * Global compiled pattern database
 */
const compiledPatternDB = new CompiledPatternDatabase();

/**
 * Optimized pattern matching with caching and pre-compiled patterns
 */
export function optimizedMatchPattern(text: string): {
  match: RegExpMatchArray | null;
  pattern: EffectPattern | null;
  effectType: string | null;
} {
  // Check cache first
  const cached = patternMatchCache.get(text);
  if (cached) {
    return cached;
  }

  // Use pre-compiled patterns for matching
  const allPatterns = compiledPatternDB.getAllCompiledPatterns();

  for (const compiledPattern of allPatterns) {
    const match = text.match(compiledPattern.pattern);
    if (match) {
      const result = {
        match,
        pattern: {
          pattern: compiledPattern.pattern,
          type: compiledPattern.type,
          extractor: compiledPattern.extractor,
        },
        effectType: compiledPattern.effectType,
      };

      // Cache the result
      patternMatchCache.set(text, result);
      return result;
    }
  }

  const result = {
    match: null,
    pattern: null,
    effectType: null,
  };

  // Cache negative results too
  patternMatchCache.set(text, result);
  return result;
}

/**
 * Optimized pattern matching for specific effect type
 */
export function optimizedMatchPatternForType(
  text: string,
  effectType: string,
): {
  match: RegExpMatchArray | null;
  pattern: EffectPattern | null;
} {
  const cacheKey = `${effectType}:${text}`;
  const cached = patternMatchCache.get(cacheKey);
  if (cached) {
    return {
      match: cached.match,
      pattern: cached.pattern,
    };
  }

  const patterns = compiledPatternDB.getCompiledPatterns(effectType);

  for (const compiledPattern of patterns) {
    const match = text.match(compiledPattern.pattern);
    if (match) {
      const result = {
        match,
        pattern: {
          pattern: compiledPattern.pattern,
          type: compiledPattern.type,
          extractor: compiledPattern.extractor,
        },
        effectType,
      };

      // Cache the result
      patternMatchCache.set(cacheKey, result);
      return {
        match: result.match,
        pattern: result.pattern,
      };
    }
  }

  const result = {
    match: null,
    pattern: null,
    effectType,
  };

  // Cache negative results
  patternMatchCache.set(cacheKey, result);
  return {
    match: result.match,
    pattern: result.pattern,
  };
}

/**
 * Optimized effect extraction with memoization
 */
export function optimizedExtractEffectsFromText(text: string): ParsedEffect[] {
  // Check cache first
  const cached = effectExtractionCache.get(text);
  if (cached) {
    return cached;
  }

  const effects: ParsedEffect[] = [];
  let remainingText = text;
  const maxIterations = 20; // Prevent infinite loops
  let iterations = 0;

  // Use optimized pattern matching
  while (remainingText.trim() && iterations < maxIterations) {
    const result = optimizedMatchPattern(remainingText);

    if (result.match && result.pattern) {
      try {
        const effect = result.pattern.extractor(result.match);
        effects.push(effect);

        // Remove the matched text to continue processing
        const matchedText = result.match[0];
        const matchIndex = remainingText.indexOf(matchedText);
        if (matchIndex !== -1) {
          remainingText =
            remainingText.slice(0, matchIndex) +
            remainingText.slice(matchIndex + matchedText.length);
        } else {
          // Fallback: remove from start
          remainingText = remainingText.replace(result.match[0], "");
        }
      } catch (error) {
        // Skip invalid patterns
        break;
      }
    } else {
      // No more matches found
      break;
    }

    iterations++;
  }

  // Cache the result
  effectExtractionCache.set(text, effects);
  return effects;
}

/**
 * Efficient string processing utilities
 */
export class StringProcessor {
  private static readonly WHITESPACE_REGEX = /\s+/g;
  private static readonly PUNCTUATION_REGEX = /\s*([,.;:!?])\s*/g;
  private static readonly TRAILING_SPACE_REGEX = /\s+([.!?])$/g;

  /**
   * Optimized text normalization using pre-compiled regexes
   */
  static normalizeSpacing(text: string): string {
    return text
      .replace(StringProcessor.WHITESPACE_REGEX, " ")
      .replace(StringProcessor.PUNCTUATION_REGEX, "$1 ")
      .replace(StringProcessor.TRAILING_SPACE_REGEX, "$1")
      .trim();
  }

  /**
   * Fast text splitting using optimized algorithms
   */
  static fastSplit(text: string, separator: string | RegExp): string[] {
    if (typeof separator === "string") {
      // Use native string split for simple separators
      return text.split(separator);
    }

    // Use cached regex for complex separators
    const regex =
      typeof separator === "object"
        ? regexCache.get(separator.source, separator.flags)
        : separator;

    return text.split(regex);
  }

  /**
   * Efficient text replacement with caching
   */
  static fastReplace(
    text: string,
    pattern: string | RegExp,
    replacement: string,
  ): string {
    if (typeof pattern === "string") {
      return text.replace(pattern, replacement);
    }

    const regex = regexCache.get(pattern.source, pattern.flags);
    return text.replace(regex, replacement);
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static timings: Map<string, number[]> = new Map();

  static startTimer(label: string): () => number {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;

      if (!PerformanceMonitor.timings.has(label)) {
        PerformanceMonitor.timings.set(label, []);
      }

      PerformanceMonitor.timings.get(label)!.push(duration);
      return duration;
    };
  }

  static getStats(label: string): {
    count: number;
    total: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const times = PerformanceMonitor.timings.get(label);
    if (!times || times.length === 0) {
      return null;
    }

    const total = times.reduce((sum, time) => sum + time, 0);
    const average = total / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return {
      count: times.length,
      total,
      average,
      min,
      max,
    };
  }

  static getAllStats(): Record<
    string,
    ReturnType<typeof PerformanceMonitor.getStats>
  > {
    const stats: Record<
      string,
      ReturnType<typeof PerformanceMonitor.getStats>
    > = {};

    for (const label of PerformanceMonitor.timings.keys()) {
      stats[label] = PerformanceMonitor.getStats(label);
    }

    return stats;
  }

  static clearStats(): void {
    PerformanceMonitor.timings.clear();
  }
}

/**
 * Cache management utilities
 */
export class CacheManager {
  /**
   * Clear all caches
   */
  static clearAllCaches(): void {
    regexCache.clear();
    patternMatchCache.clear();
    effectExtractionCache.clear();
    PerformanceMonitor.clearStats();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): {
    regexCache: number;
    patternMatchCache: number;
    effectExtractionCache: number;
  } {
    return {
      regexCache: regexCache.size(),
      patternMatchCache: patternMatchCache.size(),
      effectExtractionCache: effectExtractionCache.size(),
    };
  }

  /**
   * Warm up caches with common patterns
   */
  static warmUpCaches(commonTexts: string[]): void {
    for (const text of commonTexts) {
      optimizedExtractEffectsFromText(text);
    }
  }

  /**
   * Recompile all patterns (useful after pattern updates)
   */
  static recompilePatterns(): void {
    compiledPatternDB.recompile();
    patternMatchCache.clear(); // Clear cached results since patterns changed
  }
}

/**
 * Export optimized functions to replace the original ones
 */
export {
  regexCache,
  patternMatchCache,
  effectExtractionCache,
  compiledPatternDB,
};

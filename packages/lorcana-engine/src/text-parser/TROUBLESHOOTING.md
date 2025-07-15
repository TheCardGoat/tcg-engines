# Action Text Parser Troubleshooting Guide

This guide helps you diagnose and resolve common issues when using the Action Text Parser.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Common Issues](#common-issues)
- [Debug Mode](#debug-mode)
- [Performance Issues](#performance-issues)
- [Pattern Matching Problems](#pattern-matching-problems)
- [Target Recognition Issues](#target-recognition-issues)
- [Memory and Cache Issues](#memory-and-cache-issues)
- [Integration Problems](#integration-problems)
- [Advanced Debugging](#advanced-debugging)

## Quick Diagnostics

### Step 1: Enable Debug Mode

Always start troubleshooting with debug mode enabled:

```typescript
import { parseActionText } from '@lorcanito/lorcana-engine/text-parser';

const result = parseActionText("Your problematic card text", { 
  debug: true,
  strictMode: false 
});

console.log("Abilities:", result.abilities);
console.log("Warnings:", result.warnings);
console.log("Errors:", result.errors);
console.log("Clauses:", result.clauses);
```

### Step 2: Check Basic Validation

```typescript
// Validate input
if (!cardText || cardText.trim().length === 0) {
  console.error("Empty or invalid card text");
}

// Check for common formatting issues
if (cardText.includes("  ")) {
  console.warn("Multiple spaces detected - may affect parsing");
}

if (!cardText.match(/[.!?]$/)) {
  console.warn("Text doesn't end with punctuation - may affect sentence splitting");
}
```

### Step 3: Test with Simple Text

```typescript
// Test with known working patterns
const simpleTests = [
  "Draw a card",
  "Deal 2 damage to chosen character",
  "Banish chosen character"
];

for (const test of simpleTests) {
  const result = parseActionText(test);
  console.log(`"${test}" -> ${result.abilities.length} abilities`);
}
```

## Common Issues

### Issue 1: No Abilities Generated

**Symptoms:**
- `result.abilities` is empty array
- No errors reported
- Text appears valid

**Diagnosis:**
```typescript
const result = parseActionText(cardText, { debug: true });

// Check if text was normalized correctly
console.log("Original text:", cardText);
console.log("Normalized text:", normalizeText(cardText));

// Check if any patterns matched
console.log("Clauses found:", result.clauses.length);
console.log("Clauses:", result.clauses);
```

**Common Causes:**
1. **Text doesn't match any patterns**
   ```typescript
   // Check against known patterns
   import { matchPattern } from '@lorcanito/lorcana-engine/text-parser/patterns';
   
   const match = matchPattern(cardText);
   console.log("Pattern match:", match);
   ```

2. **Text normalization removed important parts**
   ```typescript
   import { normalizeText } from '@lorcanito/lorcana-engine/text-parser';
   
   const normalized = normalizeText(cardText);
   console.log("Before:", cardText);
   console.log("After:", normalized);
   ```

3. **Complex sentence structure not recognized**
   ```typescript
   import { analyzeTextStructure } from '@lorcanito/lorcana-engine/text-parser';
   
   const analysis = analyzeTextStructure(cardText);
   console.log("Text analysis:", analysis);
   ```

**Solutions:**
1. **Add missing patterns**
   ```typescript
   import { addPattern } from '@lorcanito/lorcana-engine/text-parser/patterns';
   
   addPattern('yourEffectType', {
     pattern: /your custom pattern/i,
     type: 'yourEffectType',
     extractor: (match) => ({
       type: 'yourEffectType',
       parameters: { /* extract from match */ }
     })
   });
   ```

2. **Adjust text normalization**
   ```typescript
   const customNormalized = normalizeText(cardText, {
     preserveSpacing: true,
     normalizeCase: false
   });
   ```

3. **Break down complex text**
   ```typescript
   // Split complex text into simpler parts
   const sentences = splitIntoSentences(cardText);
   for (const sentence of sentences) {
     const result = parseActionText(sentence);
     console.log(`"${sentence}" -> ${result.abilities.length} abilities`);
   }
   ```

### Issue 2: Incorrect Target Recognition

**Symptoms:**
- Effects target wrong game objects
- Target is null or undefined
- Wrong target type selected

**Diagnosis:**
```typescript
import { parseTargetFromText } from '@lorcanito/lorcana-engine/text-parser/target-mapper';

// Test target parsing directly
const targetText = "chosen character of yours";
const target = parseTargetFromText(targetText);
console.log("Target result:", target);
```

**Common Causes:**
1. **Ambiguous target text**
   ```typescript
   // These might be ambiguous:
   "them" // Could refer to multiple things
   "it"   // Unclear reference
   "that character" // Which character?
   ```

2. **Missing target patterns**
   ```typescript
   // Check if target pattern exists
   import { TARGET_PATTERNS } from '@lorcanito/lorcana-engine/text-parser/patterns';
   
   const targetText = "your problematic target";
   let found = false;
   
   for (const [name, pattern] of Object.entries(TARGET_PATTERNS)) {
     if (targetText.match(pattern)) {
       console.log(`Matches pattern: ${name}`);
       found = true;
     }
   }
   
   if (!found) {
     console.log("No matching target pattern found");
   }
   ```

**Solutions:**
1. **Add custom target patterns**
   ```typescript
   // Add to TARGET_PATTERNS in patterns.ts
   TARGET_PATTERNS.yourCustomTarget = /your custom target pattern/i;
   ```

2. **Use more specific target text**
   ```typescript
   // Instead of: "Deal damage to them"
   // Use: "Deal damage to chosen character"
   ```

3. **Handle contextual targets**
   ```typescript
   // For pronouns, ensure context is clear
   // "Banish chosen character. Deal damage to them."
   // Should be parsed as dependent effects
   ```

### Issue 3: Performance Problems

**Symptoms:**
- Parsing takes too long
- High memory usage
- Application becomes unresponsive

**Diagnosis:**
```typescript
import { PerformanceMonitor, CacheManager } from '@lorcanito/lorcana-engine/text-parser/performance-optimizations';

// Monitor performance
const endTimer = PerformanceMonitor.startTimer('parsing-test');
const result = parseActionText(cardText);
const duration = endTimer();

console.log(`Parsing took ${duration.toFixed(2)}ms`);

// Check cache usage
const cacheStats = CacheManager.getCacheStats();
console.log("Cache stats:", cacheStats);
```

**Common Causes:**
1. **Infinite loops in pattern matching**
   ```typescript
   // Check for patterns that might cause infinite loops
   const maxIterations = 20;
   let iterations = 0;
   let text = cardText;
   
   while (text.trim() && iterations < maxIterations) {
     const match = matchPattern(text);
     if (!match.match) break;
     
     // Remove matched text
     text = text.replace(match.match[0], '');
     iterations++;
     
     if (iterations >= maxIterations) {
       console.warn("Possible infinite loop detected");
     }
   }
   ```

2. **Large cache sizes**
   ```typescript
   const stats = CacheManager.getCacheStats();
   if (stats.effectExtractionCache > 1000) {
     console.warn("Large effect extraction cache:", stats.effectExtractionCache);
     CacheManager.clearAllCaches();
   }
   ```

**Solutions:**
1. **Use optimized functions**
   ```typescript
   import { optimizedExtractEffectsFromText } from '@lorcanito/lorcana-engine/text-parser/performance-optimizations';
   
   // Use optimized version instead of regular one
   const effects = optimizedExtractEffectsFromText(cardText);
   ```

2. **Batch processing with cache management**
   ```typescript
   function processBatch(cardTexts: string[]) {
     const batchSize = 100;
     
     for (let i = 0; i < cardTexts.length; i += batchSize) {
       const batch = cardTexts.slice(i, i + batchSize);
       
       // Process batch
       for (const text of batch) {
         parseActionText(text);
       }
       
       // Clear caches periodically
       if (i % 500 === 0) {
         CacheManager.clearAllCaches();
       }
     }
   }
   ```

3. **Warm up caches strategically**
   ```typescript
   // Warm up with common patterns
   const commonPatterns = [
     "Draw a card",
     "Deal 2 damage to chosen character",
     "Banish chosen character"
   ];
   
   CacheManager.warmUpCaches(commonPatterns);
   ```

### Issue 4: Memory Leaks

**Symptoms:**
- Memory usage grows over time
- Application crashes with out-of-memory errors
- Performance degrades over time

**Diagnosis:**
```typescript
// Monitor memory usage
function checkMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    console.log('Memory usage:', {
      rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`
    });
  }
}

// Check before and after parsing
checkMemoryUsage();
// ... parse many cards ...
checkMemoryUsage();
```

**Solutions:**
1. **Regular cache clearing**
   ```typescript
   let parseCount = 0;
   
   function parseWithMemoryManagement(cardText: string) {
     const result = parseActionText(cardText);
     parseCount++;
     
     // Clear caches every 1000 parses
     if (parseCount % 1000 === 0) {
       CacheManager.clearAllCaches();
       PerformanceMonitor.clearStats();
     }
     
     return result;
   }
   ```

2. **Limit cache sizes**
   ```typescript
   // The caches have built-in size limits, but you can clear them more aggressively
   function aggressiveCacheManagement() {
     const stats = CacheManager.getCacheStats();
     
     if (stats.patternMatchCache > 500) {
       CacheManager.clearAllCaches();
     }
   }
   ```

## Debug Mode

### Understanding Debug Output

When you enable debug mode, you'll see output like this:

```
[Text Parser] Parsing text: "Draw a card. Deal 2 damage to chosen character."
[Text Parser] Normalized text: "Draw a card. Deal 2 damage to chosen character."
[Text Parser] Text structure: {
  sentences: ["Draw a card.", "Deal 2 damage to chosen character."],
  clauses: ["Draw a card", "Deal 2 damage to chosen character"],
  modalInfo: { isModal: false },
  conditionalInfo: { hasConditional: false },
  timingInfo: { hasTimingMarker: false },
  isComplex: false
}
[Text Parser] Parsed 2 clauses
[Ability Builder] Built 2 total abilities
[Text Parser] Generated 2 abilities
[Text Parser] Parsing completed in 3.45ms
```

### Interpreting Debug Information

1. **Text Normalization**: Check if your text was changed unexpectedly
2. **Text Structure**: Verify sentences and clauses were split correctly
3. **Modal/Conditional/Timing**: Confirm special patterns were detected
4. **Clause Count**: Should match expected number of effects
5. **Ability Count**: Final number of generated abilities

### Custom Debug Logging

```typescript
function debugParseStep(cardText: string) {
  console.log("=== Debug Parse Step ===");
  
  // Step 1: Text normalization
  const normalized = normalizeText(cardText);
  console.log("1. Normalized:", normalized);
  
  // Step 2: Text structure analysis
  const structure = analyzeTextStructure(normalized);
  console.log("2. Structure:", structure);
  
  // Step 3: Pattern matching
  for (const clause of structure.clauses) {
    const match = matchPattern(clause);
    console.log(`3. Pattern for "${clause}":`, match.effectType || "none");
  }
  
  // Step 4: Full parsing
  const result = parseActionText(cardText, { debug: false });
  console.log("4. Final result:", {
    abilities: result.abilities.length,
    warnings: result.warnings.length,
    errors: result.errors.length
  });
}
```

## Pattern Matching Problems

### Adding New Patterns

1. **Identify the pattern**
   ```typescript
   // What text are you trying to match?
   const problemText = "Heal 3 damage from chosen character";
   
   // What pattern would match it?
   const pattern = /heal (\d+) damage from (.+)/i;
   
   // Test the pattern
   const match = problemText.match(pattern);
   console.log("Match:", match);
   ```

2. **Create the extractor**
   ```typescript
   const extractor = (match: RegExpMatchArray) => ({
     type: 'heal',
     amount: parseInt(match[1], 10),
     parameters: {
       targetText: match[2].trim()
     }
   });
   ```

3. **Add to patterns database**
   ```typescript
   import { addPattern } from '@lorcanito/lorcana-engine/text-parser/patterns';
   
   addPattern('heal', {
     pattern: /heal (\d+) damage from (.+)/i,
     type: 'heal',
     extractor
   });
   ```

### Pattern Priority Issues

Patterns are matched in order, so more specific patterns should come first:

```typescript
// Good: Specific pattern first
addPattern('draw', {
  pattern: /draw a card from your deck/i,
  // ...
});

addPattern('draw', {
  pattern: /draw a card/i,
  // ...
});

// Bad: General pattern would match first and prevent specific one
```

## Advanced Debugging

### Custom Validation

```typescript
function validateParsingResult(cardText: string, expectedAbilities: number) {
  const result = parseActionText(cardText);
  
  const issues: string[] = [];
  
  if (result.abilities.length !== expectedAbilities) {
    issues.push(`Expected ${expectedAbilities} abilities, got ${result.abilities.length}`);
  }
  
  if (result.errors.length > 0) {
    issues.push(`Parsing errors: ${result.errors.join(', ')}`);
  }
  
  for (let i = 0; i < result.abilities.length; i++) {
    const ability = result.abilities[i];
    if (!ability.type) {
      issues.push(`Ability ${i + 1} missing type`);
    }
    
    if ('effects' in ability && (!ability.effects || ability.effects.length === 0)) {
      issues.push(`Ability ${i + 1} has no effects`);
    }
  }
  
  if (issues.length > 0) {
    console.error(`Validation failed for "${cardText}":`, issues);
    return false;
  }
  
  console.log(`✓ Validation passed for "${cardText}"`);
  return true;
}
```

### Performance Profiling

```typescript
function profileParser(cardTexts: string[]) {
  const results = {
    totalTime: 0,
    averageTime: 0,
    slowestCard: { text: '', time: 0 },
    fastestCard: { text: '', time: Number.MAX_VALUE },
    cacheHitRate: 0
  };
  
  CacheManager.clearAllCaches();
  
  for (const text of cardTexts) {
    const startTime = performance.now();
    parseActionText(text);
    const duration = performance.now() - startTime;
    
    results.totalTime += duration;
    
    if (duration > results.slowestCard.time) {
      results.slowestCard = { text, time: duration };
    }
    
    if (duration < results.fastestCard.time) {
      results.fastestCard = { text, time: duration };
    }
  }
  
  results.averageTime = results.totalTime / cardTexts.length;
  
  console.log("Performance Profile:", results);
  return results;
}
```

### Integration Testing

```typescript
function testIntegration() {
  const testCases = [
    {
      text: "Draw a card",
      expectedType: "resolution",
      expectedEffects: 1
    },
    {
      text: "Deal 2 damage to chosen character",
      expectedType: "resolution", 
      expectedEffects: 1
    },
    {
      text: "Choose one: Draw a card, or deal 3 damage",
      expectedType: "modal",
      expectedEffects: 2
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    try {
      const abilities = generateActionAbilitiesFromText(testCase.text);
      
      if (abilities.length === 0) {
        console.error(`❌ No abilities generated for: "${testCase.text}"`);
        failed++;
        continue;
      }
      
      const firstAbility = abilities[0];
      
      if (firstAbility.type !== testCase.expectedType) {
        console.error(`❌ Wrong type for "${testCase.text}": expected ${testCase.expectedType}, got ${firstAbility.type}`);
        failed++;
        continue;
      }
      
      console.log(`✅ Passed: "${testCase.text}"`);
      passed++;
      
    } catch (error) {
      console.error(`❌ Exception for "${testCase.text}":`, error);
      failed++;
    }
  }
  
  console.log(`\nIntegration Test Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}
```

## Getting Help

If you're still having issues after following this guide:

1. **Check the examples**: Look at `examples.ts` for working code patterns
2. **Run the test suite**: Verify your environment with `bun test`
3. **Enable debug mode**: Always use debug mode when reporting issues
4. **Provide minimal reproduction**: Create the smallest possible example that shows the problem
5. **Check performance**: Use the performance monitoring tools to identify bottlenecks

### Reporting Issues

When reporting issues, please include:

1. **Card text** that's causing problems
2. **Expected behavior** vs actual behavior
3. **Debug output** with debug mode enabled
4. **Environment information** (Node.js version, etc.)
5. **Minimal reproduction code**

Example issue report:
```typescript
// Problem: No abilities generated for this card text
const cardText = "Heal 2 damage from chosen character";

// Debug output:
const result = parseActionText(cardText, { debug: true });
console.log("Result:", result);

// Expected: Should generate healing ability
// Actual: Empty abilities array

// Environment: Node.js 18.x, Bun 1.2.14
```

This troubleshooting guide should help you resolve most common issues with the Action Text Parser. Remember to always start with debug mode and work through the issues systematically.
# Lorcana Test Case Generation Protocol

## Objective:

Your mission is to generate comprehensive, accurate, and robust Jest test cases for a given Lorcana card definition. The tests should validate all aspects of the card's functionality within the Lorcana game engine.

## Input:

You will receive a folder which already contains the test files, but some of them do not have the test assertion implement, you should identify which files are these and extract the tests that need to be generated.

## Core Directives for Test Generation:

1.  **Accuracy:** Tests must accurately reflect the card's abilities and interactions as per Lorcana rules.
2.  **Coverage:** Aim to test every discrete ability, effect, and significant interaction.
3.  **Robustness:** Include positive, negative, and edge cases.
4.  **Clarity:** Test code should be well-structured and easy to understand.
5.  **Engine Compliance:** Utilize only the APIs and functionalities available within the `@lorcanito/lorcana-engine`'s `TestEngine`.

## Test Generation Pipeline:

**Phase 1: Card Analysis & Strategy Formulation**

1.  **Deconstruct `[CARD_DEFINITION]`:**

    - Identify: Card Name, Set, Number, Type (Character, Item, Action, Location), Color, Cost, Strength, Willpower, Lore, Inkability, and all ability texts.
    - For each ability, break it down into its core mechanics: Trigger (e.g., "When you play...", "Whenever this character quests...", "Banish this item, {E}..."), Conditions (e.g., "if you used Shift", "While you have X in play"), Actions (e.g., "draw a card", "gain 1 lore", "search your deck"), and Targets (e.g., "your Puppy characters", "one of your Prince characters").

2.  **Reference Material Strategy (Simulated Search & Best Practice Application):**
    - **File Naming:** Determine the target test file name: `[set-number]/[type]/[color]/[card-number]-[kebab-case-name].test.ts`.
    - **Prioritized Search for Inspiration:**
      1.  Mentally search for existing tests of cards from the **same set and type** with similar ability text or mechanics.
      2.  If insufficient, expand to other **sets** (same type).
      3.  If still insufficient, expand to other **types** within any set.
          *Focus on understanding *how* similar mechanics are tested, rather than direct code copying.*
    - **Identify 3-5 Key Reference Patterns:** From your simulated search or general knowledge of Lorcana testing, select a few robust test patterns that will be most applicable to the current card.

**Phase 2: Test File Construction**

1.  **Boilerplate & Imports:**

    - Start with `// @ts-expect-error - {os: string, arch: string} - TODO: fix this, it's a bug in the original code, jest-environment-node types are not compatible` (or the standard Jest environment comment for your project, e.g. `/** @jest-environment node */`).
    - Import necessary modules: `describe, it, expect` from `@jest/globals`, and relevant classes/interfaces (e.g., `TestEngine`, card definitions) from `@lorcanito/lorcana-engine` or card definition files.

2.  **Main `describe` Block:**
    - Create a `describe` block with the card's full name (e.g., `describe("Mickey Mouse - Brave Little Tailor", () => { ... });`).

**Phase 3: Individual Test Case (`it` block) Generation**

_For each distinct ability, effect, or important interaction identified in Phase 1:_

1.  **Descriptive `it` Block:**

    - Write an `it` block. The description MUST be the exact ability text from the card, or a concise summary if the ability is very long.
    - Example: `it("YOUR WISH IS MY COMMAND When you play this character, you may return chosen character card from your discard to your hand.", async () => { ... });`

2.  **`TestEngine` Initialization:**

    - Instantiate `TestEngine` with a configuration tailored to the specific scenario being tested.
    - **Card Placement:** Include the target card and any interacting cards in relevant zones (`play`, `hand`, `deck`, `discard`, `inkwell`).
    - **Inkwell Setup:** If the card or its abilities involve ink costs, ensure the `inkwell` is appropriately populated.
    - **Opponent State:** If the ability interacts with or is affected by an opponent, set up the opposing player's relevant state in the `TestEngine`.
    - **Conditional States:** For abilities with conditions (e.g., "While you have X in play", "if you used Shift"):
      - Create **separate `TestEngine` instances** for each significant condition (e.g., condition met vs. condition not met). Do NOT modify `TestEngine` state post-initialization to test different conditional branches; prefer fresh setups.

3.  **Simulate Game Actions:**

    - Use `TestEngine` methods to perform actions:
      - `playCard()`, `shiftCard()`, `activateCard()`, `challenge()`, `quest()`, `exert()`, `triggerAbility()`, etc.
      - Ensure `async/await` is used for asynchronous operations.
      - Resolve stack effects using `resolveTopOfStack()` or `resolveOptionalAbility()` as needed.

4.  **Assertions (`expect`):**
    - Verify outcomes using `expect()` and the following common assertion targets:
      - `testEngine.getCardZone(card)`: Card location (e.g., `expect(testEngine.getCardZone(myCard)).toBe("play");`).
      - `testEngine.getCardModel(card).attribute`: Properties like `strength`, `willpower`, `cost`, `loreValue`. (e.g., `expect(testEngine.getCardModel(heroCard).strength).toBe(initialStrength + 2);`).
      - `testEngine.getCardModel(card).hasAbility("AbilityName")`: Presence of keywords like "Ward", "Bodyguard", "Resist".
      - `testEngine.store.tableStore.getTable(playerId).lore`: Player's lore total.
      - `testEngine.getCardModel(card).exerted` (or `card.meta.exerted` if that's the correct API): Exertion status (e.g., `expect(testEngine.getCardModel(targetCard).exerted).toBe(true);`).
      - `testEngine.getCardModel(card).damageReduction()`: Resist values.
      - `testEngine.getCardModel(card).zone`: Direct zone property.
      - `testEngine.getCardModel(card).owner`: Card ownership.
      - `testEngine.getZonesCardCount()`: To check counts in hand, deck, discard.
      - `testEngine.stackLayers.length`: To check if abilities triggered.

**Phase 4: Applying Specific Testing Patterns & Edge Cases**

_Integrate these patterns where applicable, drawing from your original prompt's detailed guidelines:_

1.  **"When you play this character..."**: Play the card, then verify immediate effects.
2.  **"Challenger X"**: Test strength bonus during a challenge. Verify normal strength otherwise.
3.  **"Ward"**: Attempt to target the character with an opponent's effect; verify failure.
4.  **"Song"**: Exert a character to play the song; verify song's effect.
5.  **Draw/Discard**: Verify cards move to/from correct zones (`hand`, `deck`, `discard`). Check hand/deck sizes.
6.  **Stat Modifications (+X {S}, +Y {W}, Resist +Z)**: Check attributes before and after the ability's trigger/condition.
7.  **"While you have X in play..." / Conditional Effects**:
    - Test Engine 1: Condition NOT met. Verify default behavior.
    - Test Engine 2: Condition IS met. Verify ability activates and effects apply.
    - Test changes if the condition is met/unmet mid-game (if feasible and distinct from setup).
8.  **Cost Reduction**: Verify reduced cost when playing cards. Test with single/multiple sources if the card offers stacking or interacts with other reducers. Ensure cost doesn't go below 0 unless specified.
9.  **Exert Effects**:
    - Verify target becomes exerted.
    - Test attempting to exert an already exerted character.
    - Test exerting characters that might have "can't be exerted" properties.
10. **Ability Granting**: Verify the granted ability is active and functional on the target. Test if target already has the ability.
11. **Card Movement (Deck, Hand, Discard, Banish, Inkwell)**: Verify cards end up in the correct zone and state (e.g., exerted if inked). Test invalid targets if applicable.
12. **"Name a card, then reveal..."**: Test correct naming and subsequent actions based on revealed card.
13. **Interaction with Other Cards**: Consider simple, common interactions (e.g., if the card buffs "Puppy" characters, include a Puppy and a non-Puppy).
14. **Ability Stacking**: If the card's ability can stack (e.g., multiple copies in play, or effect applies per instance of something), test this.
15. **Timing/Turn-Based Effects**: Ensure effects last for the correct duration (e.g., "until start of your next turn").

**Phase 5: Final Review & Best Practices Adherence**

1.  **Focus:** Each `it` block should test a single behavior or aspect of an ability.
2.  **Descriptive Names:** Ensure `describe` and `it` block names are clear.
3.  **Reusability (Mental):** Leverage patterns from similar abilities.
4.  **Positive/Negative Cases:** Test both when an ability _should_ work and when it _shouldn't_ (due to conditions not met, invalid targets, etc.).
5.  **Async/Await:** Double-check all `TestEngine` calls that are asynchronous are `await`ed.
6.  **Stack Resolution:** Ensure effects that go on the stack are properly resolved (e.g., `await testEngine.resolveTopOfStack();` or `await testEngine.resolveOptionalAbility();`).

## Output Format:

Provide the complete TypeScript code for the generated test file.
The file should start with the Jest environment comment and include all necessary imports, the main `describe` block, and all `it` test cases.
Example of a single test case structure:

```typescript
it("ABILITY_TEXT_AS_DESCRIPTION", async () => {
  const testEngine = new TestEngine({
    /* initial game state setup */
  });
  // actions like playing cards, activating abilities
  await testEngine.playCard(cardUnderTest);
  // further actions or resolutions if needed
  await testEngine.resolveTopOfStack(); // Example
  // assertions to verify the outcome
  expect(testEngine.getCardModel(someCard).someProperty).toBe(expectedValue);
});
```

## Post-Generation Steps (For User):

1.  Save the generated code into the file: `[set-number]/[type]/[color]/[card-number]-[kebab-case-name].test.ts`
2.  Run the test: `bun test $FILE_PATH --verbose`.
3.  Debug any failures by analyzing error messages and the generated test code. Add `console.log` statements within the test for intermediate state if needed.

## Continuous Improvement:

This prompt (`.cursor/prompts/create-test-case-for-card.md`) should be updated with learnings from each generation session to enhance its accuracy, comprehensiveness, and utility for future test case generation.

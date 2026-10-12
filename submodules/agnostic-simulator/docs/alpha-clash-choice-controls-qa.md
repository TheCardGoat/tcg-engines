# Human QA: Alpha Clash choices

Ready for human QA after the agent pass on 2026-10-08; fixture start updated on
2026-10-09. Run the simulator from this branch — the shared checkout on port
5216 may not include these changes. Allow about 10 minutes. Reload native pages
between outcomes.

## Native game checks

1. Open [Haven](http://127.0.0.1:5216/alpha-clash/simulator/tests/prompt-modes).
   The board starts before the card is played: health 26, deck 8, hand 2, six
   ready resources, Primary phase, no pending prompt. Preview Haven, then close
   the preview. No prompt may appear and all values must stay unchanged.
2. Inspect Haven and choose **Play Haven (…)**. Resources pay the cost, and any
   response window must be passable. Select **Your Contender gains two health**:
   expect health 28, deck 8, hand 1. Reload, play Haven again, focus
   **Draw one card**, and press Enter: expect health 26, deck 7, hand 2.
3. Reload, play Haven, and open **Match**. The required mode must have no
   **Cancel** button. Close Match. The choice must remain available.
4. Open [Denver](http://127.0.0.1:5216/alpha-clash/simulator/tests/prompt-optional).
   Play Denver from hand. Select **No**: expect deck 8 and hand 1.
5. Reload and play Denver. In **Match**, turn Sound off and Reduced motion on,
   then close Match. Select **Yes**: expect no choice sound, deck 6, hand 3,
   and a discard prompt. Select Sonoro from the hand: expect hand 2 and your
   Oblivion 1.
6. Reload and open **Opponent's hand**. Both candidates must say **Face-down
   card**, without card names or faces. Return to the board. Reload with Sound
   on, play Haven, and choose a mode once: expect one short selection cue and
   one outcome. Repeat at 844×390; all prompt text and buttons must remain
   visible.

## Shared color and long-list checks

These use the same shared control and protocol. Results appear as submission
evidence. They do not execute native card rules.

7. Open [Colors](http://127.0.0.1:5216/simulator-ui-fixtures/interactions/shared-prompts?case=colors).
   Expect White, Blue, Black, Red, Green, without search. Choose Blue: expect
   `Submitted: {"mode":["blue"]}` once. Acknowledge result must close the prompt.
   New request / reset must restore choices and clear evidence.
8. Open [Long list](http://127.0.0.1:5216/simulator-ui-fixtures/interactions/shared-prompts?case=search-many).
   Source, title, and search must stay inside the board. Scroll the list; Option 1
   must be disabled. Search `does-not-exist`: expect zero results and no submission.
   Search `OPTION 32`: expect one result.
9. Enable **Pause input**: search and result must be disabled. Disable Pause and
   enable **Reject next submission**. Choose Option 32. Expect one rejection and
   **Retry choice**. Click Retry once: expect one submission with the same
   `option-32` ID. There must be no automatic retry. Acknowledge and reset:
   search and evidence must be empty.
10. Repeat the long-list check at 844×390 and 390×844. Page and prompt scrolling
    may be needed. No header or control must be clipped. Enable Reduced motion:
    the arrival animation must stop. Source preview must not submit a choice.

## Report a failure

Mark each step Pass or Fail. Record URL, step, expected result, actual result,
browser, screen size, and screenshot. Do not mark native name/color card rules
or hosted matches as covered.

## Agent validation

65 focused tests, lint, and diff checks passed. Browser checks passed for both
Haven outcomes, preview, keyboard, native Denver accept/decline/discard, mute,
reduced motion, required-choice cancellation, and hidden opponent-hand access.
Shared checks passed for colors, long search, disabled choices, zero results,
pause, explicit retry, acknowledgement, and reset. Desktop, landscape, and
portrait layouts were inspected with screenshots.

Fixed long-list clipping, missing shared inventory entries, and the disconnected
shared-fixture reduced-motion switch. Search now has a stable accessible name.
An isolated frozen-lockfile dependency install corrected local startup failures
caused by dependency/cache links into the main checkout. No platform service was needed.

2026-10-09 update: the Haven and Denver fixtures now open before the card is
played, so every native step above starts with a real play action. Focused
tests drive the play through the production adapter and pass.

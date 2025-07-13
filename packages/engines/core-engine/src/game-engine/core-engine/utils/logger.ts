/**
 * Logger utility with different severity levels for various use cases.
 */
export const logger = {
  /**
   * Debug level logging - extremely verbose.
   * Use for detailed decision-making traces and execution paths.
   *
   * Should provide enough context for automated systems (like LLMs) to diagnose issues.
   * Records function entries, state transitions, condition evaluations, and data transformations.
   *
   * @param args - Values to log
   */
  debug: (...args: unknown[]) => {
    console.debug(...args);
  },

  /**
   * Trace level logging - developer-oriented information.
   * Use for technical details relevant to understanding code execution.
   *
   * Intended for developers working on the codebase to track execution flow.
   * Includes function calls, parameter values, and relevant state changes.
   *
   * @param args - Values to log
   */
  trace: (...args: unknown[]) => {
    console.trace(...args);
  },

  /**
   * Info level logging - significant game events.
   * Use for noteworthy occurrences that advanced players would find useful.
   *
   * Provides detailed information about game state, interactions, and outcomes.
   * Helps pro players understand complex mechanics and edge cases.
   *
   * @param args - Values to log
   */
  info: (...args: unknown[]) => {
    console.info(...args);
  },

  /**
   * Standard logging - essential game information.
   * Use for core game events that all players need to understand.
   *
   * Records basic gameplay progression, card plays, and results.
   * Should be concise and relevant for the average player.
   *
   * @param args - Values to log
   */
  log: (...args: unknown[]) => {
    console.log(...args);
  },

  /**
   * Warning level logging - potential issues.
   * Use for unexpected but non-critical situations.
   *
   * Indicates potential problems or edge cases that might need attention.
   * Helps identify unusual game states or potential bugs.
   *
   * @param args - Values to log
   */
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  /**
   * Error level logging - critical failures.
   * Use for serious issues that affect game functionality.
   *
   * Reports errors that prevent normal gameplay or indicate bugs.
   * Should trigger immediate developer attention.
   *
   * @param args - Values to log
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};

export type EngineLogger = typeof logger;

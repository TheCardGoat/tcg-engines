const isWatchMode =
  process.argv.includes("--watch") || process.argv.includes("--watchAll");

const reporters = process.env.CI
  ? [["github-actions", { silent: false }], "summary"]
  : isWatchMode
    ? ["default", "summary"]
    : [
        [
          "jest-silent-reporter",
          { showPaths: true, showWarnings: false, useDots: true },
        ],
        "summary",
      ];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxConcurrency: 10,
  reporters,
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
    "^@lorcanito/lorcana-engine$": "<rootDir>/src/index.ts",
    "^@lorcanito/lorcana-engine/(.*)$": "<rootDir>/src/$1",
  },
};

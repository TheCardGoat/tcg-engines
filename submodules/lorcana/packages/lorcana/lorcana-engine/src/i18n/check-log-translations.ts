import { collectLorcanaLogTranslationIssues } from "./log-translation-contract";

try {
  const issues = collectLorcanaLogTranslationIssues();
  if (issues.length === 0) {
    process.exit(0);
  }

  for (const issue of issues) {
    console.error(issue);
  }
  process.exit(1);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}

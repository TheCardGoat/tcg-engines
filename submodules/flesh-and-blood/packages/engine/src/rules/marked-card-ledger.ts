import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";

/** Checked-in CR 9.3 coverage ledger; color variants share behavior families. */
export type MarkedCardRole = "producer" | "consumer" | "condition-artifact";

/**
 * One public acceptance-test owner for every authored CR 9.3 card face.
 *
 * Keep this deliberately explicit.  Semantic discovery below tells us which
 * cards use Marked; this table makes an unowned newly-authored use fail the
 * coverage test instead of inheriting a vague, generic owner label.
 */
export const MARKED_AAA_OWNERS: Readonly<Record<string, string>> = {
  "9Rc87J7TGt8DWffqnKjCf":
    "engine/src/rules/card-behavior/proven/equipment/equipment-prey-spotters.test.ts",
  z6fz9gMGF7DDJWfj7D6Wp:
    "engine/src/rules/card-behavior/proven/equipment/equipment-rage-baiters.test.ts",
  m7hWTmtRzJnrtqtfLLR6M: "engine/src/rules/marked-cards-aaa.test.ts",
  mtdP6wgpMpd6LJbpJ79TM:
    "engine/src/rules/card-behavior/proven/equipment/equipment-vow-of-vengeance.test.ts",
  dDw6tLrTHJMDftM86zRjK: "cards/src/cards/actions/hot-on-their-heels.test.ts",
  zTPFF6jKhBgqGLpjtFrGG: "engine/src/rules/marked-cards-aaa.test.ts",
  DcFccRh7KttKMbFkHnPqh: "engine/src/rules/marked-remaining-aaa.test.ts",
  nzwjQnhrKth6NkJHKHKnD: "engine/src/rules/marked-cards-aaa.test.ts",
  mzgkQrfmk8LtFjnQzQqgM: "engine/src/rules/marked-cards-aaa.test.ts",
  qnKjmr6mDJDGbhn6mQdkp: "engine/src/rules/marked-cards-aaa.test.ts",
  d7MHfCqtjhKzp6cLRJQCQ: "engine/src/rules/marked-cards-aaa.test.ts",
  RBcRMcBrm89m6pcTDQnP9: "engine/src/rules/marked-cards-aaa.test.ts",
  JBQPqNK9TGWNHD9NKmKTh: "engine/src/rules/marked-cards-aaa.test.ts",
  t6JCJM8LbB8DcqTwHj7Mk: "engine/src/rules/marked-cards-aaa.test.ts",
  f7Gk6PJDmMhpGpGjpp866: "engine/src/rules/marked-remaining-aaa.test.ts",
  Jw97fMLCLqmLbfc9CmW7R: "engine/src/rules/marked-remaining-aaa.test.ts",
  kt98RmWMpHzwR8R6Hrccq: "engine/src/rules/marked-cards-aaa.test.ts",
  Dm9LL8NBBLmr7qchQ7cpn: "engine/src/rules/marked-cards-aaa.test.ts",
  TH9GfGKwbnJRcWcgT8Gwc: "engine/src/rules/marked-cards-aaa.test.ts",
  GjDhhCcNjbQcc7Tt9rJkC: "engine/src/rules/marked-cards-aaa.test.ts",
  ThCWFGk7TfpwDbfPmKCT6: "engine/src/rules/marked-cards-aaa.test.ts",
  LF9TBNgmPnzzWbD6FzGRf: "engine/src/rules/marked-cards-aaa.test.ts",
  rzm9GQbbBrrDzLQRcB6kK: "engine/src/rules/card-behavior/proven/hero/hero-assassin.test.ts",
  qMNzBQBKDMgnGpTfGgKkP: "engine/src/rules/card-behavior/proven/hero/hero-assassin.test.ts",
  QTkWJ8jqCgbMCTcNpmMmC:
    "engine/src/rules/card-behavior/proven/weapon/weapon-hunter-s-klaive.test.ts",
  mTf6RCrQ8NpGBBdbC6dQj:
    "engine/src/rules/card-behavior/proven/equipment/equipment-blade-break-hvy-hnt-out-ros.test.ts",
  M9DL6cPLrKkmDhGpQL7Mg: "engine/src/rules/marked-cards-aaa.test.ts",
  C7rGNWzwQJpMRcmLBbbQP: "engine/src/rules/marked-remaining-aaa.test.ts",
  RchmHdpjFdfQrcKkCn8MP: "engine/src/rules/marked-cards-aaa.test.ts",
  qQKjHgDgPhRzrhQTkTf7N: "engine/src/rules/marked-cards-aaa.test.ts",
  kBGMnLgMjhm9DPqzNCWwb: "engine/src/rules/marked-cards-aaa.test.ts",
  P768PhtTzKDbp9gCpqtFC: "engine/src/rules/marked-cards-aaa.test.ts",
  WPdnr6nkq86kzNgfjjqtg: "engine/src/rules/marked-cards-aaa.test.ts",
  kzPMkNT6bGwHTdGCqGBBj: "engine/src/rules/marked-cards-aaa.test.ts",
  WtHNCTfp87TNpG7jLRKFR: "cards/src/cards/actions/defang-the-dragon.test.ts",
  CzcCpTjr7dMR96NzwhLdk: "cards/src/cards/actions/extinguish-the-flames.test.ts",
  hCc9J9k6MLJPh7rgzRhwg: "engine/src/rules/marked-cards-aaa.test.ts",
  "8PNj9qcfb8mnpfGwQBncz": "engine/src/rules/marked-cards-aaa.test.ts",
  LwCDpdzLhqfQCJNBFCMcj: "engine/src/rules/marked-cards-aaa.test.ts",
  "9JwCpdKkGbHhD6JfmK687": "engine/src/rules/marked-cards-aaa.test.ts",
  nDLtfLWzrmGBGbB8mFdDw: "engine/src/rules/marked-cards-aaa.test.ts",
  PPzjfmqjC76wFt8RHT8K8: "engine/src/rules/marked-cards-aaa.test.ts",
  qDPLzntJrMhgwd86gTN97: "engine/src/rules/marked-cards-aaa.test.ts",
  cJwfJgPHC8M7fQgrMhKHC: "engine/src/rules/marked-cards-aaa.test.ts",
  "7qKwRbLbdMzcBLLJK9d6R": "engine/src/rules/marked-cards-aaa.test.ts",
  Tn8F8pBjHjqW7rfPLw9Wg: "engine/src/rules/marked-cards-aaa.test.ts",
  r7GmThKTHQtDW6RcFbdPR: "engine/src/rules/marked-cards-aaa.test.ts",
  nM9GmbLjcNCPLTjfBH7fk: "engine/src/rules/marked-cards-aaa.test.ts",
  bMLgLcCJHFbLj6bwqqNRN: "engine/src/rules/marked-cards-aaa.test.ts",
  "9nTj8GF9trQwMPgCzGq8w": "engine/src/rules/marked-cards-aaa.test.ts",
  fdPTtmjCBrQLfrMFNQb6P: "engine/src/rules/marked-cards-aaa.test.ts",
  CN9QrzcRcRDrRhPRqJCwk: "engine/src/rules/marked-cards-aaa.test.ts",
  Mg77gjkkQbDzcK6cQfBGf: "engine/src/rules/marked-cards-aaa.test.ts",
  FH6ffcgjbnGTRQTtwwWGh: "engine/src/rules/marked-cards-aaa.test.ts",
  wNtNbFgrfzcjJTMwRbkcg: "engine/src/rules/marked-remaining-aaa.test.ts",
  CKFCLPKmb6nMQW9Jqjdz8: "engine/src/rules/marked-cards-aaa.test.ts",
  HRtHpngjPbHNKCFMbJw7m: "engine/src/rules/marked-cards-aaa.test.ts",
  mGmcTdzdtkJWq8D8Tnrgj: "engine/src/rules/marked-cards-aaa.test.ts",
  tJkqhqDjdMM76hrkMmJJD: "engine/src/rules/marked-cards-aaa.test.ts",
  p6DK6rNGjz8HrpwNmCgQL: "engine/src/rules/marked-cards-aaa.test.ts",
  P9DWCqqTwtKLnhNzLHnnp: "engine/src/rules/marked-cards-aaa.test.ts",
  "969HqThPzMmQtFhM9mNq8": "engine/src/rules/marked-remaining-aaa.test.ts",
  MqqQjwqcHRj7WnG96DPMH: "engine/src/rules/marked-cards-aaa.test.ts",
  "8gG7kjNqwhwftdGHjCQnq": "engine/src/rules/marked-cards-aaa.test.ts",
  j8jg6Htq98C6ChrtPMhhJ: "engine/src/rules/marked-cards-aaa.test.ts",
  "9bntMjr9pHrLdnpNmKtPk": "engine/src/rules/marked-cards-aaa.test.ts",
  gNzpTNpKbgmFnGtzhdTcq: "engine/src/rules/marked-cards-aaa.test.ts",
  dbKgpPzLgwFdjfrhRmbgK: "engine/src/rules/marked-cards-aaa.test.ts",
  cqpqWdPdBWCLfHzrR9rHt: "engine/src/rules/marked-cards-aaa.test.ts",
  kfQHGNNdKjPpG8nWkfB9P: "engine/src/rules/marked-cards-aaa.test.ts",
  bFDwJwbqJQPJpcnHRjLCj: "engine/src/rules/marked-cards-aaa.test.ts",
  kD7jpPzWkNtFz6LTkk8HQ: "engine/src/rules/marked-turn-history-aaa.test.ts",
  G7WBwbd7TnnMMp8R9tkMw: "engine/src/rules/marked-cards-aaa.test.ts",
  mMzzGF76cFfFHJQJTFcnB: "engine/src/rules/marked-remaining-aaa.test.ts",
  nmc8wLKtTmPhJFb7FH8BG: "cards/src/cards/actions/savor-bloodshed.test.ts",
  hznLkw6NwCdwhnH9KbKdF: "engine/src/rules/marked-cards-aaa.test.ts",
  zGMwPW7DFJjTJBBdnmfwD: "engine/src/rules/marked-cards-aaa.test.ts",
  "7tkH9LH8hHKQLmBGNJrM6": "engine/src/rules/marked-cards-aaa.test.ts",
  D6JbcW8RH7kTQqrp9CLwb: "engine/src/rules/marked-remaining-aaa.test.ts",
  FpRhRwNmrPWrT7chpRJDj: "engine/src/rules/marked-remaining-aaa.test.ts",
  "8tnJpPbzJqbBBdPBpc8Wt": "engine/src/rules/marked-remaining-aaa.test.ts",
  GHfNcPpwFnQttfmWMDq86: "engine/src/rules/marked-cards-aaa.test.ts",
  KjLnGJk9WwJKDbRtpBRKG: "engine/src/rules/marked-cards-aaa.test.ts",
  DkcD8cfprKB8RPWLKdMhf: "engine/src/rules/marked-remaining-aaa.test.ts",
  b7j6PpNMGdBQndqjMtcHt: "engine/src/rules/marked-remaining-aaa.test.ts",
  mrHRpJzKbQPN9TnLb6mjd: "engine/src/rules/marked-remaining-aaa.test.ts",
  jmNMNj8FrgJCR8dCcbmTr: "engine/src/rules/marked-remaining-aaa.test.ts",
  W6dTQMgChGpqBdDnrp6g8: "engine/src/rules/marked-cards-aaa.test.ts",
  w7prWHb7LbrPMChNMdHzq: "engine/src/rules/marked-cards-aaa.test.ts",
  DDBjrbFWMHqkc7Pkqr6f6: "engine/src/rules/marked-cards-aaa.test.ts",
  "9CjK6W9dqPdJrfthqqKCD": "engine/src/rules/marked-cards-aaa.test.ts",
  Hfwh8FM6w6kLD76KtdhKK: "engine/src/rules/marked-cards-aaa.test.ts",
  "867HbTJM7BhLzBFgFzDdN": "engine/src/rules/marked-cards-aaa.test.ts",
  jhHRPW9NgMWC66TRC9G8d: "engine/src/rules/marked-cards-aaa.test.ts",
  fnrjjBNqBwWQb7PhMtmzC: "engine/src/rules/marked-remaining-aaa.test.ts",
  d7bwjcFhcrtN6btzhrdWB: "engine/src/rules/marked-cards-aaa.test.ts",
  tBg8fnqMkfmjJgNFPmKKf: "engine/src/rules/marked-cards-aaa.test.ts",
  jPmQzcTkTDjMfbGHpdnr9: "engine/src/rules/marked-cards-aaa.test.ts",
  jfMpJKPFjR6kCpQnFJQdJ: "engine/src/rules/marked-cards-aaa.test.ts",
  J97rQmTfP6zTBJBbmzBJj: "cards/src/cards/attack-reactions/fresh-from-the-forge.test.ts",
};

export interface MarkedLedgerEntry {
  readonly canonicalId: string;
  readonly slug: string;
  readonly role: MarkedCardRole;
  readonly family:
    | "mark-on-hit"
    | "mark-on-attack"
    | "mark-from-reaction-or-action"
    | "mark-from-defend-trigger"
    | "mark-granted-to-next-attack"
    | "marked-hit-trigger"
    | "marked-attack-benefit"
    | "marked-cost-or-resolution-benefit"
    | "opponent-marked-condition";
  readonly aaaOwner: string | null;
}

function text(card: FleshAndBloodCard): string {
  return JSON.stringify(card);
}

export function markedLedgerEntries(
  cards: Iterable<FleshAndBloodCard>,
): readonly MarkedLedgerEntry[] {
  return [...cards].flatMap((card) => {
    const value = text(card);
    const has = (needle: string) => value.includes(needle);
    const base = {
      canonicalId: card.canonicalId,
      slug: card.slug,
    } as const;
    const aaaOwner = MARKED_AAA_OWNERS[card.canonicalId] ?? null;
    const entries: MarkedLedgerEntry[] = [];
    if (card.canonicalId === "d7MHfCqtjhKzp6cLRJQCQ") {
      entries.push({
        ...base,
        role: "condition-artifact",
        family: "opponent-marked-condition",
        aaaOwner,
      });
    }
    if (has('"type":"mark"')) {
      const family = has('"name":"hit"')
        ? "mark-on-hit"
        : has('"name":"attack"')
          ? "mark-on-attack"
          : has('"name":"defend"')
            ? "mark-from-defend-trigger"
            : has('"kind":"ability"')
              ? "mark-granted-to-next-attack"
              : "mark-from-reaction-or-action";
      entries.push({
        ...base,
        role: "producer",
        family,
        aaaOwner,
      });
    }
    if (
      has('"hasStatus":"marked"') ||
      has('"type":"is-marked"') ||
      has("attacking-a-marked-hero")
    ) {
      const family =
        has('"name":"hit"') && has('"hasStatus":"marked"')
          ? "marked-hit-trigger"
          : has("attacking-a-marked-hero")
            ? "marked-attack-benefit"
            : has('"type":"is-marked"')
              ? "opponent-marked-condition"
              : "marked-cost-or-resolution-benefit";
      entries.push({
        ...base,
        role: "consumer",
        family,
        aaaOwner,
      });
    }
    return entries;
  });
}

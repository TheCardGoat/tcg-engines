/**
 * Reviewed canonical relationships for CR 9.1 physical cards.
 * Concrete card identities belong to the cards package, not generic FAB types.
 */
export type FabDoubleFacedCardSpec =
  | {
      readonly kind: "flip";
      readonly family: "figment" | "invocation" | "construct";
      readonly frontCanonicalId: string;
      readonly backCanonicalId: string;
    }
  | {
      readonly kind: "twin" | "transcend";
      readonly frontCanonicalId: string;
      readonly backCanonicalId: string;
    };

export const FAB_DOUBLE_FACED_CARD_SPECS: readonly FabDoubleFacedCardSpec[] = [
  {
    kind: "twin",
    frontCanonicalId: "WqTTMjDgKKCp7Lnb7LH6d",
    backCanonicalId: "8qdmprPg7kckn8ktMTKQh",
  },
  {
    kind: "twin",
    frontCanonicalId: "6gqTwGnmHjkCLDqKPWt8c",
    backCanonicalId: "DBhPCQqjnj6qqd9DtBB7W",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "RNCWjkhhdhrHCNRncqznq",
    backCanonicalId: "hHTFWRhbq9F7CwwbQqNQ8",
  },
  {
    kind: "flip",
    family: "figment",
    frontCanonicalId: "cWRWbKczR8N8F6nGBMNG7",
    backCanonicalId: "JR9JmbdnQ8mTLfjMHf9n8",
  },
  {
    kind: "flip",
    family: "figment",
    frontCanonicalId: "gKQKG87JCtBgqDDrcBmcF",
    backCanonicalId: "8cQmdjw8zKNzddKkwcHWj",
  },
  {
    kind: "flip",
    family: "figment",
    frontCanonicalId: "FhzPFCDrDhK8QbjFRfHLk",
    backCanonicalId: "KtgRgFrrFDpzMQDJLLMwt",
  },
  {
    kind: "flip",
    family: "figment",
    frontCanonicalId: "kJdRmr6CLhJ9LznJkmcJb",
    backCanonicalId: "PBFbJTw6qrKRHPHPDCrMT",
  },
  {
    kind: "flip",
    family: "figment",
    frontCanonicalId: "ThhTfhmkkjr6DJR8hwQjt",
    backCanonicalId: "Mc6fWtzKjhpfgWd9h99nh",
  },
  {
    kind: "flip",
    family: "figment",
    frontCanonicalId: "mtTHBQB9qrJDzrMpJtfRw",
    backCanonicalId: "9FTLChcm8Jkpnhmhh8CPK",
  },
  {
    kind: "flip",
    family: "figment",
    frontCanonicalId: "zcGjRmHTgMkN7Fwzhkkp6",
    backCanonicalId: "RCqkLt7cqwdWMNrmFqpc8",
  },
  {
    kind: "flip",
    family: "figment",
    frontCanonicalId: "qrhLKPQDzcR99cHLz7jgq",
    backCanonicalId: "QLkz9dFQmJGnCtCRLJ9QC",
  },
  {
    kind: "twin",
    frontCanonicalId: "qjqqRn6kHWHGz6PQGWd7z",
    backCanonicalId: "dbrfzmNJ9ccB9CW68pmQp",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "mjFjGKmpGbTCnrJR6fN79",
    backCanonicalId: "wCLt8CtdLmrbMPcqLCzqc",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "J6bjpTRPwRCmLTMcWTPWH",
    backCanonicalId: "7GqwMzK8mCrkKQ9kdpF7W",
  },
  {
    kind: "transcend",
    frontCanonicalId: "CqNB8MLzfCh6tRP6RRMdj",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "transcend",
    frontCanonicalId: "mzKLGwTBmFHFd8KNdPQ7n",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "transcend",
    frontCanonicalId: "jpWjmrzckFnCzG8tFMppt",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "transcend",
    frontCanonicalId: "PtqHmkzqPMf9KBfk88QrR",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "67zdgKFWD7qzcPppbRHNB",
    backCanonicalId: "BRpMLJdMBPgfJNJLJWDFg",
  },
  {
    kind: "transcend",
    frontCanonicalId: "c8CdW9QBrMJPh6nwJGJ6Q",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "transcend",
    frontCanonicalId: "GJzhGm6bb6gW8nMBgQRbz",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "transcend",
    frontCanonicalId: "cdb8cTqP9MRgwqr7Q6rHQ",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "twin",
    frontCanonicalId: "ffKGNQcWnLkfQD7w66MRL",
    backCanonicalId: "wqmMJj8PqzNHg7Q7LMqTR",
  },
  {
    kind: "twin",
    frontCanonicalId: "RLJggjWTcq6NK9PD9zQGh",
    backCanonicalId: "QMGnHJqg6fhcKLfmpRQLz",
  },
  {
    kind: "twin",
    frontCanonicalId: "zggWCkTJQgBjj7FCDTwmQ",
    backCanonicalId: "QMGnHJqg6fhcKLfmpRQLz",
  },
  {
    kind: "transcend",
    frontCanonicalId: "m9tj8WGNNjQPt8wjMqFFf",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "transcend",
    frontCanonicalId: "7fN6NNBdf9KQF9gWWpdzL",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "transcend",
    frontCanonicalId: "pjpcnH9bKnGR6KFCFGz6Q",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "transcend",
    frontCanonicalId: "DgHLhRDccpLbjGT9nN8Jm",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "LTzk7nGqnkqRdddd9LRjQ",
    backCanonicalId: "gwz9PFtw8TdHG9DDTDctw",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "NTnphGB9GCpfrLRQRcNbj",
    backCanonicalId: "RP6pJj9WtwbTT79qdHPkz",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "7hQbqFfrRpbMKBWT8DG97",
    backCanonicalId: "DW7LjrR6RwKPhNB8d9CGM",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "jRmPPnCdbT97fBdhK9jhq",
    backCanonicalId: "NRHdp6LTtCDKbJngJPCmN",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "6LLwpNzLJBgr8c8nTqdmr",
    backCanonicalId: "gGmbgrQrzhKpFdtcRTF9h",
  },
  {
    kind: "flip",
    family: "construct",
    frontCanonicalId: "PL9FMwTgW7WnnKfbhRWRG",
    backCanonicalId: "nkCCKCB8ftPdMCHHWHWtk",
  },
  {
    kind: "transcend",
    frontCanonicalId: "gJH8NpPRNdFtTbDQTDzHL",
    backCanonicalId: "FRTnBzBCRC7TbNhdKLWqW",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "BPPzktrTM7CqMKmbmmkDH",
    backCanonicalId: "78FGMN9nn9QR9FDzC9z68",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "C7PG6mkm7JPNTBWKJwHpt",
    backCanonicalId: "JQqp6Ctw7QMLRDMgTnW6g",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "wjwFgpKPTgkKNGgr8Q7JK",
    backCanonicalId: "hjggcdqWwpwNKCrTBj6J7",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "QJKrt7FrgBJqNBhfjbmCP",
    backCanonicalId: "wBNMRCQPNBjPcfJwgrf9j",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "zRfhznJbJjhPqrtCqNMPT",
    backCanonicalId: "hnnpkTnnFPR76kw7qg7mr",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "qRbQCrnwpWm7mtbfpcFn7",
    backCanonicalId: "PHgMJBpk9fJcWNrrnqztz",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "QLFBGCzhjCqFKrPBn7GFN",
    backCanonicalId: "Nhdt8dQ86kQhLgFd8cd8z",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "QjT7Pt8nTWqtfT6GbrQnJ",
    backCanonicalId: "b886KqRJLbpj78kHWMQJ9",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "PWGBRjB7mhQJNkq896RNz",
    backCanonicalId: "dR8hjTth9bHpdLfTBPLNM",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "8htBPWMfPrM8bzjf8LrCr",
    backCanonicalId: "HBMfgJPgbmbWzJrRtJCjk",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "KWR8NHg7qbrP9rnbfWPr7",
    backCanonicalId: "MFrJG8G8RgrhkpfkD8KWj",
  },
  {
    kind: "flip",
    family: "invocation",
    frontCanonicalId: "9J9c98JJDc8mtKnRR9hhq",
    backCanonicalId: "gqTpfTkztdLpN8W6TpRtR",
  },
] as const;

export const FAB_DOUBLE_FACED_BACK_CANONICAL_IDS: ReadonlySet<string> = new Set(
  FAB_DOUBLE_FACED_CARD_SPECS.map((spec) => spec.backCanonicalId),
);

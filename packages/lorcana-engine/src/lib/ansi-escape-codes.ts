export const ANSI_ESCAPE_CODES = {
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
  BG_GREEN: "\x1b[42m",
  BG_RED: "\x1b[41m",
  END: "\x1b[0m",
};

export const ansiEscape = (text: string, code: string) =>
  `${code}${text}${ANSI_ESCAPE_CODES.END}`;

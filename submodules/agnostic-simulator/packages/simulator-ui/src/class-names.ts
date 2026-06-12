export type ClassValue = string | false | null | undefined;

export const cx = (...classNames: ClassValue[]): string =>
  classNames.filter((className): className is string => Boolean(className)).join(" ");

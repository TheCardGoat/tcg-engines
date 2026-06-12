/**
 * Evaluate a numeric comparison using the standard Lorcana operator aliases.
 *
 * Supported operators (all aliases):
 *   eq / equal
 *   ne / not-equal
 *   gt / greater / greater-than / more-than
 *   gte / greater-or-equal / or-more
 *   lt / less / less-than
 *   lte / less-or-equal / or-less
 */
export function compareOperator(
  left: number,
  operator: string | undefined,
  right: number,
): boolean {
  switch (operator) {
    case "eq":
    case "equal":
      return left === right;
    case "ne":
    case "not-equal":
      return left !== right;
    case "gt":
    case "greater":
    case "greater-than":
    case "more-than":
      return left > right;
    case "gte":
    case "greater-or-equal":
    case "or-more":
      return left >= right;
    case "lt":
    case "less":
    case "less-than":
      return left < right;
    case "lte":
    case "less-or-equal":
    case "or-less":
      return left <= right;
    default:
      return false;
  }
}

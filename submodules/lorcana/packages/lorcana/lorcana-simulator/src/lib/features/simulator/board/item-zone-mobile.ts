interface ScrollableItemMetrics {
  offsetLeft: number;
  offsetWidth: number;
}

interface CountHiddenScrollableItemsOptions {
  viewportLeft: number;
  viewportWidth: number;
  elements: ScrollableItemMetrics[];
  tolerance?: number;
}

interface GetScrollableItemStepOptions {
  viewportWidth: number;
  elements: ScrollableItemMetrics[];
}

export function getInitialHiddenItemsToRight(
  layoutMode: "desktop" | "mobile" | "tablet",
  itemCount: number,
  visibleSlots: number = 2,
): number {
  if (layoutMode !== "mobile") {
    return 0;
  }

  return Math.max(0, itemCount - visibleSlots);
}

export function countHiddenScrollableItems({
  viewportLeft,
  viewportWidth,
  elements,
  tolerance = 8,
}: CountHiddenScrollableItemsOptions): { left: number; right: number } {
  const viewportRight = viewportLeft + viewportWidth;

  return {
    left: elements.filter((element) => element.offsetLeft + tolerance < viewportLeft).length,
    right: elements.filter((element) => {
      const elementRight = element.offsetLeft + element.offsetWidth;
      return elementRight - tolerance > viewportRight;
    }).length,
  };
}

export function getScrollableItemStep({
  viewportWidth,
  elements,
}: GetScrollableItemStepOptions): number {
  const firstElement = elements[0];
  if (!firstElement) {
    return viewportWidth * 0.8;
  }

  const secondElement = elements[1];
  if (secondElement) {
    return Math.max(secondElement.offsetLeft - firstElement.offsetLeft, firstElement.offsetWidth);
  }

  return firstElement.offsetWidth;
}

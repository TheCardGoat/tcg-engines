import type { ReactNode } from "react";

export function AnimationInteractionBoundary({
  active,
  children,
  className,
}: {
  readonly active: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <div
      className={className}
      aria-busy={active || undefined}
      inert={active || undefined}
      data-animation-interaction-boundary=""
    >
      {children}
    </div>
  );
}

import { useMemo, type CSSProperties, type HTMLAttributes } from "react";
import { Skeleton } from "@mantine/core";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  showIcon?: boolean;
}

export function SidebarMenuSkeleton({ className, showIcon = false, ...rest }: Props) {
  // Random width per row (50–90%) so a list of skeletons doesn't read as a
  // suspiciously uniform block. Memoised so it doesn't re-roll on each render.
  const width = useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={`${classes.menuSkeleton} ${className ?? ""}`}
      {...rest}
    >
      {showIcon ? <Skeleton height={16} width={16} radius="sm" /> : null}
      <Skeleton
        height={14}
        radius="sm"
        style={{ ["--skeleton-w" as string]: width } as CSSProperties}
        className={classes.menuSkeletonText}
      />
    </div>
  );
}

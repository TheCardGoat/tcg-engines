import { IconRotateClockwise } from "@tabler/icons-react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import classes from "./LandscapeNotice.module.css";

export interface LandscapeNoticeProps extends Omit<
  ComponentPropsWithRef<"div">,
  "title" | "children"
> {
  title?: ReactNode;
  body?: ReactNode;
  detail?: ReactNode;
  actions?: ReactNode;
}

/** Shared guidance only. Each game owns its orientation policy and keeps its match mounted. */
export function LandscapeNotice({
  title = "Turn to landscape",
  body = "The full board needs a wider view.",
  detail = "Your match continues while you rotate.",
  actions,
  className,
  ...props
}: LandscapeNoticeProps) {
  return (
    <div {...props} className={[classes.layer, className].filter(Boolean).join(" ")}>
      <div className={classes.card}>
        <div className={classes.message} role="status">
          <span className={classes.iconPlate} aria-hidden="true">
            <IconRotateClockwise size={32} stroke={2} />
          </span>
          <p className={classes.eyebrow}>Orientation</p>
          <h2 className={classes.title}>{title}</h2>
          <p className={classes.body}>{body}</p>
          {detail ? <p className={classes.detail}>{detail}</p> : null}
        </div>
        {actions ? <div className={classes.actions}>{actions}</div> : null}
      </div>
    </div>
  );
}

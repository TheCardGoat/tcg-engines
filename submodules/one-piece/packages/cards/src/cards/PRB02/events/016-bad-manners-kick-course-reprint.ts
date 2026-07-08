import type { EventCard } from "@tcg/op-types";
import { op04BadMannersKickCourse016 } from "../../OP04/events/016-bad-manners-kick-course.ts";
import { prb02BadMannersKickCourseReprint016I18n } from "./016-bad-manners-kick-course-reprint.i18n.ts";

export const prb02BadMannersKickCourseReprint016: EventCard = {
  ...op04BadMannersKickCourse016,
  id: "OP04-016_r1",
  slug: "bad-manners-kick-course-reprint",
  name: "Bad Manners Kick Course (Reprint)",
  printings: [
    {
      id: "OP04-016_r1",
      artId: "OP04-016_r1",
      setCode: "PRB02",
      collectorNumber: "016",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-016_r1.jpg",
    },
    {
      id: "OP04-016_P1",
      artId: "OP04-016_P1",
      setCode: "PRB02",
      collectorNumber: "016",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-016_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-016_p1.jpg",
      imageId: "OP04-016_P1",
    },
  ],
  i18n: prb02BadMannersKickCourseReprint016I18n,
};

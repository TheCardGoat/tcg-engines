import { useNavigate } from "react-router";
import AnimationFixturesPage from "../components/AnimationFixturesPage";

export default function AnimationFixturesRoute() {
  const navigate = useNavigate();
  return <AnimationFixturesPage onNavigate={(path) => void navigate(path)} />;
}

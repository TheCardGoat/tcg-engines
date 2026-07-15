import { useNavigate } from "react-router";
import GameIndex from "../components/GameIndex";

export default function IndexRoute() {
  const navigate = useNavigate();
  return <GameIndex onNavigate={(path) => void navigate(path)} />;
}

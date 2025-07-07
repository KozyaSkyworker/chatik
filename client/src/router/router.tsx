import { createBrowserRouter } from "react-router";
import App from "../App";
import { Chat } from "../components/chat";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.APP,
    element: <App />,
  },
  {
    path: ROUTES.CHAT,
    element: <Chat />,
  },
]);

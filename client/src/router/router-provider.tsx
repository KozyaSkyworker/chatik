import { RouterProvider as RouterProviderLib } from "react-router";
import { router } from "./router";

export const RouterProvider = () => {
  return <RouterProviderLib router={router} />;
};

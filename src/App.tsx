

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { HomePage } from "./pages/home/home-page";
import { PackageDetailPage } from "./pages/detail/detail-page";
import Layout from "./layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        index: true,
        element: <HomePage />,
      },
      {
        path: "/packages/:packageName",
        element: <PackageDetailPage />,
      },
    ],
  }
]);


export function App() {
  return <RouterProvider router={router} />;
}

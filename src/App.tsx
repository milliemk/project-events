import Home from "./pages/Home";
import "../src/styles/main.css";
import Events from "./pages/Events";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import ErrorPage from "./pages/ErrorPage";
import EventDetails from "./pages/EventDetails";
import { AuthContextProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import MyProfile from "./pages/MyProfile";
import Footer from "./components/Footer";

const Root = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="events" element={<Events />} />
      <Route
        path="events/:eventId"
        element={
          <ProtectedRoute>
            <EventDetails />{" "}
          </ProtectedRoute>
        }
      />

      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MyProfile />{" "}
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  );
}

export default App;

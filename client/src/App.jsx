import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

const ShowData = React.lazy(() => import("./pages/ShowData"));
const AddTransaction = React.lazy(() => import("./pages/AddTransaction"));
const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtedtedRoutes>
              <Suspense>
                <AddTransaction />
              </Suspense>
            </ProtedtedRoutes>
          }
        />
        <Route
          path="/show-data"
          element={
            <ProtedtedRoutes>
              <Suspense>
                <ShowData />
              </Suspense>
            </ProtedtedRoutes>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};
export function ProtedtedRoutes(props) {
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;

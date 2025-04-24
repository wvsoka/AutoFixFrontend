import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Wszystkie publiczne strony osadzamy we wspólnym layoutcie */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            {/* Dodasz tu później np. */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            {/* <Route path="/register-client" element={<RegisterClientPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

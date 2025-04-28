import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { HomePage } from "./pages/public/HomePage";
import { RegisterClientPage } from "./pages/public/RegisterClientPage";
import { RegisterMechanicPage } from "./pages/public/RegisterMechanicPage";
import {LoginPage} from "./pages/public/LoginPage";
import ListOfMechanics from "./client-views/ListOfMechanics";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register-client" element={<RegisterClientPage />} />
                    <Route path="/register-mechanic" element={<RegisterMechanicPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route path="/services" element={<ListOfMechanics />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { HomePage } from "./pages/public/HomePage";
import { RegisterClientPage } from "./pages/public/RegisterClientPage";
import { RegisterMechanicPage } from "./pages/public/RegisterMechanicPage";
import {LoginPage} from "./pages/public/LoginPage";
import {MechanicProfilePage} from "./pages/mechanic/MechanicProfilePage";
import {MechanicPrivateLayout} from "./layouts/MechanicPrivateLayout";
import ListOfMechanics from "./pages/client/ListOfMechanics";
import WorkshopPage from "./pages/client/WorkshopPage";
import { MechanicMyServicesPage } from "./pages/mechanic/MechanicMyServicesPage";
import {SettingsPage} from "./pages/client/SettingsPage";
import MyOpinionsPage from "./pages/client/MyOpinionsPage";



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
                <Route element={<MechanicPrivateLayout />}>
                    <Route path="/mechanic/profile" element={<MechanicProfilePage />} />
                    <Route path="/mechanic/myservices" element={<MechanicMyServicesPage />} />
                </Route>
                <Route path="/services" element={<ListOfMechanics />} />
                <Route path="/workshop" element={<WorkshopPage />} />
                <Route path="/client/settings" element={<SettingsPage />} />
                <Route path="/client/my-opinions" element={<MyOpinionsPage />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

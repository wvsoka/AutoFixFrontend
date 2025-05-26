import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { MechanicPrivateLayout } from "./layouts/MechanicPrivateLayout";
import { HomePage } from "./pages/public/HomePage";
import { RegisterClientPage } from "./pages/public/RegisterClientPage";
import { RegisterMechanicPage } from "./pages/public/RegisterMechanicPage";
import { LoginPage } from "./pages/public/LoginPage";
import ListOfMechanics from "./pages/client/ListOfMechanics";
import WorkshopPage from "./pages/client/WorkshopPage";
import AppointmentsPage from "./pages/client/AppointmentsPage";
import { SettingsPage } from "./pages/client/SettingsPage";
import MyOpinionsPage from "./pages/client/MyOpinionsPage";
import { MechanicProfilePage } from "./pages/mechanic/MechanicProfilePage";
import { MechanicReviewsPage } from "./pages/mechanic/MechanicMyReviewsPage";
import { MechanicCalendar } from "./pages/mechanic/MechanicCalendar";
import { MechanicSettings } from "./pages/mechanic/MechanicSettings";
import MechanicAppointments from "./pages/mechanic/MechanicAppointments";
import { MechanicMyServicesPage } from "./pages/mechanic/MechanicMyServicesPage";

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
                    <Route path="/mechanic/reviews" element={<MechanicReviewsPage />}/>
                    <Route path="/mechanic/calendar" element={<MechanicCalendar />} />
                    <Route path="/mechanic/settings" element={<MechanicSettings/>} />
                    <Route path="/mechanic/appointments" element={<MechanicAppointments/>} />
                </Route>
                <Route path="/services" element={<ListOfMechanics />} />
                <Route path="/workshop/:id" element={<WorkshopPage />} />
                <Route path="/client/settings" element={<SettingsPage />} />
                <Route path="/client/my-opinions" element={<MyOpinionsPage />}/>
                <Route path="/client/my-appointments" element={<AppointmentsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

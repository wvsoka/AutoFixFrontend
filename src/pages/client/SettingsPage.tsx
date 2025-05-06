import React, { useState } from "react";
import "./SettingsPage.css";
import ClientNavbar from "../../components/navbars/ClientNavbar";

export const SettingsPage = () => {
    const [formData, setFormData] = useState({
        first_name: "Jan",
        last_name: "Kowalski",
        email: "jan.kowalski@example.com",
        phone: "123456789",
        password: "",
        newPassword:"",
        confirmPassword: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (formData.password && formData.password !== formData.confirmPassword) {
            setErrorMessage("Hasła nie są takie same.");
            return;
        }

        setSuccessMessage("Dane zostały zapisane (mock)!");
    };

    return (
        <div className="settings-container">
            <ClientNavbar/>
            <h1>Ustawienia konta</h1>
            <hr className="section-divider"/>
            <h2>Edytuj informacje o sobie</h2>
            <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Imię</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Nazwisko</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Numer telefonu</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <button type="submit" className="save-button">Zapisz zmiany</button>
            </form>
            <hr className="section-divider"/>
            <h2>Zmień hasło</h2>
            <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Aktualne hasło</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.password || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Nowe hasło</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Powtórz nowe hasło</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="save-button">Zmień hasło</button>
            </form>
        </div>
    );
};

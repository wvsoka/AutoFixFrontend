import React, {useEffect, useState} from "react";
import "./SettingsPage.css";
import ClientNavbar from "../../components/navbars/ClientNavbar";

export const SettingsPage = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/auth/me/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Pobrane dane użytkownika:", data); // Dodaj to logowanie
                    setFormData((prev) => ({
                        ...prev,
                        first_name: data.name || "",
                        last_name: data.surname || "",
                        email: data.email || "",
                        phone: data.phone || "",
                    }));
                } else {
                    setErrorMessage("Nie udało się pobrać danych użytkownika.");
                }
            } catch (error) {
                setErrorMessage("Błąd połączenia z serwerem.");
            }
        };

        fetchUserData();
    }, []);

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

        if (formData.oldPassword && formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Hasła nie są takie same.");
            return;
        }

        setSuccessMessage("Dane zostały zapisane (mock)!");
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:8000/api/auth/profile/update/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({
                    name: formData.first_name,
                    surname: formData.last_name,
                    email: formData.email,
                    phone: formData.phone,
                }),
            });

            if (response.ok) {
                setSuccessMessage("Dane zostały zapisane.");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Błąd podczas zapisu danych.");
            }
        } catch (error) {
            setErrorMessage("Błąd połączenia z serwerem.");
        }
    };


    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Nowe hasła nie są zgodne.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/auth/password/change/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({
                    old_password: formData.oldPassword,
                    new_password: formData.newPassword,
                }),
            });

            if (response.ok) {
                setSuccessMessage("Hasło zostało zmienione.");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.old_password || "Błąd przy zmianie hasła.");
            }
        } catch (error) {
            setErrorMessage("Błąd połączenia z serwerem.");
        }
    };





    return (
        <div className="settings-container">
            <ClientNavbar/>
            <h1>Ustawienia konta</h1>
            <hr className="section-divider"/>
            <h2>Edytuj informacje o sobie</h2>
            <form className="settings-form" onSubmit={handleProfileUpdate}>
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
            <form className="settings-form" onSubmit={handleChangePassword}>
                <div className="form-group">
                    <label>Aktualne hasło</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Nowe hasło</label>
                    <input
                        type="password"
                        name="newPassword"
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

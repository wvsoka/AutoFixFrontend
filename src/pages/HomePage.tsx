export const HomePage = () => {
    return (
        <div className="flex flex-col items-center text-center font-sans bg-[#f5f9fc]">
            {/* Hero section */}
            <section
                className="w-full h-[450px] bg-cover bg-center relative flex items-center justify-center"
                style={{ backgroundImage: "url('/hero-image.jpg')" }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-md">Zarezerwuj teraz</h1>
                    <p className="max-w-2xl text-lg drop-shadow-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rhoncus nunc nunc, vel tempus metus placerat in.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button className="bg-white text-blue-800 font-semibold px-6 py-2 rounded-lg border border-blue-800 shadow hover:bg-gray-100 transition">
                            Zaloguj się
                        </button>
                        <button className="bg-white text-blue-800 font-semibold px-6 py-2 rounded-lg border border-blue-800 shadow hover:bg-gray-100 transition">
                            Zarejestruj się
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

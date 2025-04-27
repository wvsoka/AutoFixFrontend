import { ReactNode } from "react";

interface PrimaryButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

export const PrimaryButton = ({ children, onClick, type = "button" }: PrimaryButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="bg-white text-[#1D3557] font-semibold px-6 py-2 rounded-lg border border-[#1D3557] shadow hover:bg-gray-100 transition"
        >
            {children}
        </button>
    );
};

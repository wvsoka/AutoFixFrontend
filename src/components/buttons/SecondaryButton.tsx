import { ReactNode } from "react";

interface PrimaryButtonProps {
    onClick?: () => void;
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    className?: string;
}

export const SecondaryButton = ({ onClick, children, type = "button" }: PrimaryButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="bg-[#457B9D] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#1D3557] transition shadow"
        >
            {children}
        </button>
    );
};

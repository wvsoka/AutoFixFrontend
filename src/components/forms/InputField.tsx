import {InputHTMLAttributes, JSX} from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: JSX.Element;
}

export const InputField = ({ icon, ...props }: InputFieldProps) => {
    return (
        <div className="relative w-full">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
            )}
            <input
                {...props}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#457B9D] transition"
            />
        </div>
    );
};

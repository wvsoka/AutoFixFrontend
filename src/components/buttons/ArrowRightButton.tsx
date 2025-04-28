import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface PrimaryButtonProps {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const ArrowRightButton = ({ onClick, type = "button" }: PrimaryButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#1D3557",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}
        >
            <ArrowForwardIcon style={{ color: "#F7F4EC" }} />
        </button>
    );
};

export default ArrowRightButton;

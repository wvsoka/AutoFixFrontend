import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './ArrowRightButton.css';

interface PrimaryButtonProps {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const ArrowRightButton = ({ onClick, type = "button" }: PrimaryButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="arrow-right-button"
        >
            <ArrowForwardIcon className="arrow-icon" />
        </button>
    );
};

export default ArrowRightButton;

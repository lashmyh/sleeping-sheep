import PropTypes from "prop-types";
import { Button } from "./Button";

export const ConfirmDialog = ({ isOpen, message, onCancel, onConfirm, type }) => {

    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-sky-dark rounded-3xl p-10 border-2 border-mauve">
                <p>{message}</p>

                {type === "warning" ? 
                    <div className="mt-10 flex justify-evenly">
                        <Button text="Cancel" colour="bg-neutral-500" action={onCancel}></Button>
                        <Button text="Confirm" colour="bg-red-400" action={onConfirm}></Button>
                    </div> : ""}

                {type === "error" ? 
                    <div className="mt-10 flex justify-evenly">
                        <Button text="Okay" action={onCancel}></Button>
                    </div> : ""}
                
            </div>
        </div>
    )
}

ConfirmDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    type: PropTypes.oneOf(["warning", "error"]).isRequired,
};
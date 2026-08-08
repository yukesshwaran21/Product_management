import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({
            message,
            type
        });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === "success" && "✓"}
                        {toast.type === "error" && "!"}
                        {toast.type === "warning" && "!"}
                    </div>

                    <div className="toast-content">
                        <strong>
                            {toast.type === "success"
                                ? "Success"
                                : toast.type === "error"
                                ? "Error"
                                : "Warning"}
                        </strong>

                        <span>{toast.message}</span>
                    </div>

                    <button
                        className="toast-close"
                        onClick={() => setToast(null)}
                    >
                        ×
                    </button>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
import { useRef, useEffect } from "react";

function OtpInput({ length = 6, otp, setOtp }) {
    const inputRef = useRef(null);

    const handleChange = (e) => {
        let value = e.target.value;

        value = value.replace(/\D/g, "");

        value = value.slice(0, length);

        setOtp(value);
    };

    const handleClick = () => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={length}
                value={otp}
                onChange={handleChange}
                className="absolute inset-0 opacity-0"
            />

            <div
                onClick={handleClick}
                className="flex justify-center gap-3 cursor-text"
            >
                {Array.from({ length }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-14 h-14 border-2 rounded-lg flex items-center justify-center text-2xl font-semibold transition
                        ${
                            index === otp.length && otp.length < length
                                ? "border-blue-500"
                                : "border-gray-300"
                        }`}
                    >
                        {otp[index] ? (
                            otp[index]
                        ) : index === otp.length && otp.length < length ? (
                            <div className="w-0.5 h-7 bg-black animate-caret rounded-full" />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OtpInput;
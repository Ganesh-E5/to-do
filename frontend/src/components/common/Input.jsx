import { forwardRef } from "react";

const Input = forwardRef(({ textarea = false,select = false, options = [] ,type, id, error, label, ...props }, ref) => {
    return (
        <div className="flex flex-col relative">
            {textarea  ? ( 
                <textarea
                    ref={ref}
                    id={id}
                    className="p-2 border peer w-full rounded-sm appearance-none outline-none focus:outline-none  focus:ring-0 placeholder:text-transparent"
                    placeholder=" "
                    {...props}
                />
            ): select ? (
                <select
                    ref={ref}
                    id={id}
                    className="p-2 border peer w-full rounded-sm appearance-none outline-none focus:outline-none focus:ring-0 placeholder:text-transparent"
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    ref={ref}
                    id={id}
                    type={type}
                    className="p-2 border peer w-full rounded-sm appearance-none outline-none focus:outline-none focus:ring-0 placeholder:text-transparent"
                    placeholder=" "
                    {...props}
                />)
            }
            <label
                htmlFor={id}
                className="absolute left-0 ml-1 mt-2 -translate-y-4 px-1 bg-white text-gray-500 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-4 peer-focus:px-1 peer-focus:text-sm"
            >
                {label}
            </label>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
});

export default Input;
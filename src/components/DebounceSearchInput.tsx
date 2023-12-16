import { SearchIcon } from "@/utils/IconMaker";
import React from "react";

const DebounceSearchInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative ">
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
        <SearchIcon />
      </div>
      <input
        {...props}
        value={value}
        className="border rounded-lg  bg-customBg pl-8 py-2"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default DebounceSearchInput;

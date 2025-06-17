import { Input } from "@heroui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
return (
    <div className="relative flex items-center rounded-xl">
    <Input
        classNames={{
        base: "max-w-full sm:max-w-[20rem] h-10",
        mainWrapper: "h-full",
        input: "text-small",
        inputWrapper:
            "rounded-md h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        placeholder="  Type to search..."
        size="sm"
        startContent={<Search size={18} />}
        type="search"
    />
    </div>
);
}

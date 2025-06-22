import { BentoGridDemo } from "@/components/bento-grid";

export default function Dashboard() {
    return (
        <div className="flex h-fit bg-gray-100">
            <main
                className="pt-8 pr-24 pb-8"
                style={{ width: "calc(100vw - 17rem)" }}
            >
                <BentoGridDemo />
            </main>
        </div>
    );
}
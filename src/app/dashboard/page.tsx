import { BentoGridDemo } from "@/components/bento-grid";

export default function Dashboard() {
    return (
        <div className="flex h-fit bg-gray-100">
            {/* Sidebar is rendered by dashboard layout and should have w-64 (16rem) */}
            <main
                className="pt-8 pr-24 pb-8"
                style={{ width: "calc(100vw - 17rem)" }}
            >
                <BentoGridDemo />
            </main>
        </div>
    );
}
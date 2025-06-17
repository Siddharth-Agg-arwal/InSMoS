"use client";

import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();

    const handleSubscribeClick = () => {
        router.push("/dashboard");
    };

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
            <h1 className="relative z-10 font-custom text-8xl font-bold tracking-tight lg:text-center">
                Welcome to
                <AuroraText className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                &nbsp;InSMoS
                </AuroraText>
            </h1>
            <div className="relative z-10 mt-10 flex items-center justify-center gap-4">
                <AnimatedSubscribeButton onClick={handleSubscribeClick}>
                    <span className="group inline-flex items-center">
                        Get Started
                        <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </AnimatedSubscribeButton>
            </div>
            
            <InteractiveGridPattern
                className={cn(
                    "[mask-image:radial-gradient(650px_circle_at_center,black,transparent)]",
                )}
                width={50}
                height={50}
                squares={[25, 25]}
                squaresClassName="hover:fill-[#777CFC]"
            />
        </div>
    );
}

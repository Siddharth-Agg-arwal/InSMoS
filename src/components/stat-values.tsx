export default function StatValue({ value }: { value: number }) {
    return(
        <div>
            <div className=" flex items-center align-middle justify-center gap-2 p-12.5">
                {/* <span className="text-sm text-muted-foreground">Stat Value</span> */}
                <span className="text-5xl font-semibold">{value}</span>
            </div>
            {/* <div className="mt-2 text-xs text-muted-foreground"> */}
                {/* This is a description of the stat value. */}
            {/* </div> */}
        </div>
    )
}
    import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table"

    const invoices = [
    {
        invoice: "Sid",
        paymentStatus: "Paid",
        totalAmount: "6",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "John",
        paymentStatus: "Pending",
        totalAmount: "5",
        paymentMethod: "PayPal",
    },
    {
        invoice: "Josh",
        paymentStatus: "Unpaid",
        totalAmount: "2",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "Tyler",
        paymentStatus: "Paid",
        totalAmount: "1",
        paymentMethod: "Credit Card",
    },
    
    ]

    export function HeighestSeizures() {
    return (
        <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            {/* <TableHead>Status</TableHead> */}
            {/* <TableHead>Method</TableHead> */}
            <TableHead className="text-right">Count</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                {/* <TableCell>{invoice.paymentStatus}</TableCell> */}
                {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        {/* <TableFooter>
            <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
        </TableFooter> */}
        </Table>
    )
    }

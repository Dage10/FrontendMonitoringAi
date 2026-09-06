import Link from "next/link";

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
    return (
        <>
            {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
            <aside className={`${open ? "fixed inset-y-0 left-0 z-50 w-64" : "hidden"} md:relative md:block md:w-64 min-h-screen bg-[#1E293B] p-4 text-white flex flex-col items-center`}>
                <ul className="flex flex-col items-center gap-2 pt-2">
                    <li>
                        <Link href="/dashboard" className="hover:text-[#6366F1]" onClick={onClose}>Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/services" className="hover:text-[#6366F1]" onClick={onClose}>Services</Link>
                    </li>
                </ul>
            </aside>
        </>
    );
}

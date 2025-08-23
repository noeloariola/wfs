export default function PlainLink({ children, href }: { children: React.ReactNode, href: string }) {
    return (
        <a href={href} className="text-white">
            {children}
        </a>
    )
}
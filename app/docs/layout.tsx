export default function MdxLayout({ children }: { children: React.ReactNode }) {
    // Remove all styling inserted by Tailwind preflight to ensure markdown looks correct
    return <div className="prose">{children}</div>
  }
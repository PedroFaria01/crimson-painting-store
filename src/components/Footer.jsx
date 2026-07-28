export default function Footer() {
  return (
    <footer className="mt-auto border-t border-cp-border px-10 py-9 flex items-center justify-between text-[13px] text-cp-muted-3">
      <div className="font-cinzel tracking-wide">CRIMSON PAINTING</div>
      <div>&copy; {new Date().getFullYear()} Crimson Painting. 3D miniatures and custom painting.</div>
    </footer>
  )
}

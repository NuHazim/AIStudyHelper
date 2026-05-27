import Image from "next/image";
import Header from "./components/Header";
export default function Home() {
  return (
    <div className="h-screen [background-image:linear-gradient(-45deg,#050510,#0a0a2e,#1a1a5e,#4a4ae8)] [background-size:400%_400%] [animation:var(--animate-gradient-shift)]">
      <Header/>
    </div>
  )
}

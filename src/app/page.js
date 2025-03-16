import Image from "next/image";
import bg from "../../public/background/Background3.png";
import RenderModel from "@/components/RenderModel";
import Sci_Fi_comp from "@/components/models/Sci_Fi_comp";
import Navigation from "@/components/navigation";
import ParticlesBackground from "@/components/Background/tsParticle";
import AboutPage from "@/components/About/AboutPage";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <Image
        src={bg}
        alt="background-image"
        fill
        className="w-full h-full object-cover object-center opacity-25"
        priority
      />

      <div className="w-full h-screen relative overflow-hidden">
        <ParticlesBackground />
        <Navigation />
        <RenderModel>
          <Sci_Fi_comp />
        </RenderModel>
      </div>
    </main>
  );
}

import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import Hero from "../components/home/Hero.jsx";
import { Galeria, Historia, VideoInstitucional } from "../components/home/Institucional.jsx";
import { DetalhamentoTecnico, VitrineServicos } from "../components/home/Vitrine.jsx";
import Fundadores from "../components/home/Fundadores.jsx";

export default function Home() {
  return (
    <>
      <Header />
      <main className="conteudo-central">
        <Hero />
        <Historia />
        <VideoInstitucional />
        <Galeria />
        <VitrineServicos />
        <DetalhamentoTecnico />
        <Fundadores />
      </main>
      <Footer completo />
    </>
  );
}

import Hero from "../components/Hero";
import Feature from "../components/Feature";
//import Trusted from "../components/Trusted";
import Stats from "../components/Stats";
import PopularTopics from "../components/PopularTopics";
import AIPreview from "../components/AIPreview";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
function Home() {
  return (
    <>
      <Hero />
      <Feature />
      {/*<Trusted />*/}
      <Stats /> 
      <PopularTopics />
      <AIPreview />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;
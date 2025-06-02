// src/pages/Home/Home.jsx (versão completa)
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import FounderCard from '../../components/FounderCard/FounderCard';
import './Home.css';

const trendingArts = [
  {
    id: 'art1',
    title: 'Grave Digging, 2025',
    author: 'Spikings',
    description: '"Sanctified by what\'s below."',
    url: 'https://www.deviantart.com/spikings/art/Grave-Digging-1180163776',
    imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/37afb3e4-0de2-47ce-ba5a-94cbff55600c/djin074-16b1aec6-f1de-4378-8858-9d74a32cfbec.png'
  },
  {
    id: 'art2',
    title: 'Nature Takes You, 2023',
    author: 'Spikings',
    description: '"I keep watch of his crypt by day"',
    url: 'https://www.deviantart.com/spikings/art/Nature-Takes-You-946015895',
    imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/37afb3e4-0de2-47ce-ba5a-94cbff55600c/dfn8ejb-fe8ad4be-f04c-4a2a-a83d-b68875f0a078.png'
  },
  {
    id: 'art3',
    title: 'Crow Revolution',
    author: 'MetshaCollective',
    description: '"A crow study"',
    url: 'https://www.deviantart.com/metshacollective/art/DarkChildFavs-170-997585397',
    imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5f3e7dde-7d6a-4b71-8e74-8c0d1c1549a6/dghxpth-03312fc7-45d4-44d3-8c3f-e025d71bbff1.jpg'
  },
  {
    id: 'art4',
    title: 'Louvre',
    author: 'BunSakashita',
    description: '"Sunset over the Louvre"',
    url: 'https://www.deviantart.com/bunsakashita/art/Louvre-1167733836',
    imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/07be8f49-e0da-4e5f-9a1f-ab7e32576dbf/djb8l70-8340c0c7-3e5e-439c-9e8f-3267d0416e3f.jpg'
  }
];

const founders = [
  {
    name: "Lucas Fernandes",
    role: "CKO · Full Stack Web Developer",
    cvLink: "/assets/cvs/Lucas Fernandes.md",
    imageUrl: "https://media.licdn.com/dms/image/v2/C4E03AQE6BqqwUSrW1g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1639008237663"
  },
  {
    name: "Marília Pereira",
    role: "CTO · Security Blue Team",
    cvLink: "/assets/cvs/Marilia Pereira.md",
    imageUrl: "https://media.licdn.com/dms/image/v2/C4E03AQH_v-ntDU_PFw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1647698585672"
  },
  {
    name: "Giovanna Numeriano",
    role: "CEO · Security Red team",
    cvLink: "/assets/cvs/Giovanna Numeriano.md",
    imageUrl: "https://media.licdn.com/dms/image/v2/C4D03AQG_5iekZDVrug/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1616006771661"
  }
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="main">
        {/* ... (restante do código permanece igual) ... */}
        
        <div className="gallery-titles">
          <p>
            {trendingArts.map((art, index) => (
              <span key={art.id}>
                <a href={`#${art.id}`}>{art.title.split(',')[0]}</a>
                {index < trendingArts.length - 1 && ' · '}
              </span>
            ))}
          </p>
        </div>

        <div className="gallery">
          {trendingArts.map(art => (
            <a key={art.id} href={art.url} target="_blank" rel="noopener noreferrer" id={art.id}>
              <div className="digital-painting">
                <img src={art.imageUrl} alt={art.title} />
                <div className="art-info">
                  <h4>{art.title}</h4>
                  <p>Author: {art.author}</p>
                  <p>{art.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <h2 className="founders-title">Company Founders</h2>
        <table className="founders">
          <tbody>
            <tr>
              <td>
                <FounderCard {...founders[0]} />
              </td>
              <td>
                <FounderCard {...founders[1]} />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <FounderCard {...founders[2]} />
              </td>
            </tr>
          </tbody>
        </table>
      </main>
      <Footer />
    </>
  );
}
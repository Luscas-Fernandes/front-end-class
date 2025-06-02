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
    cvLink: "../../public/assets/cvs/Lucas Fernandes.md",
    imageUrl: "https://media.licdn.com/dms/image/v2/C4E03AQE6BqqwUSrW1g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1639008237663?e=1752105600&v=beta&t=q7Zpq7AbECEW8D7d7X1IyLkEqRkKfWfy8yJGIKbALF8"
  },
  {
    name: "Marília Pereira",
    role: "CTO · Security Blue Team",
    cvLink: "../../public/assets/cvs/Marilia Pereira.md",
    imageUrl: "https://media.licdn.com/dms/image/v2/C4E03AQH_v-ntDU_PFw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1647698585672?e=1752105600&v=beta&t=jTyghxdmDjp0NCJbO9jt34v3-gbM1TjNHeZs9nhpCoU"
  },
  {
    name: "Giovanna Numeriano",
    role: "CEO · Security Red team",
    cvLink: "../../public/assets/cvs/Giovanna Numeriano.md",
    imageUrl: "https://media.licdn.com/dms/image/v2/C4D03AQG_5iekZDVrug/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1616006771661?e=1752105600&v=beta&t=rCkjXE1mqPR0om__7lxSRnIvfEdgD7AUOZm3tjhEiTo"
  }
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="main">
        <div className="who-are-we">
            <h2 className="who-are-we-title">Who we are</h2>

            <iframe width="560" height="315" src="https://www.youtube.com/embed/7XlBK5ySQYA?si=P3Johu0CS4czoJtm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

            <div className="who-are-we-history">
                <p>We are an <b>anti AI</b> plagiarism art gallery tech company, with the purpose of protecting art from AI.</p>
                <p>Born in 2025, we are a <span>art gallery</span> that introduces biases/noise to your art and protect it from AI to learn it.</p>
            </div>

            <div className="installation">
                <h2 className="who-are-we-title">Our Installation</h2>

                <div className="our-team">
                    <img src="../../public/assets/imgs/pessoal-trabalhando.png" alt=""/>
                    <img src="../../public/assets/imgs/instalacao.jpg" alt=""/>
                </div>
            </div>

        </div>
        
        <div className="offerings">
            <h2 className="offerings-title">What we do offer</h2>
            <ul>
                <li>
                    <p className="offering-item-title">Art Gallery</p>
                    <p>We offer an individual art gallery to each artist who wishes to use our services. Our gallery includes the possibility to use our anti AI copy service.</p>
                </li>

                <li>
                    <p className="offering-item-title">Protection from AI plagiarism</p>
                    <p>With the usage of noise added to the image, imperceptible to the human eyes, but making it impossible to AI to recognize the drawing patterns of the image.</p>
                </li>
            </ul>
        </div>

        <div className="today-art">
            <p className="" style={{ textAlign: 'center' }}>Today's Trending Arts</p>
        </div>
        
        <div className="gallery-titles">
            <p>
            <a href="#art1">Grave Digging</a> ·
            <a href="#art2">Nature Takes You</a> ·
            <a href="#art3">Crow Revolution</a> ·
            <a href="#art4">Louvre</a>
            </p>
        </div>

        <div className="gallery">
            <a href="https://www.deviantart.com/spikings/art/Grave-Digging-1180163776" target="_blank" id="art1">
            <div className="digital-painting">
                <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/37afb3e4-0de2-47ce-ba5a-94cbff55600c/djin074-16b1aec6-f1de-4378-8858-9d74a32cfbec.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM3YWZiM2U0LTBkZTItNDdjZS1iYTVhLTk0Y2JmZjU1NjAwY1wvZGppbjA3NC0xNmIxYWVjNi1mMWRlLTQzNzgtODg1OC05ZDc0YTMyY2ZiZWMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.MoAMKa6shgCg_BqhI1P2SGIPWTGnRONSItF6UVuwY48" alt="art"/>
                <div className="art-info">
                <h4>Grave Digging, 2025</h4>
                <p>Author: Spikings</p>
                <p>"Sanctified by what's below."</p>
                </div>
            </div>
            </a>
            
            <a href="https://www.deviantart.com/spikings/art/Nature-Takes-You-946015895" target="_blank" id="art2">
            <div className="digital-painting">
                <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/37afb3e4-0de2-47ce-ba5a-94cbff55600c/dfn8ejb-fe8ad4be-f04c-4a2a-a83d-b68875f0a078.png/v1/fill/w_1280,h_1811,q_80,strp/nature_takes_you_by_spikings_dfn8ejb-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTgxMSIsInBhdGgiOiJcL2ZcLzM3YWZiM2U0LTBkZTItNDdjZS1iYTVhLTk0Y2JmZjU1NjAwY1wvZGZuOGVqYi1mZThhZDRiZS1mMDRjLTRhMmEtYTgzZC1iNjg4NzVmMGEwNzgucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.PIN9V_mFUfiFc6tjPehdxOhaeXsiE0R1rtE78loxKuM" alt="art"/>
                <div className="art-info">
                <h4>Nature Takes You, 2023</h4>
                <p>Author: Spikings</p>
                <p>"I keep watch of his crypt by day"</p>
                </div>
            </div>
            </a>
            
            <a href="https://www.deviantart.com/metshacollective/art/DarkChildFavs-170-997585397" target="_blank" id="art3">
            <div className="digital-painting">
                <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5f3e7dde-7d6a-4b71-8e74-8c0d1c1549a6/dghxpth-03312fc7-45d4-44d3-8c3f-e025d71bbff1.jpg/v1/fill/w_1280,h_1280,q_75,strp/darkchildfavs_170_by_metshacollective_dghxpth-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzVmM2U3ZGRlLTdkNmEtNGI3MS04ZTc0LThjMGQxYzE1NDlhNlwvZGdoeHB0aC0wMzMxMmZjNy00NWQ0LTQ0ZDMtOGMzZi1lMDI1ZDcxYmJmZjEuanBnIiwiaGVpZ2h0IjoiPD0xMjgwIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvNWYzZTdkZGUtN2Q2YS00YjcxLThlNzQtOGMwZDFjMTU0OWE2XC9tZXRzaGFjb2xsZWN0aXZlLTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.WzEfT7pz2YYP0KS8Cl0hmNaLFn4Ya7m18tFslk63A8I" alt="art"/>
                <div className="art-info">
                <h4>Crow Revolution</h4>
                <p>Author: MetshaCollective</p>
                <p>"A crow study"</p>
                </div>
            </div>
            </a>
            
            <a href="https://www.deviantart.com/bunsakashita/art/Louvre-1167733836" target="_blank" id="art4">
            <div className="digital-painting">
                <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/07be8f49-e0da-4e5f-9a1f-ab7e32576dbf/djb8l70-8340c0c7-3e5e-439c-9e8f-3267d0416e3f.jpg/v1/fill/w_1280,h_919,q_75,strp/louvre_by_bunsakashita_djb8l70-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTE5IiwicGF0aCI6IlwvZlwvMDdiZThmNDktZTBkYS00ZTVmLTlhMWYtYWI3ZTMyNTc2ZGJmXC9kamI4bDcwLTgzNDBjMGM3LTNlNWUtNDM5Yy05ZThmLTMyNjdkMDQxNmUzZi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.5YuBcpFQ3wr_VSDqhylhJIt39k-OFobfwg35Z73YOh4" alt="art"/>
                <div className="art-info">
                <h4>Louvre</h4>
                <p>Author: BunSakashita</p>
                <p>"Sunset over the Louvre"</p>
                </div>
            </div>
            </a>
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
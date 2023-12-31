import { useState, useEffect } from 'react'
import Welcome from './components/Welcome';
import SearchBar from './components/SearchBar';
import Posts from './components/Posts';
import Loading from './components/Loading';
import './App.css'
import './Homepage.css'

function App() {
  const [loading, setLoading] = useState(true);
  const [virgin, setVirgin] = useState(true);
  const [remote, setRemote] = useState(false);
  const [location, setLocation] = useState("");
  const [candidatePosts, setCandidatePosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([])
  const [skills, setSkills] = useState([])

  useEffect(() => {
    (async () => {
      // these requests could be prettier (ie, one func per graphql req, and the graphql code also outsourced to be multiline and thus prettier)
      const res1 = await fetch("https://corsproxy.io/?https://hngraphql.fly.dev/graphql", {
        "body": '{"query":"{user(username: \\"whoishiring\\") {submissions {id, title, createdAt}}}","variables":{}}',
        headers: {
          'Content-Type': 'application/json'
        },
        "method": "POST",
      })
      const allHiringPosts = await res1.json();
      const { data: { user: { submissions: rawSubmissions } } } = allHiringPosts;
      const { id: submissionId } = rawSubmissions
        .filter((e: any) => e !== null)
        .sort((a: any, b: any) => b.id - a.id)
        .find((s: any) => s.title.includes('Ask HN: Who wants to be hired?'))

      const res2 = await fetch(`https://corsproxy.io/?https://hngraphql.fly.dev/graphql`, {
        "body": `{"query":"{item(id:${submissionId}){children{id,createdAt,by,text}}}","variables":{}}`,
        headers: {
          'Content-Type': 'application/json'
        },
        "method": "POST",
      })

      const { data: { item: { children: comments } } } = await res2.json();
      setCandidatePosts(comments);
      setLoading(false);
    })()
  }, []);

  useEffect(() => {
    setVisiblePosts(
      candidatePosts
        .filter((post: any) => {
          if (post['text']) {
            if (remote && /remote:\s*no/i.test(post['text'])) {
                return false;
            }
            const niceText = post['text'].toLowerCase()
            const happySkills = skills.every(skill => {
              // @ts-ignore
              const niceSkill = skill.toLowerCase().trim()
              return niceText.includes(niceSkill)
            })
            const happyLocal = niceText.includes(location.toLowerCase().trim())
            return happyLocal && happySkills;
          }
        })
    )
  }, [skills, location, remote])

  return (
    <>
      <h1 id="title">hire hackers</h1>
      <div style={{fontSize: "small"}}>powered by <a target="_blank" id="hn" href="https://desuarchive.org/g/thread/S38087806">Hacker News</a></div>

      {/* Just learned about <search>. I love obscure/new HTML elements
      https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search
      This whole little search bar needs to be its own component btw */}
      {loading ? <Loading /> : <SearchBar 
        {...{
          virgin,
          remote,
          location,
          skills,
          candidatePosts,
          setVirgin, 
          setSkills,
          setLocation,
          setRemote,
          setVisiblePosts
        }} />}
      <i style={{fontSize: "small"}}>{virgin ? "" : `(${visiblePosts.length} results)`}</i>
      <section style={{ width: "700px", textAlign: "left", border: "1px solid black", padding: "30px", wordWrap: "break-word" }}>
        {virgin ? <Welcome /> : <Posts posts={visiblePosts} />}
      </section>
      <footer id={virgin ? "virgin-footer" : "veteran-footer"}>i'm <a target="_blank" id="egolink" href="https://linktr.ee/darigo">darigo</a>, i hope this was useful for you :3</footer>
    </>
  )
}

export default App

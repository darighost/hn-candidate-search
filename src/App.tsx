import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import './App.css'
import './Homepage.css'

const Welcome = () => {
  return (
    <>
      <center><h2 style={{marginTop: "0px", marginBottom: "8px"}}>[placeholder]</h2></center>
      Use the navbar to search for skills (comma-separated) or a locale above
      <p />
      Or, you can just click <b>Show all</b> to see every single listing
      <p />
      For bugs + requests, create an issue:<br /> <a href="https://github.com/darighost/hn-candidate-search">github.com/darighost/hn-candidate-search</a>
      <p />
      ~ happy recruiting!
    </>
  )
}

const Post = ({id, text}: {id: number, text: string}) => {
  return (
    <>
      <span style={{"float": "right"}}><i>(author link) on (date)</i></span>
      <p key={id} dangerouslySetInnerHTML={{"__html": text.replaceAll('\n', '<br />')}} />
      <hr />
    </>
  );
}

const Posts = ({posts: rawPosts}: {posts: any}) => {
  const posts = rawPosts.filter((post: any) => {
    return post['text']
      && /[a-z]/i.test(post['text'])
      && !post['text'].includes('[dead]')
      && !post['text'].includes('[flagged]')
  })
  return (
    <div>
      {posts.map((e: any) => <Post key={e['id']} id={e['id']} text={e['text']} />)}
      
    </div>
  );
}

const Loading = () => {
  return (
    <>
      <search style={{color: "darkgray"}}>
        Loading HN comments from API...
      </search>
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true);
  const [candidatePosts, setCandidatePosts] = useState([]);
  {/* the remote feature is nearly useless in practice.
  Almost *everyone* lists remote as preferred/yes/ok, etc.
  Nevertheless, I feel like people will want to be able to select this, so it's here */}
  const [visiblePosts, setVisiblePosts] = useState([])
  const [remote, setRemote] = useState(false);
  const [location, setLocation] = useState("");
  const [virgin, setVirgin] = useState(true);
  const [skills, setSkills]: [
    string[],
    Dispatch<SetStateAction<string[]>>
  ] = useState([] as string[])

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
            if (remote && /remote:\s+no/i.test(post['text'])) {
                return false;
            }
            const niceText = post['text'].toLowerCase()
            const happySkills = skills.every(skill => {
              const niceSkill = skill.toLowerCase()
              return niceText.includes(niceSkill)
            })
            const happyLocal = niceText.includes(location.toLowerCase())
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
      {loading ? <Loading /> : <search>
          <div>
            <label>Skills: </label>
            <input onChange={(e: any) => {setSkills(e.target.value.split(/,\s+/)); setVirgin(false)}} type="search" placeholder="python, infosec, etc" />
          </div>
          <div>
            <label>Location: </label>
            <input type="text" onChange={(e)=>setLocation(e.target.value)} />
          </div>
          <div>
            <label>Remote: </label>
            <input type="checkbox" onClick={()=>{setRemote(!remote); setVirgin(false)}} />
          </div>
          <div>
            <input onClick={()=>{if (!virgin) {setVisiblePosts([]); setLocation("")} else { setVisiblePosts(candidatePosts) }; setVirgin(!virgin)}} type="button" value={virgin ? "Show all" : "Reset"} />
          </div>
      </search>}
      <i style={{fontSize: "small"}}>{virgin ? "" : `(${visiblePosts.length} results)`}</i>
      <section style={{ width: "700px", textAlign: "left", border: "1px solid black", padding: "30px", wordWrap: "break-word" }}>
        {virgin ? <Welcome /> : <Posts posts={visiblePosts} />}
      </section>
      <footer id={virgin ? "virgin-footer" : "veteran-footer"}>i'm <a target="_blank" id="egolink" href="https://linktr.ee/darigo">darigo</a>, i hope this was useful for you :3</footer>
    </>
  )
}

export default App

import { Dispatch, SetStateAction, useState } from 'react'
import './App.css'
import './Homepage.css'

function App() {
  const [skills, setSkills]: [
    undefined | string[],
    Dispatch<SetStateAction<undefined>>
  ] = useState(undefined)

  return (
    <>
      <h1 id="title">hire hackers</h1>
      <div>powered by Hacker News</div>

      {/* Just learned about <search>. I love obscure/new HTML elements
      https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search */}
      <search>
          <div>
            <label>Skills: </label>
            <input type="search" placeholder="python, infosec, etc" />
          </div>
          <div>
            <label>Location: </label>
            <input type="text" /></div>
          <div>
            <label>Remote: </label>
            <input type="checkbox" />
          </div>
      </search>

      <section style={{width: "700px", textAlign: "left", border: "1px solid black", padding: "20px"}}>
        Search results component here (by result, shows the most recent n with pagination)
        (breaks into subcomponents of course)
        posts separated by very simple &lt;hr&gt; with links to original comment in normal link colors
      </section>
      <footer>i'm <a id="egolink" href="https://linktr.ee/darigo">darigo</a>, i hope this was useful for you :3</footer>
    </>
  )
}

export default App

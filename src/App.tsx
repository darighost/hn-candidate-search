import { useState } from 'react'
import './App.css'
import './Homepage.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 id="title">hire hackers</h1>
      <div>powered by Hacker News</div>

      {/* Just learned about <search>. I love obscure/new HTML elements
      https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search */}
      <search>
        Search for: <input type="search" />
      </search>

      <section style={{width: "700px", textAlign: "left", border: "1px solid black", padding: "20px"}}>
        Search results component here (by result, shows the most recent n with pagination)
        (breaks into subcomponents of course)
        posts separated by very simple &lt;hr&gt; with links to original comment in normal link colors
      </section>
      footer component here, link to code
    </>
  )
}

export default App

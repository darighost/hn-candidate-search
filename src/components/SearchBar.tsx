const SearchBar = ({
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
}: {
  virgin: boolean,
  remote: boolean,
  location: string,
  skills: string[],
  candidatePosts: any[],
  setVirgin: any,
  setSkills: any,
  setLocation: any, 
  setRemote: any, 
  setVisiblePosts: any
}) => {
  return (
    <search>
      <div>
        <label>Skills: </label>
        <input
          value={skills.join(', ')}
          onChange={
            (e: any) => {
              setSkills(e.target.value.split(/,\s+/)); setVirgin(false)}
            }
          type="search"
          placeholder="python, infosec, etc"
        />
      </div>
      <div>
        <label>Location: </label>
        <input 
          value={location}
          type="text"
          onChange={
            (e) => {
              setLocation(
                e.target.value.split(/[^a-z]+/i).join(' ')
              );
              setVirgin(false);
            }
          }
        />
      </div>
      <div>
        <label>Remote: </label>
        <input 
          checked={remote}
          type="checkbox"
          onClick={
            ()=>{
              setRemote(!remote);
              setVirgin(false);
            }
          }
        />
      </div>
      <div>
        <input 
          onClick={
            () => {
              if (!virgin) {
                setVisiblePosts([]);
                setSkills([]);
                setRemote(false);
                setLocation("")
              } else {
                setVisiblePosts(candidatePosts)
              };
              setVirgin(!virgin);
            }
          }
          type="button"
          value={virgin ? "Show all" : "Reset"}
        />
      </div>
    </search>
  )
}

export default SearchBar;
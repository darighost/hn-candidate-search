const Post = ({id, text, author, when}: {id: number, text: string, author: string, when: string}) => {
  return (
    <>
      <span style={{"float": "right"}}><i><a target='_blank' href={`https://news.ycombinator.com/user?id=${author}`}>{author}</a> on {when.split('T')[0]}</i></span>
      <p key={id} dangerouslySetInnerHTML={{"__html": text.replaceAll('\n', '<br />')}} />
      <hr />
    </>
  );
}

export default Post;
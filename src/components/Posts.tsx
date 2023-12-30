import Post from './Post';

const Posts = ({posts: rawPosts}: {posts: any}) => {
  const posts = rawPosts.filter((post: any) => {
    return post['text']
      && /[a-z]/i.test(post['text'])
      && !post['text'].includes('[dead]')
      && !post['text'].includes('[flagged]')
  })
  return (
    <div>
      {posts.map((e: any) => <Post key={e['id']} id={e['id']} text={e['text']} when={e['createdAt']} author={e['by']} />)}
      
    </div>
  );
}

export default Posts;
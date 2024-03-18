import { fetchData } from "../api/fetchData";

const data = fetchData("https://jsonplaceholder.typicode.com/posts");

export const PostList = () => {
  const posts = data.read();

  return (
    <div>
      {posts.map((post) => (
        <div>{post.title}</div>
      ))}
    </div>
  );
};

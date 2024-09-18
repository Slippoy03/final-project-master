import { Box, Text, Spinner } from "@chakra-ui/react";
import Post from "./Post";

function PostList({
  posts,
  profileUser,
  isLoading,
  isError,
  onLike,
  onReply,
  onEdit,
  onDelete,
  replies,
  setReplies,
  unLike,
}) {
  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Text>Error loading posts...</Text>;
  }

  return (
    <Box>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            profileUser={profileUser}
            onLike={onLike}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            replies={replies}
            setReplies={setReplies}
            unLike={unLike}
          />
        ))
      ) : (
        <Text>No posts available.</Text>
      )}
    </Box>
  );
}

export default PostList;

import { Box, Input, Button } from "@chakra-ui/react";

function NewPost({ newPost, setNewPost, onSubmit }) {
  return (
    <Box mb={4} p={3} borderWidth={1} borderRadius="lg" bg="white">
      <Input
        placeholder="What's happening ..."
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        size="sm"
      />
      <Button mt={2} colorScheme="blue" size="sm" onClick={onSubmit}>
        Post
      </Button>
    </Box>
  );
}

export default NewPost;

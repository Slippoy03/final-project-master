import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import Head from "next/head";
import Link from "next/link";
import {
  Container,
  Box,
  Flex,
  Heading,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Button,
  Avatar,
  Spinner,
  Text,
  Input,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ChatIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useQueries } from "@/hooks/useQueries";

export default function Layout({ children, metaTitle, metaDescription }) {
  const router = useRouter();
  const { mutate: mutateLogout } = useMutation();
  const { data: userData } = useQueries({
    prefixUrl: "https://service.pace-unv.cloud/api/user/me",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    },
  });
  const {
    data: postsData,
    isLoading,
    isError,
  } = useQueries({
    prefixUrl: "https://service.pace-unv.cloud/api/posts?type=all",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    },
  });

  const [newPost, setNewPost] = useState("");
  const [replies, setReplies] = useState({}); // Object to store replies for each post
  const [editDescription, setEditDescription] = useState(""); // State for editing description
  const [selectedPostId, setSelectedPostId] = useState(null); // Track the post being edited

  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control

  const { mutate: createPost } = useMutation();
  const profileUser = userData?.data;
  const posts = postsData?.data;

  const handleNewPost = async () => {
    const response = await createPost({
      url: "https://service.pace-unv.cloud/api/post",
      method: "POST",
      payload: { description: newPost },
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    if (response.success) {
      setNewPost("");
      router.reload();
    }
  };

  const handleLogout = async () => {
    const response = await mutateLogout({
      url: "https://service.pace-unv.cloud/api/logout",
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    if (response?.success) {
      Cookies.remove("user_token");
      router.reload();
    }
  };

  const handleLike = async (postId) => {
    const response = await createPost({
      url: `https://service.pace-unv.cloud/api/likes/post/${postId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    if (response.success) {
      router.reload();
    }
  };

  const handleReply = async (postId) => {
    const response = await createPost({
      url: `https://service.pace-unv.cloud/api/replies/post/${postId}`,
      method: "POST",
      payload: { description: replies[postId] }, // Use the reply for this post
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    if (response.success) {
      setReplies({ ...replies, [postId]: "" }); // Clear the reply input for the specific post
      router.reload();
    }
  };

  const openEditModal = (postId, currentDescription) => {
    setEditDescription(currentDescription); // Set the current post description in the modal
    setSelectedPostId(postId); // Set the post being edited
    onOpen(); // Open the modal
  };

  const handleEditPost = async () => {
    const response = await createPost({
      url: `https://service.pace-unv.cloud/api/post/update/${selectedPostId}`,
      method: "PATCH",
      payload: { description: editDescription },
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    if (response.success) {
      onClose(); // Close the modal after editing
      router.reload(); // Reload the page to reflect the edit
    }
  };

  const handleDeletePost = async (postId) => {
    const response = await createPost({
      url: `https://service.pace-unv.cloud/api/post/delete/${postId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    if (response.success) {
      router.reload(); // Reload the page to reflect the deletion
    }
  };

  return (
    <>
      <Head>
        <title>{`Sanber Daily - ${metaTitle}`}</title>
      </Head>

      <Container width="full" centerContent>
        <Flex
          direction="column"
          bg="whiteAlpha.900"
          width="100vw"
          height="100vh"
        >
          <Box height="5vh">
            <Flex
              height="full"
              alignItems="center"
              justifyContent="space-between"
              padding="2"
              borderBottom="1px"
              borderBottomColor="gray.200"
            >
              <Heading size="md">Sanber Daily</Heading>
              <Menu placement="bottom-end">
                <MenuButton
                  as={Button}
                  size="sm"
                  leftIcon={<Avatar name={profileUser?.name || ""} size="xs" />}
                />
                <MenuList zIndex="2">
                  <MenuItem>Profile ({profileUser?.name || ""})</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </MenuList>
              </Menu>
            </Flex>
          </Box>

          <Box height="95vh" overflow="scroll" padding="2" position="relative">
            <Box mb={4} p={4} borderWidth={1} borderRadius="lg">
              <Input
                placeholder="What's happening ..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <Button mt={2} colorScheme="blue" onClick={handleNewPost}>
                Post
              </Button>
            </Box>

            {isLoading && <Spinner />}
            {isError && <Text>Error loading posts...</Text>}
            {!isLoading && posts && posts.length > 0 ? (
              posts.map((post) => (
                <Box
                  key={post.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  mb={4}
                  bg="gray.50"
                >
                  <Flex justifyContent="space-between" mb={2}>
                    <Flex alignItems="center">
                      <Avatar name={post.user.name} size="sm" />
                      <Box ml={2}>
                        <Text fontWeight="bold">{post.user.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {post.user.email} -{" "}
                          {new Date(post.updated_at).toLocaleDateString()}{" "}
                          {post.isEdited && <span>Edited</span>}
                        </Text>
                      </Box>
                    </Flex>

                    {post.user.id === profileUser?.id && (
                      <Flex>
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="edit"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            openEditModal(post.id, post.description)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="delete"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        />
                      </Flex>
                    )}
                  </Flex>

                  <Text mb={2}>{post.description}</Text>

                  <Flex justifyContent="space-between">
                    <Flex alignItems="center">
                      <IconButton
                        icon={<FaHeart />} // Heart icon for like
                        aria-label="like"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                      />
                      <Text>{post.likes || 0} Likes</Text>{" "}
                    </Flex>
                    <Flex alignItems="center">
                      <IconButton
                        icon={<ChatIcon />}
                        aria-label="replies"
                        variant="ghost"
                        size="sm"
                      />
                      <Text>{post.replies?.length || 0} Replies</Text>{" "}
                    </Flex>
                  </Flex>

                  <Box mt={2}>
                    <Input
                      placeholder="Write a reply..."
                      value={replies[post.id] || ""}
                      onChange={(e) =>
                        setReplies({ ...replies, [post.id]: e.target.value })}
                    />
                    <Button onClick={() => handleReply(post.id)}>Reply</Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Text>No posts available.</Text>
            )}
          </Box>
        </Flex>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditPost}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Container,
  Flex,
  Heading,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Avatar,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useMutation } from "@/hooks/useMutation";
import { useQueries } from "@/hooks/useQueries";
import PostList from "../components/PostList";
import NewPost from "../components/NewPost";
import EditPostModal from "../components/EditPostModal";

export default function Layout({ metaTitle }) {
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
  const [replies, setReplies] = useState({});
  const [editDescription, setEditDescription] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); 

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
      payload: { description: replies[postId] },
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    if (response.success) {
      setReplies({ ...replies, [postId]: "" });
      router.reload();
    }
  };

  const openEditModal = (postId, currentDescription) => {
    setEditDescription(currentDescription);
    setSelectedPostId(postId);
    onOpen();
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
      onClose();
      router.reload();
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
      router.reload();
    }
  };
  const handleUnlike = async (postId) => {
    const response = await createPost({
      url: `https://service.pace-unv.cloud/api/unlikes/post/${postId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    if (response.success) {
      router.reload();
    }
  };
  return (
    <>
      <Head>
        <title>{`Sanber Daily - ${metaTitle}`}</title>
      </Head>
      <Container maxW="container.md" bg="gray.100" py={6} px={4} centerContent>
        <Flex direction="column" width="100%">
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading size="lg">Sanber Daily</Heading>
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                size="sm"
                leftIcon={<Avatar name={profileUser?.name || ""} size="xs" />}
              />
              <MenuList zIndex="2">
                <MenuItem>Profile ({profileUser?.name || ""})</MenuItem>
                <MenuItem>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <NewPost
            newPost={newPost}
            setNewPost={setNewPost}
            onSubmit={handleNewPost}
          />
          <PostList
            posts={posts}
            profileUser={profileUser}
            isLoading={isLoading}
            isError={isError}
            onLike={handleLike}
            onReply={handleReply}
            onEdit={openEditModal}
            onDelete={handleDeletePost}
            replies={replies}
            setReplies={setReplies}
            unLike={handleUnlike}
          />
        </Flex>
      </Container>

      <EditPostModal
        isOpen={isOpen}
        onClose={onClose}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        onSave={handleEditPost}
      />
    </>
  );
}

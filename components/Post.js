import { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  IconButton,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { ChatIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

function Post({
  post,
  profileUser,
  onLike,
  onReply,
  onEdit,
  onDelete,
  replies,
  setReplies,
}) {
  const [isReplyModalOpen, setReplyModalOpen] = useState(false);

  return (
    <>
      <Box p={3} borderWidth={1} borderRadius="lg" mb={3} bg="white">
        <Flex justifyContent="space-between" alignItems="center" mb={1}>
          <Flex alignItems="center">
            <Avatar name={post.user.name} size="sm" />
            <Box ml={3}>
              <Text fontWeight="bold" fontSize="sm">
                {post.user.name} {post.user.id === profileUser?.id && "(You)"}
              </Text>
              <Text fontSize="xs" color="gray.500">
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
                onClick={() => onEdit(post.id, post.description)}
              />
              <IconButton
                icon={<DeleteIcon />}
                aria-label="delete"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
              />
            </Flex>
          )}
        </Flex>

        <Text fontSize="sm" mb={2}>
          {post.description}
        </Text>

        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <IconButton
              icon={<FaHeart color={post.likes > 0 ? "red" : "gray"} />}
              aria-label="like"
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
            />
            <Text fontSize="sm" ml={1}>
              {post.likes || 0} Likes
            </Text>
          </Flex>

          <Flex alignItems="center">
            <IconButton
              icon={<ChatIcon />}
              aria-label="replies"
              variant="ghost"
              size="sm"
              onClick={() => setReplyModalOpen(true)}
            />
            <Text fontSize="sm" ml={1}>
              {post.replies?.length || 0} Replies
            </Text>
          </Flex>
        </Flex>

        <Box mt={2}>
          <Input
            placeholder="Write a reply..."
            value={replies[post.id] || ""}
            onChange={(e) =>
              setReplies({ ...replies, [post.id]: e.target.value })}
            size="sm"
          />
          <Button
            mt={2}
            size="sm"
            colorScheme="blue"
            onClick={() => onReply(post.id)}
          >
            Reply
          </Button>
        </Box>
      </Box>

      <Modal isOpen={isReplyModalOpen} onClose={() => setReplyModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Replies</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {post.replies && post.replies.length > 0 ? (
              post.replies.map((reply) => (
                <Text key={reply.id}>{reply.description}</Text>
              ))
            ) : (
              <Text>No replies yet.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Post;

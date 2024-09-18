import { useState } from "react";
import {
  Input, Button, Stack, Heading, useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMutation } from "@/hooks/useMutation";

export default function Register() {
  const [payload, setPayload] = useState({ name: "", email: "", password: "" });
  const { mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();

  const handleRegister = async () => {
    const response = await mutate({
      url: "https://service.pace-unv.cloud/api/register",
      method: "POST",
      payload,
    });

    if (!payload.name || !payload.email || !payload.password) {
      toast({
        title: "Error",
        description: "All fields are required.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      router.push("/login");
    } else {
      toast({
        title: "Registration Failed",
        description: response.message || "Error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Stack>
      <Heading>Register</Heading>
      <Input
        placeholder="Name"
        value={payload.name}
        onChange={(e) => setPayload({ ...payload, name: e.target.value })}
      />
      <Input
        placeholder="Email"
        value={payload.email}
        onChange={(e) => setPayload({ ...payload, email: e.target.value })}
      />
      <Input
        placeholder="Password"
        type="password"
        value={payload.password}
        onChange={(e) => setPayload({ ...payload, password: e.target.value })}
      />
      <Button onClick={handleRegister}>Register</Button>
    </Stack>
  );
}

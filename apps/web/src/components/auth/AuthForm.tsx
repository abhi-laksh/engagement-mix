"use client";

import { useInitiateAuth, useMe, useVerifyOtp } from "@/api-services/auth";
import { EmailFormData, emailSchema, OTPFormData, otpSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Group,
  PinInput,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import {
  IconArrowLeft,
  IconMail,
  IconRefresh
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AuthForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const router = useRouter();

  const initiateAuthMutation = useInitiateAuth();
  const verifyOtpMutation = useVerifyOtp();
  const fetchUser = useMe();

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      await initiateAuthMutation.mutateAsync({ email: data.email });
      setSubmittedEmail(data.email);
      setStep("otp");
    } catch (error) {
      console.error("Failed to initiate auth:", error);
      // Error handling - the mutation will show the error state
    }
  };

  const onOTPSubmit = async (data: OTPFormData) => {
    try {
      await verifyOtpMutation.mutateAsync({ 
        email: submittedEmail, 
        otp: data.otp 
      });

      await fetchUser.refetch();
      
      router.push("/tasks");
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
  };

  const handleChangeEmail = () => {
    setStep("email");
    emailForm.setValue("email", submittedEmail);
  };

  const handleResendOTP = async () => {
    try {
      await initiateAuthMutation.mutateAsync({ email: submittedEmail });
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const handleInputOTP = (value: string) => {
    otpForm.setValue("otp", value);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 lg:w-1/2">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Logo */}
          <div className="mb-12">
            <Text 
              component="h1" 
              size="28px" 
              fw={700} 
              className="text-blue-600"
            >
              TaskMaster
            </Text>
          </div>

          {/* Title and Description */}
          <div className="mb-10">
            <Text component="h2" size="32px" fw={600} mb="sm" lh={1.2}>
              Login/Sign Up
            </Text>
            <Text size="md" c="dimmed" className="mt-3">
              Manage your tasks efficiently and stay organized
            </Text>
          </div>

          {/* Form Content */}
          {step === "email" ? (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
              <Stack gap="lg">
                <Box>
                  <Text size="lg" fw={500} mb="xs" c="dark.7" ta="center">
                    Enter Email
                  </Text>
                  <TextInput
                    {...emailForm.register("email")}
                    leftSection={<IconMail size={18} />}
                    placeholder="Enter your email address"
                    error={emailForm.formState.errors.email?.message || 
                           (initiateAuthMutation.isError ? "Failed to send OTP. Please try again." : undefined)}
                    size="lg"
                    radius="md"
                  />
                </Box>
                
                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg"
                  radius="md"
                  loading={initiateAuthMutation.isPending}
                  className="mt-6"
                >
                  Continue
                </Button>
              </Stack>
            </form>
          ) : (
            <div>
              <Box mb="xl">
                <Text size="md" c="dimmed" mb="lg" ta="center">
                  An OTP has been sent to{" "}
                  <Text component="span" fw={600} c="dark">
                    {submittedEmail}
                  </Text>
                </Text>

                <form onSubmit={otpForm.handleSubmit(onOTPSubmit)}>
                  <Stack gap="lg">
                    <Box>
                      <Text size="lg" fw={500} mb="md" c="dark.7" ta="center">
                        Enter OTP
                      </Text>
                      <div className="flex justify-center">
                        <PinInput
                          {...otpForm.register("otp")}
                          length={6}
                          size="lg"
                          type="number"
                          placeholder=""
                          onChange={handleInputOTP}
                          gap="sm"
                        />
                      </div>
                      {(otpForm.formState.errors.otp || verifyOtpMutation.isError) && (
                        <Text size="sm" c="red" mt="sm" ta="center">
                          {otpForm.formState.errors.otp?.message || 
                           (verifyOtpMutation.isError ? "Invalid OTP. Please try again." : "")}
                        </Text>
                      )}
                    </Box>
                    
                    <Button 
                      type="submit" 
                      fullWidth 
                      size="lg"
                      radius="md"
                      loading={verifyOtpMutation.isPending || fetchUser.isPending}
                      className="mt-6"
                    >
                      Verify OTP
                    </Button>
                  </Stack>
                </form>
              </Box>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-100">
                <Group justify="center" align="center" gap="xl">
                  <Button
                    variant="subtle"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={handleChangeEmail}
                    size="md"
                    c="gray.6"
                  >
                    Change Email
                  </Button>
                  
                  <div className="h-4 w-px bg-gray-300"></div>
                  
                  <Button
                    variant="subtle"
                    leftSection={<IconRefresh size={16} />}
                    onClick={handleResendOTP}
                    size="md"
                    c="gray.6"
                    loading={initiateAuthMutation.isPending}
                  >
                    Resend OTP
                  </Button>
                </Group>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Blue Background (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-600">
        {/* Empty blue section */}
      </div>
    </div>
  );
}
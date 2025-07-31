"use client";

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
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AuthForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

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

  const onEmailSubmit = (data: EmailFormData) => {
    setSubmittedEmail(data.email);
    setStep("otp");
  };

  const onOTPSubmit = (data: OTPFormData) => {
    // TODO: Implement OTP verification
    console.log("OTP submitted:", data.otp, "for email:", submittedEmail);
  };

  const handleChangeEmail = () => {
    setStep("email");
    emailForm.setValue("email", submittedEmail);
  };

  const handleResendOTP = () => {
    // TODO: Implement resend OTP API call
    console.log("Resend OTP for email:", submittedEmail);
  };

  const handleInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    emailForm.setValue("email", e.target.value);
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
                    error={emailForm.formState.errors.email?.message}
                    size="lg"
                    radius="md"
                  />
                </Box>
                
                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg"
                  radius="md"
                  loading={emailForm.formState.isSubmitting}
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
                      {otpForm.formState.errors.otp && (
                        <Text size="sm" c="red" mt="sm" ta="center">
                          {otpForm.formState.errors.otp.message}
                        </Text>
                      )}
                    </Box>
                    
                    <Button 
                      type="submit" 
                      fullWidth 
                      size="lg"
                      radius="md"
                      loading={otpForm.formState.isSubmitting}
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
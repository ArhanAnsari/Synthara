'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast.error('Account already exists');
    } else if (state.status === 'failed') {
      toast.error('Failed to create account');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      toast.success('Account created successfully');
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/images/AuroraAI Logo.png"
            alt="AuroraAI Logo"
            width={200}
            height={200}
            className="mb-4"
          />
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
              <circle cx="9" cy="10" r="1" fill="white" />
              <circle cx="15" cy="10" r="1" fill="white" />
              <path d="M9 15c1.5 2 4.5 2 6 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-semibold text-white">Join AuroraAI</h3>
          <p className="text-gray-300">Create an account to explore AI-powered assistance</p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>Sign Up</SubmitButton>
          <p className="text-center text-sm text-gray-300 mt-4">
            {'Already have an account? '}
            <Link href="/login" className="font-semibold text-white hover:underline">
              Sign in
            </Link>
            {' instead.'}
          </p>
        </AuthForm>
      </motion.div>
    </div>
  );
}

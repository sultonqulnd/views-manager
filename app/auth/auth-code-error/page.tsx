'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Mail } from 'lucide-react'

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error_code')
  const isOtpExpired = errorCode === 'otp_expired'
  const description = searchParams.get('error_description')?.replace(/\+/g, ' ') ?? null

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-center">
          <div className="rounded-full bg-amber-500/10 p-3">
            <AlertCircle className="h-10 w-10 text-amber-500" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-zinc-100">
            {isOtpExpired ? 'Confirmation link expired' : 'Something went wrong'}
          </h1>
          <p className="text-sm text-zinc-400">
            {isOtpExpired
              ? 'The email confirmation link is invalid or has expired. Request a new one below.'
              : description || 'We couldn’t complete sign in. Please try again.'}
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          {isOtpExpired && (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Request new confirmation email
            </Link>
          )}
          <Link
            href="/login"
            className="block text-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

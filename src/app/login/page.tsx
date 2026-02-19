import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 px-4">
      <div className="w-full max-w-md">
        <SignIn
          routing="hash"
          signUpUrl="/register"
          afterSignInUrl="/dashboard"
          appearance={{
            elements: {
              card: "rounded-2xl shadow-xl",
            },
          }}
        />
      </div>
    </div>
  );
}

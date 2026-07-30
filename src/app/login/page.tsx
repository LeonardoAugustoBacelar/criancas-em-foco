import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-bold text-primary-700">
        Entrar
      </h1>
      <p className="mt-2 text-center text-sm text-primary-700/80">
        Acesse sua conta para agendar aulas ou gerenciar seu perfil de
        professora.
      </p>
      <div className="mt-8 rounded-lg border border-primary-100 bg-white p-6">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-primary-700/80">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-accent-600 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}

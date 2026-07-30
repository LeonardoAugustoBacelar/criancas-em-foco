import Link from "next/link";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

export const metadata = {
  title: "Esqueci minha senha | Crianças em Foco",
};

export default function EsqueciSenhaPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-bold text-primary-700">
        Esqueci minha senha
      </h1>
      <p className="mt-2 text-center text-sm text-primary-700/80">
        Informe o e-mail da sua conta e enviaremos um link para você criar
        uma nova senha.
      </p>
      <div className="mt-8 rounded-lg border border-primary-100 bg-white p-6">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-primary-700/80">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-semibold text-accent-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}

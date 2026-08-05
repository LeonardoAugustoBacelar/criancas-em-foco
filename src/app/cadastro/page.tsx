import type { Metadata } from "next";
import RegisterForm from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Crie sua conta de mãe para agendar aulas com a professora Gilda, especializada em comportamento infantil e pedagogia.",
};

export default function CadastroPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-center font-serif-display text-3xl font-semibold text-primary-700">
        Crie sua conta
      </h1>
      <p className="mt-2 text-center text-sm text-primary-700/80">
        Crie sua conta de mãe para agendar aulas com a Gilda, nossa
        professora especializada em comportamento infantil e pedagogia.
      </p>
      <div className="mt-8 rounded-lg border border-primary-100 bg-white p-6">
        <RegisterForm />
      </div>
    </div>
  );
}

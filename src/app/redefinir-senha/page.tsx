import Link from "next/link";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

export const metadata = {
  title: "Redefinir senha | Crianças em Foco",
};

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-bold text-primary-700">
        Redefinir senha
      </h1>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-4 text-center text-sm text-primary-700/80">
            <p>Link inválido. Solicite um novo link de redefinição.</p>
            <Link
              href="/esqueci-senha"
              className="inline-block rounded-full bg-accent-500 px-6 py-2.5 font-semibold text-white hover:bg-accent-600"
            >
              Solicitar novo link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

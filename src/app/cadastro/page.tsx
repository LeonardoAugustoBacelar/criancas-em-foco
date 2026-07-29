import RegisterForm from "@/components/forms/RegisterForm";

export default function CadastroPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-bold text-primary-700">
        Crie sua conta
      </h1>
      <p className="mt-2 text-center text-sm text-primary-700/80">
        Mães podem buscar professoras e agendar aulas. Professoras podem
        criar seu perfil e receber agendamentos.
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}

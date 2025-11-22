import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Smart Race Pacer</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Calculate your perfect negative split race plan.
      </p>
    </main>
  );
}

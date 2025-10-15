export default function AuthLayout({ children, title, description }: { children: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-headline font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

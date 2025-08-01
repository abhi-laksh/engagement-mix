import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { MantineProvider } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const queryClient = new QueryClient();
return (
    <html lang="en">
      <body>
        <MantineProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

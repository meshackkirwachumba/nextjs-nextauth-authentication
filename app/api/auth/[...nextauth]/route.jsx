import NextAuth from "next-auth/next";
import prisma from "@/app/libs/prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "mesh@gmail.com" },
        password: { label: "Password", type: "password" },
        username: {
          label: "Username",
          type: "text",
          placeholder: "Meshack Kirwa",
        },
      },

      async authorize(credentials) {
        //check to see if email and password is entered
        if (!credentials.email || !credentials.password) {
          throw new Error("Please enter an email and password");
        }

        //check the user who wants to login exists in db
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        //if no user was found
        if (!user || !user?.hashedPassword) {
          throw new Error("No user found");
        }

        //check to see if passwords match
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        //if passwords dont match
        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        //user is found and password match hence
        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

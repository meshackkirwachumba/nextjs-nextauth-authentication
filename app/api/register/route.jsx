import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  const body = await request.json();
  const { email, name, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  //check if there is an existing registered user
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email Already exists");
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //create new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  //return the user to frontend
  return NextResponse.json(user);
}

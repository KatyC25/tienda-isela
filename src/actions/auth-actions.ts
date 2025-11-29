"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const CUENTAS_VALIDAS = [
    { usuario: "admin@tiendaisela.com", clave: "isela123" },
    { usuario: "test@test.com", clave: "123456" },
  ];

  const cuentaEncontrada = CUENTAS_VALIDAS.find(
    (c) => c.usuario === email && c.clave === password,
  );

  if (cuentaEncontrada) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    (await cookies()).set("session_isela", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
    redirect("/admin");
  } else {
    return { error: "Credenciales incorrectas" };
  }
}

export async function logoutAction() {
  (await cookies()).delete("session_isela");
  redirect("/login");
}

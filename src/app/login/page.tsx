"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaTshirt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginAction } from "@/actions/auth-actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result = await loginAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="bg-pink-600 p-3 rounded-xl mb-4 shadow-md">
            <FaTshirt className="text-white h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Bienvenida de nuevo
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="contraseña"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-slate-500">
            Sistema Administrativo Tienda Isela © 2025
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

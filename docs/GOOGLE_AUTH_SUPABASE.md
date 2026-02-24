# Google Authentication con Supabase – Paso a paso

## 1. Crear credenciales en Google Cloud Console

1. Entra en [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto nuevo o elige uno existente (menú superior).
3. Ve a **APIs y servicios** → **Pantalla de consentimiento de OAuth**.
   - Si te pide configurar la pantalla de consentimiento:
     - Tipo de usuario: **Externo** (para que cualquier usuario con cuenta Google pueda entrar).
     - Rellena: nombre de la app (ej. Saverly), email de soporte, dominio si lo tienes.
     - En “Permisos de prueba” puedes añadir tu email para probar antes de publicar.
   - Guarda y continúa.
4. Ve a **APIs y servicios** → **Credenciales**.
5. **+ Crear credenciales** → **ID de cliente de OAuth**.
   - Tipo de aplicación: **Aplicación web**.
   - Nombre: ej. "Saverly Web".
   - **Orígenes JavaScript autorizados** (añade):
     - `http://localhost:3000` (desarrollo)
     - Tu dominio en producción cuando lo tengas (ej. `https://saverly.com`).
   - **URI de redirección autorizados** (añade):
     - En el paso 2 de Supabase copiarás la URL que te da Supabase; por ahora no añadas nada y vuelve después de crear el cliente en Supabase.
   - Crear.
6. Copia el **ID de cliente** y el **Secreto del cliente** (lo necesitarás en Supabase).

---

## 2. Configurar Google en Supabase

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com).
2. **Authentication** → **Providers**.
3. Activa **Google**.
4. Pega:
   - **Client ID**: el que copiaste de Google.
   - **Client Secret**: el secreto de Google.
5. Guarda.
6. En la misma pantalla (o en **URL Configuration**) verás algo como:
   - **Redirect URL** (o “Callback URL”) de Supabase, por ejemplo:
     `https://<TU-PROJECT-REF>.supabase.co/auth/v1/callback`
   - Copia esa URL.

---

## 3. Añadir la URL de Supabase en Google

1. Vuelve a Google Cloud Console → **Credenciales** → tu **Cliente OAuth 2.0**.
2. Edita el cliente.
3. En **URI de redirección autorizados** añade exactamente la URL de Supabase del paso 2, por ejemplo:
   - `https://xxxxxxxx.supabase.co/auth/v1/callback`
4. Guarda.

---

## 4. URL de redirección en Supabase (necesaria para Google)

1. En Supabase: **Authentication** → **URL Configuration**.
2. **Site URL**: en local pon `http://localhost:3000`; en producción tu dominio (ej. `https://saverly.com`).
3. **Redirect URLs**: añade la URL del callback de la app (obligatoria para que Google OAuth funcione):
   - Desarrollo: `http://localhost:3000/auth/callback`
   - Producción: `https://tu-dominio.com/auth/callback`

La app tiene una ruta `/auth/callback` que recibe el código de Supabase, intercambia el código por sesión y redirige al usuario a `/home` (o a la URL en el parámetro `next`). Sin esta URL en la lista, Supabase rechazará la redirección tras el login con Google.

---

## 5. Resumen de comprobación

- [ ] Pantalla de consentimiento OAuth configurada en Google.
- [ ] Cliente OAuth “Aplicación web” creado en Google.
- [ ] Orígenes autorizados en Google: `http://localhost:3000` (y tu dominio en prod).
- [ ] URI de redirección en Google = URL de callback de Supabase (ej. `https://xxx.supabase.co/auth/v1/callback`).
- [ ] Provider Google activado en Supabase con Client ID y Client Secret.
- [ ] Site URL y Redirect URLs configurados en Supabase para local (y luego para producción).

Cuando todo esté listo, el botón “Log in with Google” / “Sign up with Google” en el frontend llamará a `signInWithOAuth({ provider: 'google' })` y Supabase llevará al usuario a Google y luego de vuelta a tu app.

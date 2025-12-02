# InvestMate - Sistema de Gestión de Inversiones

Plataforma completa para gestionar tus inversiones, movimientos y rentabilidad.

## Características

- Dashboard intuitivo con gráficos en tiempo real
- Gestión completa de inversiones (CRUD)
- Cálculos automáticos de ROI y ganancias
- Movimientos automáticos al crear inversiones (Modelo B)
- Soporte para múltiples plataformas y instrumentos
- Múltiples monedas (USD, ARS, EUR, BRL)
- Autenticación segura con Supabase
- Row Level Security (RLS) para protección de datos
- Responsive design (mobile + desktop)

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS v4, shadcn/ui
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **Gráficos**: Recharts
- **Hosting**: Vercel

## Instalación Local

### Prerrequisitos
- Node.js 18+
- Cuenta en Supabase (supabase.com)

### Pasos

1. **Clonar repositorio**
\`\`\`bash
git clone <repository-url>
cd investment-manager
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase
\`\`\`

4. **Ejecutar script SQL en Supabase**
   - Ve a tu proyecto en Supabase
   - Abre SQL Editor
   - Ejecuta el contenido de `scripts/001-schema.sql`

5. **Iniciar servidor local**
\`\`\`bash
npm run dev
\`\`\`

La app estará disponible en `http://localhost:3000`

## Flujo de Uso

### 1. Registro/Login
- Crea una cuenta o inicia sesión
- Confirma tu email

### 2. Dashboard
- Ve tu saldo total
- ROI promedio de tus inversiones
- Últimos movimientos

### 3. Crear Inversión
- Selecciona plataforma, instrumento, moneda
- Ingresa cantidad y precio de compra
- El sistema calcula comisiones automáticamente
- Se crea un movimiento de egreso automáticamente

### 4. Ver Inversiones
- Tabla con todas tus inversiones
- Información de ROI en tiempo real

### 5. Movimientos
- Historial completo de ingresos/egresos
- Detalles de cada transacción

## Modelo de Datos

### Inversión
\`\`\`
- Plataforma (IOL, Binance, etc.)
- Instrumento (CEDEAR, Acción, etc.)
- Cantidad
- Precio Promedio de Costo (PPC)
- Comisión (automática)
- Fecha de compra
- Fecha de venta (opcional)
- Estado (activa/finalizada/programada)
\`\`\`

### Movimiento (Automático)
\`\`\`
- Tipo: Ingreso o Egreso
- Monto
- Moneda
- Fecha
- Descripción
- Vinculado a inversión
\`\`\`

## Cálculos Automáticos

### ROI (Return on Investment)
\`\`\`
ROI = ((Monto Venta - Monto Invertido) / Monto Invertido) * 100
\`\`\`

### Comisión
\`\`\`
Comisión = (Monto × Porcentaje) / 100
\`\`\`

### Ganancia Nominal
\`\`\`
Ganancia = Monto Venta - Monto Invertido
\`\`\`

## Seguridad

- **Row Level Security (RLS)**: Cada usuario solo ve sus propios datos
- **Autenticación**: Supabase Auth con email/contraseña
- **Encriptación**: Todas las conexiones son HTTPS
- **JWT Tokens**: Sesiones seguras con renovación automática

## Deployment

### Vercel (Recomendado)

1. Push a GitHub
2. Conecta repositorio en Vercel
3. Configura variables de entorno:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy automático

## API Endpoints

### Inversiones
\`\`\`
POST /api/inversiones - Crear inversión
GET /api/inversiones - Listar inversiones
PUT /api/inversiones/:id - Actualizar
DELETE /api/inversiones/:id - Eliminar
\`\`\`

### Movimientos
\`\`\`
POST /api/movimientos - Crear movimiento
GET /api/movimientos - Listar movimientos
\`\`\`

## Troubleshooting

### Error: "Not authenticated"
- Confirma tu email en Supabase
- Limpia cookies del navegador

### Error: "RLS policy violation"
- Asegúrate de estar logueado
- Verifica que los IDs de usuario sean correctos

### Gráficos no aparecen
- Verifica que haya datos en la base de datos
- Revisa la consola de navegador para errores

## Desarrollo

### Agregar nueva plataforma
1. Accede a Supabase
2. Inserta en tabla `plataformas`
3. Agrega comisiones en `comisiones_plataforma`

### Modificar comisiones
- Dashboard Admin (próximamente)
- O directamente en Supabase

## Próximas Características

- Admin panel para gestión de plataformas
- Exportar datos a Excel
- Notificaciones via email
- API pública
- App móvil nativa
- Integración con APIs de cotizaciones en tiempo real

## Soporte

Para reportar bugs o sugerencias, abre un issue en GitHub.

## Licencia

MIT

## Autor

Creado con ❤️ usando v0.app

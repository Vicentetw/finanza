-- Investment Manager - Complete Schema
-- Run this in Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE investment_state AS ENUM ('activa', 'finalizada', 'programada');
CREATE TYPE movement_type AS ENUM ('ingreso', 'egreso');
CREATE TYPE instrument_type AS ENUM ('cedear', 'accion', 'bono', 'fondo', 'cripto', 'caución', 'plazo_fijo');
CREATE TYPE platform_type AS ENUM ('broker', 'banco', 'exchange', 'wallet');

-- Users table
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    nombre text NOT NULL,
    rol user_role DEFAULT 'user',
    foto_perfil text,
    moneda_preferida text DEFAULT 'USD',
    notificaciones_activas boolean DEFAULT true,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_rol ON public.users(rol);

-- Monedas
CREATE TABLE public.monedas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_iso text NOT NULL UNIQUE,
    símbolo text NOT NULL,
    nombre text NOT NULL,
    país text,
    tipo_cambio numeric(15, 6),
    activa boolean DEFAULT true,
    orden integer,
    creada_en timestamp with time zone DEFAULT now(),
    actualizada_en timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_monedas_codigo ON public.monedas(codigo_iso);

INSERT INTO public.monedas (codigo_iso, símbolo, nombre, país, tipo_cambio, orden)
VALUES
    ('USD', '$', 'Dólar Estadounidense', 'USA', 1.0, 1),
    ('ARS', '$', 'Peso Argentino', 'Argentina', 1050.50, 2),
    ('EUR', '€', 'Euro', 'Eurozona', 1.10, 3),
    ('BRL', 'R$', 'Real Brasileño', 'Brasil', 0.20, 4)
ON CONFLICT (codigo_iso) DO NOTHING;

-- Plataformas
CREATE TABLE public.plataformas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre text NOT NULL UNIQUE,
    tipo platform_type NOT NULL,
    logo_url text,
    url_oficial text,
    activa boolean DEFAULT true,
    notas text,
    creada_en timestamp with time zone DEFAULT now(),
    actualizada_en timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_plataformas_nombre ON public.plataformas(nombre);
CREATE INDEX idx_plataformas_activa ON public.plataformas(activa);

INSERT INTO public.plataformas (nombre, tipo, logo_url)
VALUES
    ('IOL', 'broker', 'https://www.iol.com.ar/favicon.ico'),
    ('Binance', 'exchange', 'https://www.binance.com/favicon.ico'),
    ('Brubank', 'banco', 'https://www.brubank.com/favicon.ico'),
    ('Bull Market', 'broker', 'https://www.bullmarket.com.ar/favicon.ico')
ON CONFLICT (nombre) DO NOTHING;

-- Instrumentos
CREATE TABLE public.instrumentos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo instrument_type NOT NULL,
    nombre text NOT NULL,
    descripción text,
    activo boolean DEFAULT true,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_instrumentos_tipo ON public.instrumentos(tipo);

INSERT INTO public.instrumentos (tipo, nombre, descripción)
VALUES
    ('cedear', 'CEDEAR', 'Certificados de Depósito de Acciones Extranjeras'),
    ('accion', 'Acción', 'Acciones locales y extranjeras'),
    ('bono', 'Bono', 'Títulos de deuda'),
    ('fondo', 'Fondo Común', 'Fondos de inversión'),
    ('cripto', 'Criptomoneda', 'Activos digitales'),
    ('caución', 'Caución', 'Operaciones de caución'),
    ('plazo_fijo', 'Plazo Fijo', 'Depósito a plazo')
ON CONFLICT DO NOTHING;

-- Comisiones por plataforma e instrumento
CREATE TABLE public.comisiones_plataforma (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    plataforma_id uuid NOT NULL REFERENCES public.plataformas(id) ON DELETE CASCADE,
    instrumento_id uuid NOT NULL REFERENCES public.instrumentos(id) ON DELETE CASCADE,
    porcentaje_compra numeric(5, 2) DEFAULT 0,
    porcentaje_venta numeric(5, 2) DEFAULT 0,
    actualizado_en timestamp with time zone DEFAULT now(),
    UNIQUE(plataforma_id, instrumento_id)
);

-- Default commissions for IOL
INSERT INTO public.comisiones_plataforma (plataforma_id, instrumento_id, porcentaje_compra, porcentaje_venta)
SELECT p.id, i.id,
    CASE i.tipo
        WHEN 'cedear' THEN 2.5
        WHEN 'accion' THEN 3.0
        WHEN 'bono' THEN 1.5
        WHEN 'fondo' THEN 2.0
        WHEN 'cripto' THEN 0.5
        WHEN 'caución' THEN 0.1
        WHEN 'plazo_fijo' THEN 0.0
    END,
    CASE i.tipo
        WHEN 'cedear' THEN 2.5
        WHEN 'accion' THEN 3.0
        WHEN 'bono' THEN 1.5
        WHEN 'fondo' THEN 2.0
        WHEN 'cripto' THEN 0.5
        WHEN 'caución' THEN 0.1
        WHEN 'plazo_fijo' THEN 0.0
    END
FROM plataformas p, instrumentos i
WHERE p.nombre = 'IOL'
ON CONFLICT DO NOTHING;

-- Orígenes (ingresos)
CREATE TABLE public.orígenes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    nombre text NOT NULL,
    descripción text,
    activo boolean DEFAULT true,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_orígenes_usuario ON public.orígenes(usuario_id);

-- Destinos (plataformas)
CREATE TABLE public.destinos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plataforma_id uuid NOT NULL REFERENCES public.plataformas(id),
    nombre text NOT NULL,
    activo boolean DEFAULT true,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_destinos_usuario ON public.destinos(usuario_id);
CREATE INDEX idx_destinos_plataforma ON public.destinos(plataforma_id);

-- Inversiones (core)
CREATE TABLE public.inversiones (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plataforma_id uuid NOT NULL REFERENCES public.plataformas(id),
    instrumento_id uuid NOT NULL REFERENCES public.instrumentos(id),
    moneda_id uuid NOT NULL REFERENCES public.monedas(id),
    fecha_compra date NOT NULL,
    ppc_promedio numeric(20, 8) NOT NULL,
    cantidad numeric(20, 8) NOT NULL,
    comisión_compra numeric(20, 2) DEFAULT 0,
    fecha_venta date,
    precio_venta numeric(20, 8),
    cantidad_vendida numeric(20, 8),
    comisión_venta numeric(20, 2) DEFAULT 0,
    estado investment_state DEFAULT 'activa',
    notas text,
    creada_en timestamp with time zone DEFAULT now(),
    actualizada_en timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_inversiones_usuario ON public.inversiones(usuario_id);
CREATE INDEX idx_inversiones_plataforma ON public.inversiones(plataforma_id);
CREATE INDEX idx_inversiones_estado ON public.inversiones(estado);
CREATE INDEX idx_inversiones_fecha ON public.inversiones(fecha_compra DESC);

-- Movimientos (Model B - automatic)
CREATE TABLE public.movimientos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    fecha date NOT NULL,
    tipo movement_type NOT NULL,
    monto numeric(20, 2) NOT NULL,
    moneda_id uuid NOT NULL REFERENCES public.monedas(id),
    origen_id uuid REFERENCES public.orígenes(id) ON DELETE SET NULL,
    destino_id uuid REFERENCES public.destinos(id) ON DELETE SET NULL,
    inversión_id uuid REFERENCES public.inversiones(id) ON DELETE SET NULL,
    descripción text,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_movimientos_usuario ON public.movimientos(usuario_id);
CREATE INDEX idx_movimientos_fecha ON public.movimientos(fecha DESC);
CREATE INDEX idx_movimientos_tipo ON public.movimientos(tipo);
CREATE INDEX idx_movimientos_inversión ON public.movimientos(inversión_id);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inversiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orígenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "users_view_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "inversiones_view_own" ON public.inversiones FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "inversiones_create" ON public.inversiones FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "inversiones_update_own" ON public.inversiones FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "inversiones_delete_own" ON public.inversiones FOR DELETE USING (auth.uid() = usuario_id);

CREATE POLICY "movimientos_view_own" ON public.movimientos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "movimientos_create" ON public.movimientos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "movimientos_update_own" ON public.movimientos FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "movimientos_delete_own" ON public.movimientos FOR DELETE USING (auth.uid() = usuario_id);

CREATE POLICY "orígenes_view_own" ON public.orígenes FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "orígenes_manage_own" ON public.orígenes FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "orígenes_update_own" ON public.orígenes FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "orígenes_delete_own" ON public.orígenes FOR DELETE USING (auth.uid() = usuario_id);

CREATE POLICY "destinos_view_own" ON public.destinos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "destinos_manage_own" ON public.destinos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "destinos_update_own" ON public.destinos FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "destinos_delete_own" ON public.destinos FOR DELETE USING (auth.uid() = usuario_id);

-- Public read for reference tables
CREATE POLICY "public_read_monedas" ON public.monedas FOR SELECT USING (true);
CREATE POLICY "public_read_plataformas" ON public.plataformas FOR SELECT USING (true);
CREATE POLICY "public_read_instrumentos" ON public.instrumentos FOR SELECT USING (true);
CREATE POLICY "public_read_comisiones" ON public.comisiones_plataforma FOR SELECT USING (true);

-- Trigger: Create automatic movement when investment is created
CREATE OR REPLACE FUNCTION crear_movimiento_inversión()
RETURNS TRIGGER AS $$
DECLARE
    destino_id_var uuid;
    monto_total numeric;
BEGIN
    SELECT d.id INTO destino_id_var
    FROM destinos d
    WHERE d.usuario_id = NEW.usuario_id AND d.plataforma_id = NEW.plataforma_id
    LIMIT 1;

    IF destino_id_var IS NULL THEN
        INSERT INTO destinos (usuario_id, nombre, plataforma_id, activo)
        VALUES (NEW.usuario_id, (SELECT nombre FROM plataformas WHERE id = NEW.plataforma_id), NEW.plataforma_id, true)
        RETURNING id INTO destino_id_var;
    END IF;

    monto_total := (NEW.ppc_promedio * NEW.cantidad) + NEW.comisión_compra;

    INSERT INTO movimientos (
        usuario_id,
        fecha,
        tipo,
        monto,
        moneda_id,
        destino_id,
        inversión_id,
        descripción
    ) VALUES (
        NEW.usuario_id,
        NEW.fecha_compra,
        'egreso',
        monto_total,
        NEW.moneda_id,
        destino_id_var,
        NEW.id,
        'Inversión: ' || (SELECT nombre FROM instrumentos WHERE id = NEW.instrumento_id)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_crear_movimiento_inversión ON inversiones;
CREATE TRIGGER trigger_crear_movimiento_inversión
AFTER INSERT ON inversiones
FOR EACH ROW EXECUTE FUNCTION crear_movimiento_inversión();

-- Trigger: Create automatic income movement when investment is sold
CREATE OR REPLACE FUNCTION crear_ingreso_venta()
RETURNS TRIGGER AS $$
DECLARE
    destino_id_var uuid;
    monto_venta numeric;
BEGIN
    IF NEW.estado = 'finalizada' AND OLD.estado = 'activa' THEN
        SELECT d.id INTO destino_id_var
        FROM destinos d
        WHERE d.usuario_id = NEW.usuario_id AND d.plataforma_id = NEW.plataforma_id
        LIMIT 1;

        monto_venta := (NEW.precio_venta * NEW.cantidad_vendida) - NEW.comisión_venta;

        INSERT INTO movimientos (
            usuario_id,
            fecha,
            tipo,
            monto,
            moneda_id,
            destino_id,
            inversión_id,
            descripción
        ) VALUES (
            NEW.usuario_id,
            NEW.fecha_venta,
            'ingreso',
            monto_venta,
            NEW.moneda_id,
            destino_id_var,
            NEW.id,
            'Venta: ' || (SELECT nombre FROM instrumentos WHERE id = NEW.instrumento_id)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_crear_ingreso_venta ON inversiones;
CREATE TRIGGER trigger_crear_ingreso_venta
AFTER UPDATE ON inversiones
FOR EACH ROW EXECUTE FUNCTION crear_ingreso_venta();

-- Auto update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_ts BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_inversiones_ts BEFORE UPDATE ON inversiones FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_movimientos_ts BEFORE UPDATE ON movimientos FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_orígenes_ts BEFORE UPDATE ON orígenes FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_destinos_ts BEFORE UPDATE ON destinos FOR EACH ROW EXECUTE FUNCTION update_timestamp();

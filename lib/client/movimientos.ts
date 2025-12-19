"use client"

import {
  obtenerMovimientos as obtenerServer,
  crearMovimiento as crearServer,
  actualizarMovimiento as actualizarServer,
  eliminarMovimiento as eliminarServer,
  obtenerMovimientoPorId as obtenerPorIdServer,
} from "@/app/actions/movimientos"

export const obtenerMovimientos = () => obtenerServer()
export const obtenerMovimientoPorId = (id: string) => obtenerPorIdServer(id)
export const crearMovimiento = (data: any) => crearServer(data)
export const actualizarMovimiento = (id: string, data: any) =>
  actualizarServer(id, data)
export const eliminarMovimiento = (id: string) => eliminarServer(id)

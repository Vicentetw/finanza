"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  href: string
}

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>
    </Link>
  )
}

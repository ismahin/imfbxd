"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

export default function ProtectedLayout({
	children,
}: {
	children: ReactNode
}) {
	return <>{children}</>
}
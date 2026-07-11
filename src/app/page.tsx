'use client'

import { useRouter } from "next/navigation";

export default async function MainAerway() {
  const router = useRouter()
  router.push('/login')
  return <h1>Hello, World!</h1>
}

export type UserRole = 'donor' | 'ngo'

export type AuthPayload = {
  mode: 'signin' | 'signup'
  role: UserRole
  name?: string
  email: string
  password: string
}

export type AuthResponse = {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  token?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function authenticate(payload: AuthPayload): Promise<AuthResponse> {
  if (!API_BASE_URL) {
    await new Promise((resolve) => setTimeout(resolve, 700))

    return {
      user: {
        id: 'demo-user',
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        role: payload.role,
      },
      token: 'demo-token',
    }
  }

  const response = await fetch(`${API_BASE_URL}/auth/${payload.mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Authentication failed. Please try again.')
  }

  return response.json()
}

// Replace NEXT_PUBLIC_API_BASE_URL with your API origin, for example:
// NEXT_PUBLIC_API_BASE_URL=https://api.example.com
// Expected endpoints: POST /auth/signin and POST /auth/signup
// with a JSON response matching AuthResponse.

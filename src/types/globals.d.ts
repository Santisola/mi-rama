export {}

// Create a type for the roles
export type Roles = 'admin' | 'moderator'

export type User = {

}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }

  interface Profile {
    approved: boolean
    id: string,
    name: string | null,
    created_at: string,
    id_rama: number | null,
    ramas: {
        id: number,
        nombre: string
    } | null | undefined,
    email: string
}
}
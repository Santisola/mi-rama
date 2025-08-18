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
}
import jwt from 'jsonwebtoken'

export function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId,
    expiresIn: '7d'
  })
}

export function requireAuth(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    response.status(401).json({ message: 'Authentication required.' })
    return
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    request.userId = payload.sub
    next()
  } catch {
    response.status(401).json({ message: 'Your session is invalid or expired.' })
  }
}

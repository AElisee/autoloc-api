import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {}

// ajouter "@UseGuards(JwtAuthGuard)" devant les routes à protéger

import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/role.guard";
import { Roles } from "./roles.decorator";

export const Auth = (...roles: string[]) => {
    roles.push('Admin');
    return applyDecorators(
        UseGuards(AuthGuard, RolesGuard),
        Roles(roles)
    )
}


import { applyDecorators, UseGuards } from "@nestjs/common";
import { ROLES } from "../constants/roles.constants";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/role.guard";
import { Roles } from "./roles.decorator";

export const Auth = (...roles: ROLES[]) => {
    roles.push(ROLES.Admin);
    return applyDecorators(
        UseGuards(AuthGuard, RolesGuard),
        Roles(roles)
    )
}


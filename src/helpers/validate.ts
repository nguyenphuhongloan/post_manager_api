import { validateOrReject } from "class-validator"

export const validateBody = async <T extends Object>(data: T) => {
    return await validateOrReject(data, { whitelist: true, forbidNonWhitelisted: true })
}

export const validateQuery = async <T extends Object>(data: T) => {
    return await validateOrReject(data)
}
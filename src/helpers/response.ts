import { Request } from "express";
import { AppError } from "./error";

export class HandleResponse {
    data: unknown;
    err?: AppError | Error | null;
    pagination?: Pagination;
    
    constructor(data: unknown, err?: AppError | Error, pagination?: Pagination) {
        this.data = data;
        this.err = err ? err : null;
        this.pagination = pagination;
    }
}

export class Pagination {
    page: number;
    limit: number;
    total?: number;
    
    constructor(page: number, limit: number, total?: number) {
        this.page = page;
        this.limit = limit;
        this.total = total;
    }

    static paginationReq = (req: Request) => {
        const pageNum = Number(req.query.page) || 1
        const pageSize = Number(req.query.limit) || 10
        const offset =  pageSize * (pageNum - 1);
        return {
            page: pageNum,
            limit: pageSize,
            offset: offset
        }
    }
}
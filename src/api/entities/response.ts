export interface IResponse<T = any>
{
    success: boolean;
    code: string;
    info: string;
    data: T;
}

export interface IResponse<T = any>
{
    code: string;
    result: T;
    info: string;
    idTransaction: string;
}

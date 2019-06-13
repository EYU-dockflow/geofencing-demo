export interface BCScheme {
    docType: string;
    id:string;
    acl_read?:string[];
    acl_write?:string[];
    created_at?:string[];
    updated_at?:string[];
}
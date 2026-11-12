export type UserRole = 'pending' | 'customer' | 'admin';

export interface UserCustomer{
    id_customer?: string,
    name: string;
    email: string,
    id_publisher: string,
    role: string
}

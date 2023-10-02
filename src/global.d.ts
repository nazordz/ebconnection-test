interface LoginRequest {
    username: string;
    password: string;
}

enum Role {
    Admin = "admin",
    Operator = "Operator",
    Helpdesk = "helpdesk"
}

interface CreateUserRequest {
    username: string;
    email: string;
    phone: string;
    password: string;
    company: string;
    role: Role;
}

interface LoginResponse {
    bearer_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

interface RefreshTokenRequest {
    refresh_token: string;
}

interface CreateTicketRequest {
    issue: string;
    key: string;
}

interface CreateWorkOrderRequest {
    ticket_id: string;
}

interface UpdateWorkOrderRequest {
    work_order_id: string;
}
interface UpdateTicketRequest {
    ticket_id: string;
}

interface SendNotifRequest {
    user_id: string;
}

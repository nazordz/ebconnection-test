import { getCurrentUser } from "@/helpers";
import Ticket, { TicketStatus } from "@/models/tickets";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

export async function createTicket(
    req: Request<{}, {}, CreateTicketRequest>,
    res: Response
) {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        validation.throw();
    }
    try {
        const user = getCurrentUser(req);
        const ticket = await Ticket.create({
            key: req.body.key,
            issue: req.body.issue,
            createdBy: user.id,
            status: TicketStatus.Open
        });
        return res.json(ticket);
    } catch (error) {
        console.log(error)
    }
}

export async function listTicket(req: Request, res: Response) {
    try {
        const tickets = await Ticket.findAll();
        return res.json(tickets);
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'internal server error'
        })
    }
}

export async function doneTicket(req: Request<{}, {}, UpdateTicketRequest>, res: Response) {
    try {
        const ticket = await Ticket.findByPk(req.body.ticket_id)
        const loggedUser = getCurrentUser(req);
        if (ticket == null) {
            throw new Error("ticket not found");
        }
        ticket.status = TicketStatus.Done
        ticket.doneAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
        ticket.doneBy = loggedUser.id;

        await ticket.save();
        return res.json(ticket)
    } catch (error) {
        console.error(error)
        return res.status(404).json({
            message: 'error'
        })
    }
}
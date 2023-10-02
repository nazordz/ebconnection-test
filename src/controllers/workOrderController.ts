import { getCurrentUser } from "@/helpers";
import Ticket, { TicketStatus } from "@/models/tickets";
import WorkOrder, { WorkOrderStatus } from "@/models/workOrder";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

export async function listWo(req: Request, res: Response) {
    const wo = await WorkOrder.findAll();
    return res.json(wo)
}

export async function createWo(
  req: Request<{}, {}, CreateWorkOrderRequest>,
  res: Response
) {
  const validated = validationResult(req);
  if (!validated.isEmpty()) {
    return res.status(422).json(validated.array());
  }
  try {
    const user = getCurrentUser(req);
    const [wo, _] = await Promise.all([
      WorkOrder.create({
        ticketId: req.body.ticket_id,
        createdBy: user.id,
        status: WorkOrderStatus.Open,
      }),
      Ticket.update(
        {
          status: TicketStatus.Submitted,
        },
        {
          where: {
            id: req.body.ticket_id,
          },
        }
      ),
    ]);
    const ticket = await Ticket.findByPk(req.body.ticket_id, {include: WorkOrder});

    return res.json(ticket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function acceptWo(req: Request<{}, {}, UpdateWorkOrderRequest>, res: Response) {
    const validated = validationResult(req);
    if (!validated.isEmpty()) {
        return res.status(422).json(validated.mapped());
    }
    try {
        const wo = await WorkOrder.findByPk(req.body.work_order_id)
        if (wo == null) {
            throw new Error("Work order not found");
        }
        wo.status = WorkOrderStatus.OnProgress;
        await wo.save();
        await Ticket.update({status: TicketStatus.OnProgress}, {
            where: {
                id: wo.ticketId
            }
        })
        const ticket = await Ticket.findByPk(wo.ticketId, {include: WorkOrder});
        return res.json(ticket);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: error,
        });
    }
}

export async function doneWo(req: Request<{}, {}, UpdateWorkOrderRequest>, res: Response) {
    const validated = validationResult(req);
    if (!validated.isEmpty()) {
        return res.status(422).json(validated.mapped());
    }
    try {
        const loggedUser = getCurrentUser(req);
        const wo = await WorkOrder.findByPk(req.body.work_order_id)
        if (wo == null) {
            throw new Error("Work order not found");
        }
        wo.status = WorkOrderStatus.Done;
        wo.doneAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
        wo.doneBy = loggedUser.id;
        await wo.save();
        await Ticket.update({status: TicketStatus.OnProgress}, {
            where: {
                id: wo.ticketId
            }
        })
        const ticket = await Ticket.findByPk(wo.ticketId, {include: WorkOrder});
        return res.json(ticket);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "internal server error",
        });
    }
}

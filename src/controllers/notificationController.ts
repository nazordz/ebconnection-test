import transporter from "@/configs/transporter";
import User from "@/models/user";
import { Request, Response } from "express";

export async function sendNotif(req: Request<{}, {}, SendNotifRequest>, res: Response) {
    const user = await User.findByPk(req.body.user_id)
    if (user == null) {
        return res.status(404).json({
            message: "user not found"
        })
    }
    await transporter.sendMail({
        from: `"nopalnaxcpm" <nopalnaxcpm@gmail.com>`,
        to: user.email,
        subject: 'Notifikasi ke teknisi ' + user.username,
        text: 'Tiket anda sedang kami tinjau'
    })
    return res.json({
        message: 'email has been sent'
    })
}